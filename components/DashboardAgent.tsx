"use client";

import { useMemo, useState, useEffect } from "react";
import { DateRangeFilter } from "./DateRangeFilter";
import type { Deal } from "@/lib/deals";
import { dealsApi } from "@/lib/deals";
import { getErrorMessage } from "@/lib/api";
import { Loader2, AlertCircle } from "lucide-react";
import { financeApi } from "@/lib/finance";
import type {
  AgentMetricsResponse,
  AgentMyPerformanceResponse,
  AgentMonthlyPerformanceResponse,
} from "@/lib/finance";
import { DashboardHeader } from "./dashboard-agent/DashboardHeader";
import { MetricsCards } from "./dashboard-agent/MetricsCards";
import { MonthlyPerformanceChart } from "./dashboard-agent/MonthlyPerformanceChart";
import { DealStatusBreakdown } from "./dashboard-agent/DealStatusBreakdown";
import { RecentDeals } from "./dashboard-agent/RecentDeals";

export function DashboardAgent() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [agentDeals, setAgentDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [agentMetrics, setAgentMetrics] = useState<AgentMetricsResponse | null>(
    null
  );
  const [totalDeals, setTotalDeals] = useState(0);
  const [myPerformance, setMyPerformance] =
    useState<AgentMyPerformanceResponse | null>(null);
  const [monthlyPerformance, setMonthlyPerformance] =
    useState<AgentMonthlyPerformanceResponse | null>(null);
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

        // Get agent ID from session storage
        const agentId =
          typeof window !== "undefined"
            ? sessionStorage.getItem("userId") || ""
            : "";

        // Build date filter parameters
        const dateParams: {
          agent_id?: string;
          from_date?: string;
          to_date?: string;
        } = {};

        if (agentId) {
          dateParams.agent_id = agentId;
        }
        if (startDate && endDate) {
          dateParams.from_date = startDate;
          dateParams.to_date = endDate;
        }

        // Fetch all three endpoints in parallel, but handle individual failures gracefully
        const results = await Promise.allSettled([
          financeApi.getAgentMetrics(dateParams),
          financeApi.getAgentMyPerformance(dateParams),
          financeApi.getAgentMonthlyPerformance(dateParams),
        ]);

        // Set metrics if successful
        if (results[0].status === "fulfilled") {
          setAgentMetrics(results[0].value);
        } else {
          console.error("Error fetching agent metrics:", results[0].reason);
        }

        // Set performance data if successful
        if (results[1].status === "fulfilled") {
          setMyPerformance(results[1].value);
        } else {
          console.error("Error fetching my performance:", results[1].reason);
        }

        // Set monthly performance data if successful
        if (results[2].status === "fulfilled") {
          setMonthlyPerformance(results[2].value);
        } else {
          console.error(
            "Error fetching monthly performance:",
            results[2].reason
          );
        }

        // Only show error if all requests failed
        if (results.every((r) => r.status === "rejected")) {
          const errorMessage = results[0].status === "rejected"
              ? getErrorMessage(results[0].reason, "Failed to load agent metrics")
              : "Failed to load agent metrics";
          setMetricsError(errorMessage);
        }
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, "Failed to load agent metrics");
        setMetricsError(errorMessage);
        console.error("Error fetching agent metrics:", err);
      } finally {
        setMetricsLoading(false);
      }
    };

    fetchAgentMetrics();
  }, [startDate, endDate]);

  // Fetch deals for current agent
  useEffect(() => {
    const fetchDeals = async () => {
      setIsLoading(true);
      try {
        const params: {
          start_date?: string;
          end_date?: string;
        } = {};

        // Add date range parameters if dates are selected
        if (startDate && endDate) {
          params.start_date = startDate;
          params.end_date = endDate;
        }

        const response = await dealsApi.getAgentDeals(params);
        const deals = Array.isArray(response.data) ? response.data : [];
        setTotalDeals(response.total);
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

  // Calculate commission totals from commissions array (for deals list display)
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

  // Use API data for metrics, fallback to calculated values if API data not available
  const commissionPaid =
    myPerformance?.paidTransferred ||
    agentDeals.reduce((sum, d) => sum + getCommissionPaid(d), 0);
  const commissionUnpaid =
    myPerformance?.pending ||
    (myPerformance?.totalCommission
      ? myPerformance.totalCommission - commissionPaid
      : agentDeals.reduce((sum, d) => sum + getCommissionTotal(d), 0) -
        commissionPaid);
  const developersClosed =
    myPerformance?.numberOfDevelopers ||
    new Set(
      agentDeals
        .filter((d) => {
          const paidAmount = getCommissionPaid(d);
          const totalAmount = getCommissionTotal(d);
          return paidAmount >= totalAmount && totalAmount > 0;
        })
        .map((d) => d.developer?.name || "")
        .filter((name) => name !== "")
    ).size;

  // Status breakdown - use API data from agentMetrics.deal_status_breakdown
  const statusData = useMemo(() => {
    // Use API data if available
    if (
      agentMetrics?.deal_status_breakdown &&
      agentMetrics.deal_status_breakdown.length > 0
    ) {
      // Define colors for each status
      const statusColors: Record<string, string> = {
        Submitted: "#3b82f6", // blue
        "Finance Review": "#f59e0b", // amber
        Draft: "#94a3b8", // slate
        "CEO Approved": "var(--gi-dark-green)", // green
        "Finance Approval": "#10b981", // emerald
        Closed: "#059669", // green-600
        "CEO Review": "#8b5cf6", // violet
        Rejected: "#ef4444", // red
        Pending: "#f97316", // orange
      };

      return agentMetrics.deal_status_breakdown.map((item) => ({
        name: item.status,
        value: item.count,
        color: statusColors[item.status] || "#6b7280", // default gray
      }));
    }

    // Fallback to calculated values from deals if API data not available
    const closed = agentDeals.filter((d) => {
      const paidAmount = getCommissionPaid(d);
      const totalAmount = getCommissionTotal(d);
      return paidAmount >= totalAmount && totalAmount > 0;
    }).length;

    const inProgress = agentDeals.filter((d) => {
      const paidAmount = getCommissionPaid(d);
      const totalAmount = getCommissionTotal(d);
      return paidAmount > 0 && paidAmount < totalAmount;
    }).length;

    const pending = agentDeals.filter((d) => {
      const paidAmount = getCommissionPaid(d);
      return paidAmount === 0;
    }).length;

    return [
      {
        name: "Closed",
        value: closed,
        color: "var(--gi-dark-green)",
      },
      {
        name: "In Progress",
        value: inProgress,
        color: "#3b82f6",
      },
      {
        name: "Pending",
        value: pending,
        color: "#94a3b8",
      },
    ];
  }, [agentMetrics?.deal_status_breakdown, agentDeals]);

  // Check if all status values are zero
  const totalStatusValue = statusData.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const hasStatusData = totalStatusValue > 0;

  // Check if monthly data has any non-zero values
  const hasMonthlyData = Boolean(
    monthlyPerformance?.data &&
      monthlyPerformance.data.length > 0 &&
      monthlyPerformance.data.some((item) => (item.totalCommission || 0) > 0)
  );

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

  // Only require agentMetrics to render, other data can be optional
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
      <DashboardHeader />

      {/* Date Range Filter */}
      <DateRangeFilter
        onDateChange={handleDateChange}
        startDate={startDate}
        endDate={endDate}
      />

      {/* Key Metrics - Modern Cards */}
      <MetricsCards
        agentMetrics={agentMetrics}
        commissionPaid={commissionPaid}
        commissionUnpaid={commissionUnpaid}
        developersClosed={developersClosed}
      />

      {/* Charts - Modern Design */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance */}
        <MonthlyPerformanceChart
          monthlyPerformance={monthlyPerformance}
          hasMonthlyData={hasMonthlyData}
        />

        {/* Deal Status Breakdown */}
        <DealStatusBreakdown
          statusData={statusData}
          hasStatusData={hasStatusData}
        />
      </div>

      {/* Recent Deals - Modern Cards */}
      <RecentDeals
        agentDeals={agentDeals}
        totalDeals={totalDeals}
        isLoading={isLoading}
        getCommissionPaid={getCommissionPaid}
        getCommissionTotal={getCommissionTotal}
      />
    </div>
  );
}
