"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DateRangeFilter } from "./DateRangeFilter";
import type { Deal } from "@/lib/deals";
import { dealsApi } from "@/lib/deals";
import {
  TrendingUp,
  DollarSign,
  Home,
  Building2,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { financeApi } from "@/lib/finance";
import type { AgentMetricsResponse } from "@/lib/finance";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export function DashboardAgent() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [agentDeals, setAgentDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [agentMetrics, setAgentMetrics] = useState<AgentMetricsResponse | null>(
    null
  );
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  // Fetch agent dashboard metrics (server-calculated)
  useEffect(() => {
    const fetchAgentMetrics = async () => {
      try {
        setMetricsLoading(true);
        setMetricsError(null);
        const data = await financeApi.getAgentMetrics();
        setAgentMetrics(data);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load agent metrics";
        setMetricsError(errorMessage);
        console.error("Error fetching agent metrics:", err);
      } finally {
        setMetricsLoading(false);
      }
    };

    fetchAgentMetrics();
  }, []);

  // Fetch deals for current agent
  useEffect(() => {
    const fetchDeals = async () => {
      setIsLoading(true);
      try {
        const userId = sessionStorage.getItem("userId");
        const response = await dealsApi.getDeals({
          agent_id: userId || undefined,
        });
        let deals = Array.isArray(response.data) ? response.data : [];

        // Apply date filter if dates are selected
        if (startDate && endDate) {
          deals = deals.filter((deal) => {
            if (!deal.closeDate) return false;
            const dealDate = new Date(deal.closeDate);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return dealDate >= start && dealDate <= end;
          });
        }

        setAgentDeals(deals);
      } catch (err) {
        console.error("Failed to fetch agent deals:", err);
        setAgentDeals([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeals();
  }, [startDate, endDate]);

  // Calculate commission totals from commissions array
  const getCommissionTotal = (deal: Deal): number => {
    return (
      deal.commissions?.reduce(
        (sum, c) => sum + parseFloat(c.expectedAmount || "0"),
        0
      ) || 0
    );
  };

  const getCommissionPaid = (deal: Deal): number => {
    return (
      deal.commissions?.reduce(
        (sum, c) => sum + parseFloat(c.paidAmount || "0"),
        0
      ) || 0
    );
  };

  // Note: Status checking needs statusId mapping - using client-side check for now
  // TODO: Implement statusId to status name mapping
  const totalCommissionEarned = agentDeals.reduce(
    (sum, d) => sum + getCommissionTotal(d),
    0
  );
  const commissionPaid = agentDeals.reduce(
    (sum, d) => sum + getCommissionPaid(d),
    0
  );
  const commissionUnpaid = totalCommissionEarned - commissionPaid;
  const developersClosed = new Set(
    agentDeals
      .filter((d) => {
        const paidAmount = getCommissionPaid(d);
        const totalAmount = getCommissionTotal(d);
        return paidAmount >= totalAmount && totalAmount > 0;
      })
      .map((d) => d.developer?.name || "")
      .filter((name) => name !== "")
  ).size;

  const monthlyData = useMemo(() => {
    // Show last 6 months (including current month)
    const monthsToShow = 6;
    const now = new Date();
    const buckets = Array.from({ length: monthsToShow }, (_, idx) => {
      const d = new Date(
        now.getFullYear(),
        now.getMonth() - (monthsToShow - 1 - idx),
        1
      );
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      return {
        key,
        monthLabel: d.toLocaleString("en-US", { month: "short" }),
        deals: 0,
        commission: 0,
      };
    });

    const bucketByKey = new Map(buckets.map((b) => [b.key, b]));

    for (const deal of agentDeals) {
      if (!deal.closeDate) continue;
      const d = new Date(deal.closeDate);
      if (Number.isNaN(d.getTime())) continue;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      const bucket = bucketByKey.get(key);
      if (!bucket) continue;
      bucket.deals += 1;
      bucket.commission += getCommissionTotal(deal);
    }

    return buckets.map((b) => ({
      month: b.monthLabel,
      deals: b.deals,
      commission: b.commission,
    }));
  }, [agentDeals]);

  // Status breakdown
  // Note: Using commission status as proxy for deal status
  // TODO: Implement proper statusId to status name mapping
  const statusData = [
    {
      name: "Closed",
      value: agentDeals.filter((d) => {
        const paidAmount = getCommissionPaid(d);
        const totalAmount = getCommissionTotal(d);
        return paidAmount >= totalAmount && totalAmount > 0;
      }).length,
      color: "var(--gi-dark-green)",
    },
    {
      name: "In Progress",
      value: agentDeals.filter((d) => {
        const paidAmount = getCommissionPaid(d);
        const totalAmount = getCommissionTotal(d);
        return paidAmount > 0 && paidAmount < totalAmount;
      }).length,
      color: "#3b82f6",
    },
    {
      name: "Pending",
      value: agentDeals.filter((d) => {
        const paidAmount = getCommissionPaid(d);
        return paidAmount === 0;
      }).length,
      color: "#94a3b8",
    },
  ];

  const currentUser =
    typeof window !== "undefined"
      ? sessionStorage.getItem("username") ||
        sessionStorage.getItem("name") ||
        ""
      : "";

  if (metricsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-[(--gi-dark-green)]" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading agent dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (metricsError || !agentMetrics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto text-red-600" />
          <p className="mt-4 text-red-600 dark:text-red-400">
            {metricsError || "Failed to load agent dashboard"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl gi-bg-dark-green p-8 text-white shadow-xl">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl -ml-24 -mb-24"></div>

        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/80 mb-2">Welcome back,</p>
              <h2 className="text-white mb-1">{currentUser || "Agent"}</h2>
              <p className="text-white/70">Real Estate Agent</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <p className="text-white/80 text-sm">
                {agentMetrics.total_commission.period}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <TrendingUp className="h-5 w-5 text-white" />
                <span className="text-white">
                  {agentMetrics.total_commission.trend >= 0 ? "+" : ""}
                  {agentMetrics.total_commission.trend}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Date Range Filter */}
      <DateRangeFilter onDateChange={handleDateChange} />

      {/* Key Metrics - Modern Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Units Sold */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-linear-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm text-gray-700 dark:text-gray-300">
              Units Sold
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
              <Home className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl text-gray-900 dark:text-gray-100">
                {agentMetrics.units_sold.value}
              </div>
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                <ArrowUpRight className="h-4 w-4" />
                <span>
                  {agentMetrics.units_sold.trend >= 0 ? "+" : ""}
                  {agentMetrics.units_sold.trend}%
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {agentMetrics.units_sold.period}
            </p>
          </CardContent>
        </Card>

        {/* Total Commission */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-linear-to-br from-green-50 to-white dark:from-green-950/30 dark:to-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm text-gray-700 dark:text-gray-300">
              Total Commission
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl text-gray-900 dark:text-gray-100">
                {agentMetrics.total_commission.currency}{" "}
                {(agentMetrics.total_commission.value / 1000).toFixed(0)}K
              </div>
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                <ArrowUpRight className="h-4 w-4" />
                <span>
                  {agentMetrics.total_commission.trend >= 0 ? "+" : ""}
                  {agentMetrics.total_commission.trend}%
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {agentMetrics.total_commission.status}
            </p>
          </CardContent>
        </Card>

        {/* Commission Paid */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-linear-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm text-gray-700 dark:text-gray-300">
              Paid
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl text-gray-900 dark:text-gray-100">
                AED {(commissionPaid / 1000).toFixed(0)}K
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Received
            </p>
          </CardContent>
        </Card>

        {/* Pending Payment */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-linear-to-br from-orange-50 to-white dark:from-orange-950/30 dark:to-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm text-gray-700 dark:text-gray-300">
              Pending
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
              <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl text-gray-900 dark:text-gray-100">
                AED {(commissionUnpaid / 1000).toFixed(0)}K
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Awaiting
            </p>
          </CardContent>
        </Card>

        {/* Developers */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-linear-to-br from-purple-50 to-white dark:from-purple-950/30 dark:to-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm text-gray-700 dark:text-gray-300">
              Developers
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl text-gray-900 dark:text-gray-100">
                {developersClosed}
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Partners
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts - Modern Design */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle>Monthly Performance</CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: "var(--gi-dark-green)" }}
                ></div>
                <span>Commission</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <defs>
                  <linearGradient
                    id="colorCommission"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--gi-dark-green)"
                      stopOpacity={0.9}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--gi-dark-green)"
                      stopOpacity={0.6}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  tickFormatter={(value) => `${value / 1000}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value: number) => [
                    `AED ${value.toLocaleString()}`,
                    "Commission",
                  ]}
                />
                <Bar
                  dataKey="commission"
                  fill="url(#colorCommission)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Deal Status Breakdown */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle>Deal Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <defs>
                    <filter id="shadow" height="130%">
                      <feDropShadow
                        dx="0"
                        dy="2"
                        stdDeviation="3"
                        floodOpacity="0.3"
                      />
                    </filter>
                  </defs>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) =>
                      `${name}: ${value} (${((percent ?? 0) * 100).toFixed(
                        0
                      )}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    style={{ filter: "url(#shadow)" }}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              {statusData.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-xl text-gray-900 dark:text-gray-100">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Deals - Modern Cards */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Recent Deals</CardTitle>
            <span className="text-sm text-gray-600">
              {agentDeals.length} total deals
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                Loading deals...
              </div>
            ) : agentDeals.length === 0 ? (
              <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                No deals found
              </div>
            ) : (
              agentDeals.slice(0, 5).map((deal) => (
                <div
                  key={deal.id}
                  className="group relative overflow-hidden rounded-xl p-4 bg-linear-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-md dark:hover:shadow-xl dark:hover:shadow-black/20 transition-all duration-300"
                >
                  {/* Decorative accent */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-1.5"
                    style={{ backgroundColor: "var(--gi-dark-green)" }}
                  ></div>

                  <div className="flex items-center justify-between pl-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                          <Home className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                        </div>
                        <div>
                          <div className="text-gray-900 dark:text-gray-100 font-medium">
                            {deal.project?.name || "N/A"} - Unit{" "}
                            {deal.unitNumber || "N/A"}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {deal.buyerSellerDetails?.find((d) => d.isBuyer)
                              ?.name || "N/A"}{" "}
                            • {deal.developer?.name || "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <div className="text-lg text-gray-900 dark:text-gray-100 font-semibold">
                        AED{" "}
                        {(parseFloat(deal.dealValue || "0") / 1000).toFixed(0)}K
                      </div>
                      {(() => {
                        const paidAmount = getCommissionPaid(deal);
                        const totalAmount = getCommissionTotal(deal);
                        const status =
                          paidAmount >= totalAmount && totalAmount > 0
                            ? "Paid"
                            : paidAmount > 0
                            ? "Partially Paid"
                            : "Pending";
                        const statusColor =
                          status === "Paid"
                            ? "bg-linear-to-r from-green-600 to-green-500 dark:from-green-500 dark:to-green-400"
                            : status === "Partially Paid"
                            ? "bg-linear-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400"
                            : "bg-linear-to-r from-orange-600 to-orange-500 dark:from-orange-500 dark:to-orange-400";
                        return (
                          <div
                            className={`inline-flex px-3 py-1 rounded-full text-sm text-white ${statusColor}`}
                          >
                            {status}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
