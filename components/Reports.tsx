"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "./ui/card";
import { useFilters } from "@/lib/useFilters";
import {
  reportsApi,
  type ReportType,
  type PeriodType,
  type AnalyticsResponse,
  type ExportFormat,
} from "@/lib/reports";
import { financeApi } from "@/lib/finance";
import { toast } from "sonner";
import { ReportsHeader } from "./reports/ReportsHeader";
import { ReportsFilters } from "./reports/ReportsFilters";
import { ReportsSummaryCards } from "./reports/ReportsSummaryCards";
import { ReportsCommissionBreakdown } from "./reports/ReportsCommissionBreakdown";
import { ReportsCommissionOverview } from "./reports/ReportsCommissionOverview";
import { ReportsChart } from "./reports/ReportsChart";
import { ReportsLoadingState } from "./reports/ReportsLoadingState";
import { ReportsErrorState } from "./reports/ReportsErrorState";
import { ReportsDataTable } from "./reports/ReportsDataTable";

export function Reports() {
  // Get user role from sessionStorage

  // Filters
  const { developers, agents, purchaseStatuses } = useFilters();
  const [reportType] = useState<ReportType>("monthly_revenue");
  const [selectedDeveloper, setSelectedDeveloper] = useState("all");
  const [selectedAgent, setSelectedAgent] = useState("all");
  const [selectedPurchaseStatus, setSelectedPurchaseStatus] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType | "custom">(
    "custom"
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // API state
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState<ExportFormat | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsResponse | null>(
    null
  );

  // Fetch analytics data
  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Use comprehensive endpoint for finance and CEO roles

      const compData = await financeApi.getComprehensiveData({
        from_date: startDate || undefined,
        to_date: endDate || undefined,
        developer_id:
          selectedDeveloper !== "all" ? selectedDeveloper : undefined,
        agent_id: selectedAgent !== "all" ? selectedAgent : undefined,
        purchase_status_id:
          selectedPurchaseStatus !== "all" ? selectedPurchaseStatus : undefined,
      });

      // Type for monthly revenue items (all optional since API shape varies)
      interface MonthlyRevenueItem {
        month: string;
        dealClosed?: number;
        totalDeals?: number;
        commissionCollected?: number;
        pendingCommission?: number;
        totalCommission?: number;
        grossRevenue?: number;
        externalAgentCommissions?: number;
        agentCommission?: number;
        managerCommission?: number;
        netRevenue?: number;
        revenue?: number;
        numberOfDeals?: number;
        numberOfUnits?: number;
      }

      // Calculate totals from monthlyRevenue array
      const monthlyRevenue = (compData.monthlyRevenue ||
        []) as MonthlyRevenueItem[];
      const totalDeals = monthlyRevenue.reduce(
        (sum, item) => sum + (item.dealClosed || 0),
        0
      );
      const totalCollected = monthlyRevenue.reduce(
        (sum, item) => sum + (item.commissionCollected || 0),
        0
      );
      const totalPending = monthlyRevenue.reduce(
        (sum, item) => sum + (item.pendingCommission || 0),
        0
      );
      const totalCommission = monthlyRevenue.reduce(
        (sum, item) => sum + (item.totalCommission || 0),
        0
      );
      const totalGrossRevenue = monthlyRevenue.reduce(
        (sum, item) => sum + (item.grossRevenue || 0),
        0
      );
      const totalExternalAgentCommissions = monthlyRevenue.reduce(
        (sum, item) => sum + (item.externalAgentCommissions || 0),
        0
      );
      const totalAgentCommission = monthlyRevenue.reduce(
        (sum, item) => sum + (item.agentCommission || 0),
        0
      );
      const totalManagerCommission = monthlyRevenue.reduce(
        (sum, item) => sum + (item.managerCommission || 0),
        0
      );
      const totalNetRevenue = monthlyRevenue.reduce(
        (sum, item) => sum + (item.netRevenue || 0),
        0
      );

      // Transform the comprehensive response to AnalyticsResponse format
      const response: AnalyticsResponse = {
        report_type: "monthly_revenue",
        data: monthlyRevenue.map((item) => ({
          month: item.month,
          revenue: item.grossRevenue || 0,
          closedDeals: item.dealClosed || 0,
          totalDeals: item.totalDeals || 0,
          commissionCollected: item.commissionCollected || 0,
          pendingCommission: item.pendingCommission || 0,
          totalCommission: item.totalCommission || 0,
          grossRevenue: item.grossRevenue || 0,
          externalAgentCommissions: item.externalAgentCommissions || 0,
          agentCommission: item.agentCommission || 0,
          managerCommission: item.managerCommission || 0,
          netRevenue: item.netRevenue || 0,
        })),
        summary: {
          total_revenue: totalGrossRevenue,
          total_deals: totalDeals,
          total_collected: totalCollected,
          total_pending: totalPending,
          total_transferred: compData.commissionOverview?.transferred || 0,
          total_expected: compData.commissionOverview?.expected || 0,
          collection_rate: compData.commissionOverview?.collectionProgress || 0,
          total_commission: totalCommission,
          gross_revenue: totalGrossRevenue,
          external_agent_commissions: totalExternalAgentCommissions,
          agent_commission: totalAgentCommission,
          manager_commission: totalManagerCommission,
          net_revenue: totalNetRevenue,
        },
      };

      setAnalyticsData(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load report data";
      setError(errorMessage);
      toast.error("Report Error", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    startDate,
    endDate,
    selectedDeveloper,
    selectedAgent,
    selectedPurchaseStatus,
  ]);

  // Fetch data when filters change
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedDeveloper("all");
    setSelectedAgent("all");
    setSelectedPurchaseStatus("all");
    setSelectedPeriod("custom");
    setStartDate("");
    setEndDate("");
    // Note: fetchAnalytics will be triggered by useEffect when state updates
  };

  const handlePeriodChange = (period: PeriodType | "custom") => {
    setSelectedPeriod(period);
    if (period !== "custom") {
      const { from_date, to_date } = reportsApi.getDateRangeForPeriod(period);
      setStartDate(from_date);
      setEndDate(to_date);
    }
  };

  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    setSelectedPeriod("custom");
  };

  const handleEndDateChange = (date: string) => {
    setEndDate(date);
    setSelectedPeriod("custom");
  };

  const handleExport = async (format: ExportFormat) => {
    if (isExporting) return; // Prevent multiple exports

    setIsExporting(format);

    toast.info("Exporting as Excel", {
      description: "Your report is being generated...",
    });

    try {
      await financeApi.exportComprehensiveData({
        from_date: startDate || undefined,
        to_date: endDate || undefined,
        developer_id:
          selectedDeveloper !== "all" ? selectedDeveloper : undefined,
        agent_id: selectedAgent !== "all" ? selectedAgent : undefined,
        purchase_status_id:
          selectedPurchaseStatus !== "all" ? selectedPurchaseStatus : undefined,
      });

      toast.success("Export Complete", {
        description: "Your Excel report has been downloaded.",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to export report";
      toast.error("Export Failed", {
        description: errorMessage,
      });
    } finally {
      setIsExporting(null);
    }
  };

  // Get summary metrics from API response
  const summaryMetrics = {
    dealClosed: analyticsData?.summary?.total_deals || 0,
    commissionCollected: analyticsData?.summary?.total_collected || 0,
    pendingCommission: analyticsData?.summary?.total_pending || 0,
    totalCommission: analyticsData?.summary?.total_commission || 0,
    grossRevenue: analyticsData?.summary?.gross_revenue || 0,
    externalAgentCommissions:
      analyticsData?.summary?.external_agent_commissions || 0,
    agentCommission: analyticsData?.summary?.agent_commission || 0,
    managerCommission: analyticsData?.summary?.manager_commission || 0,
    netRevenue: analyticsData?.summary?.net_revenue || 0,
  };

  // Transform API data for charts
  const chartData = analyticsData?.data || [];

  return (
    <div className="space-y-6">
      <ReportsHeader
        isLoading={isLoading}
        isExporting={isExporting}
        onRefresh={fetchAnalytics}
        onExport={handleExport}
      />

      <ReportsFilters
        developers={developers}
        agents={agents}
        purchaseStatuses={purchaseStatuses}
        selectedDeveloper={selectedDeveloper}
        selectedAgent={selectedAgent}
        selectedPurchaseStatus={selectedPurchaseStatus}
        selectedPeriod={selectedPeriod}
        startDate={startDate}
        endDate={endDate}
        onDeveloperChange={setSelectedDeveloper}
        onAgentChange={setSelectedAgent}
        onPurchaseStatusChange={setSelectedPurchaseStatus}
        onPeriodChange={handlePeriodChange}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        onClearFilters={handleClearFilters}
      />

      {isLoading && <ReportsLoadingState />}

      {error && !isLoading && (
        <ReportsErrorState error={error} onRetry={fetchAnalytics} />
      )}

      {/* Content - only show when not loading and no error */}
      {!isLoading && !error && (
        <>
          <ReportsSummaryCards
            metrics={{
              dealsClosed: summaryMetrics.dealClosed,
              totalCommission: summaryMetrics.totalCommission,
              grossRevenue: summaryMetrics.grossRevenue,
              netRevenue: summaryMetrics.netRevenue,
            }}
          />

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardContent>
                <ReportsCommissionBreakdown
                  metrics={{
                    agentCommission: summaryMetrics.agentCommission,
                    externalAgentCommissions:
                      summaryMetrics.externalAgentCommissions,
                    managerCommission: summaryMetrics.managerCommission,
                  }}
                />
              </CardContent>
            </Card>
            <ReportsCommissionOverview analyticsData={analyticsData} />
            <ReportsChart reportType={reportType} chartData={chartData} />
          </div>

          <ReportsDataTable reportType={reportType} chartData={chartData} />
        </>
      )}
    </div>
  );
}
