"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { DateRangeFilter } from "./DateRangeFilter";
import type { Deal } from "@/lib/deals";
import { dealsApi } from "@/lib/deals";
import { financeApi } from "@/lib/finance";
import type { CEOMetricsResponse, TopPerformanceResponse } from "@/lib/finance";
import { Loader2, AlertCircle } from "lucide-react";
import { CEOHeader } from "./ceo/CEOHeader";
import { CEOMetricsCards } from "./ceo/CEOMetricsCards";
import { CEOTopAgentsChart } from "./ceo/CEOTopAgentsChart";
import { CEOTopDevelopersChart } from "./ceo/CEOTopDevelopersChart";
import { CEOAgentLeaderboard } from "./ceo/CEOAgentLeaderboard";
import { CEOTopDevelopersTable } from "./ceo/CEOTopDevelopersTable";
import { CEOTopManagersTable } from "./ceo/CEOTopManagersTable";
import { useCEODashboardMetrics } from "./ceo/useCEODashboardMetrics";

export function DashboardCEO() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);
  const [ceoMetrics, setCeoMetrics] = useState<CEOMetricsResponse | null>(null);
  const [topPerformance, setTopPerformance] =
    useState<TopPerformanceResponse | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  // Fetch CEO metrics from API
  useEffect(() => {
    const fetchCEOMetrics = async () => {
      try {
        setMetricsLoading(true);
        setMetricsError(null);

        // Build date parameters for both API calls
        const dateParams: { from_date?: string; to_date?: string } = {};
        if (startDate) {
          dateParams.from_date = startDate;
        }
        if (endDate) {
          dateParams.to_date = endDate;
        }

        const [metricsData, topPerfData] = await Promise.all([
          financeApi.getCEOMetrics(
            Object.keys(dateParams).length > 0 ? dateParams : undefined
          ),
          financeApi.getTopPerformance(
            Object.keys(dateParams).length > 0 ? dateParams : undefined
          ),
        ]);
        setCeoMetrics(metricsData);
        setTopPerformance(topPerfData);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load CEO metrics";
        setMetricsError(errorMessage);
        console.error("Error fetching CEO metrics:", err);
      } finally {
        setMetricsLoading(false);
      }
    };

    fetchCEOMetrics();
  }, [startDate, endDate]);

  // Fetch all deals
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        // Build date parameters for getDeals API
        const dealParams: { start_date?: string; end_date?: string } = {};
        if (startDate) {
          dealParams.start_date = startDate;
        }
        if (endDate) {
          dealParams.end_date = endDate;
        }

        const response = await dealsApi.getDeals(
          Object.keys(dealParams).length > 0 ? dealParams : undefined
        );
        const deals = Array.isArray(response.data) ? response.data : [];
        setFilteredDeals(deals);
      } catch (err) {
        console.error("Failed to fetch deals:", err);
        setFilteredDeals([]);
      }
    };

    fetchDeals();
  }, [startDate, endDate]);

  // Calculate all metrics using custom hook
  const {
    totalPipeline,
    closedDeals,
    totalRevenue,
    avgDealSize,
    activeAgents,
    activeDevelopers,
    agentPerformance,
    developerPerformance,
    managerPerformance,
  } = useCEODashboardMetrics({
    ceoMetrics,
    topPerformance,
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <CEOHeader ceoMetrics={ceoMetrics} />

      {/* Date Range Filter */}
      <DateRangeFilter
        onDateChange={handleDateChange}
        startDate={startDate}
        endDate={endDate}
      />

      {/* Error Display */}
      {metricsError && (
        <Card className="border-0 shadow-lg border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 mt-0.5 text-red-600" />
              <div>
                <div className="text-gray-900 dark:text-gray-100 font-medium">
                  Error Loading Metrics
                </div>
                <div className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {metricsError}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {metricsLoading && (
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-2 py-8">
              <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
              <span className="text-gray-600">Loading CEO metrics...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <CEOMetricsCards
        ceoMetrics={ceoMetrics}
        totalPipeline={totalPipeline}
        closedDeals={closedDeals}
        totalRevenue={totalRevenue}
        avgDealSize={avgDealSize}
        activeAgents={activeAgents}
        activeDevelopers={activeDevelopers}
      />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CEOTopAgentsChart agentPerformance={agentPerformance} />
        <CEOTopDevelopersChart developerPerformance={developerPerformance} />
      </div>

      {/* Performance Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <CEOAgentLeaderboard agentPerformance={agentPerformance} />
        <CEOTopDevelopersTable developerPerformance={developerPerformance} />
        <CEOTopManagersTable managerPerformance={managerPerformance} />
      </div>
    </div>
  );
}
