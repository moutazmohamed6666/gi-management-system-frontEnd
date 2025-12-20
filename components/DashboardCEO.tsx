"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DateRangeFilter } from "./DateRangeFilter";
import type { Deal } from "@/lib/deals";
import { dealsApi } from "@/lib/deals";
import {
  TrendingUp,
  Users,
  Building2,
  DollarSign,
  Target,
  Award,
  ArrowUpRight,
  Trophy,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export function DashboardCEO() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  // Fetch all deals
  useEffect(() => {
    const fetchDeals = async () => {
      setIsLoading(true);
      try {
        const response = await dealsApi.getDeals();
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

        setFilteredDeals(deals);
      } catch (err) {
        console.error("Failed to fetch deals:", err);
        setFilteredDeals([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeals();
  }, [startDate, endDate]);

  const totalPipeline = filteredDeals
    .filter((d) => d.statusId !== "Closed")
    .reduce((sum, d) => sum + (parseFloat(d.dealValue) || 0), 0);
  const closedDeals = filteredDeals.filter((d) => d.statusId === "Closed").length;
  const totalRevenue = filteredDeals
    .filter((d) => d.commission?.total)
    .reduce((sum, d) => sum + (d.commission?.total || 0), 0);
  const avgDealSize =
    filteredDeals.length > 0
      ? filteredDeals.reduce((sum, d) => sum + (parseFloat(d.dealValue) || 0), 0) /
        filteredDeals.length
      : 0;

  // Agent performance
  const agentPerformance = [
    { name: "Sarah Johnson", deals: 3, commission: 296400, revenue: 12400000 },
    { name: "Mike Thompson", deals: 2, commission: 116100, revenue: 3950000 },
  ];

  // Developer performance
  const developerPerformance = [
    { name: "Emaar", deals: 1, value: 1450000, commission: 43500 },
    { name: "Damac", deals: 1, value: 2750000, commission: 82500 },
    { name: "Meraas", deals: 1, value: 8200000, commission: 246000 },
    { name: "Nakheel", deals: 1, value: 2150000, commission: 64500 },
    { name: "Dubai Properties", deals: 1, value: 1800000, commission: 54000 },
  ];

  // Monthly revenue trend
  const monthlyRevenue = [
    { month: "Jan", revenue: 95000, deals: 2 },
    { month: "Feb", revenue: 208000, deals: 3 },
    { month: "Mar", revenue: 133500, deals: 2 },
  ];

  // Property type distribution
  const propertyTypes: { name: string; value: number; color: string }[] = [
    { name: "Apartment", value: 2, color: "#3b82f6" },
    { name: "Villa", value: 1, color: "var(--gi-dark-green)" },
    { name: "Townhouse", value: 1, color: "#f59e0b" },
    { name: "Penthouse", value: 1, color: "#8b5cf6" },
  ];

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
              <p className="text-white/80 mb-2">Executive Overview</p>
              <h2 className="text-white mb-1">Business Intelligence</h2>
              <p className="text-white/70">Real-time performance metrics</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <p className="text-white/80 text-sm">This Quarter</p>
              <div className="flex items-center gap-2 mt-1">
                <TrendingUp className="h-5 w-5 text-white" />
                <span className="text-white">+32%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Date Range Filter */}
      <DateRangeFilter onDateChange={handleDateChange} />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Total Pipeline */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-linear-to-br from-blue-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm text-gray-700">
              Total Pipeline
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl text-gray-900">
                AED {(totalPipeline / 1000000).toFixed(1)}M
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <ArrowUpRight className="h-4 w-4" />
                <span>18%</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-1">Active deals</p>
          </CardContent>
        </Card>

        {/* Closed Deals */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-linear-to-br from-green-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm text-gray-700">
              Closed Deals
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <Target className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl text-gray-900">{closedDeals}</div>
            </div>
            <p className="text-sm text-gray-600 mt-1">This quarter</p>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-linear-to-br from-emerald-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm text-gray-700">
              Total Revenue
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl text-gray-900">
                AED {(totalRevenue / 1000).toFixed(0)}K
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-1">Commission earned</p>
          </CardContent>
        </Card>

        {/* Avg Deal Size */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-linear-to-br from-purple-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm text-gray-700">
              Avg Deal Size
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Award className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl text-gray-900">
                AED {(avgDealSize / 1000000).toFixed(2)}M
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-1">Per transaction</p>
          </CardContent>
        </Card>

        {/* Active Agents */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-linear-to-br from-cyan-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm text-gray-700">
              Active Agents
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-cyan-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl text-gray-900">2</div>
            </div>
            <p className="text-sm text-gray-600 mt-1">Producing</p>
          </CardContent>
        </Card>

        {/* Developers */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-linear-to-br from-orange-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm text-gray-700">Developers</CardTitle>
            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl text-gray-900">5</div>
            </div>
            <p className="text-sm text-gray-600 mt-1">Active partnerships</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle>Revenue Trend</CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span>Revenue</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenue}>
                <defs>
                  <linearGradient
                    id="colorRevenueCEO"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
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
                    "Revenue",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#22c55e"
                  strokeWidth={3}
                  name="Revenue (AED)"
                  fill="url(#colorRevenueCEO)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Property Type Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle>Property Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <defs>
                    <filter id="shadowCEO" height="130%">
                      <feDropShadow
                        dx="0"
                        dy="2"
                        stdDeviation="3"
                        floodOpacity="0.3"
                      />
                    </filter>
                  </defs>
                  <Pie
                    data={propertyTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) =>
                      `${name}: ${value} (${(percent ?? 1 * 100).toFixed(0)}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    style={{ filter: "url(#shadowCEO)" }}
                  >
                    {propertyTypes.map((entry, index) => (
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
            <div className="grid grid-cols-4 gap-4 mt-6">
              {propertyTypes.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600">{item.name}</div>
                  <div className="text-xl text-gray-900">{item.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Agents */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle>Top Agents by Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={agentPerformance} layout="vertical">
                <defs>
                  <linearGradient id="colorAgents" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  tickFormatter={(value) => `${value / 1000}K`}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={120}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
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
                  fill="url(#colorAgents)"
                  radius={[0, 8, 8, 0]}
                  name="Commission (AED)"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Developer Performance */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle>Developer Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={developerPerformance}>
                <defs>
                  <linearGradient
                    id="colorDevelopers"
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
                  dataKey="name"
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
                  fill="url(#colorDevelopers)"
                  radius={[8, 8, 0, 0]}
                  name="Commission (AED)"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Leaderboard */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <CardTitle>Agent Leaderboard</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {agentPerformance.map((agent, index) => (
                <div
                  key={agent.name}
                  className="group relative overflow-hidden rounded-xl p-4 bg-linear-to-br from-gray-50 to-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          index === 0
                            ? "bg-linear-to-br from-yellow-400 to-yellow-500"
                            : "bg-linear-to-br from-gray-400 to-gray-500"
                        } text-white shadow-lg`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-gray-900 font-medium">
                          {agent.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {agent.deals} deals closed
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg text-gray-900 font-semibold">
                        AED {(agent.commission / 1000).toFixed(0)}K
                      </div>
                      <div className="text-sm text-gray-600">Commission</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Developers */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle>Top Developers by Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {developerPerformance.slice(0, 5).map((dev, index) => (
                <div
                  key={dev.name}
                  className="group relative overflow-hidden rounded-xl p-4 bg-linear-to-br from-gray-50 to-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300"
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-1.5"
                    style={{ backgroundColor: "var(--gi-dark-green)" }}
                  ></div>
                  <div className="flex items-center justify-between pl-3">
                    <div>
                      <div className="text-gray-900 font-medium">
                        {dev.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {dev.deals} deals
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg text-gray-900 font-semibold">
                        AED {(dev.value / 1000000).toFixed(2)}M
                      </div>
                      <div className="text-sm text-gray-600">Total value</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
