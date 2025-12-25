"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { StyledDatePicker } from "./StyledDatePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Download,
  FileText,
  Filter,
  TrendingUp,
  DollarSign,
  Target,
  Users,
  Loader2,
  AlertCircle,
  RefreshCw,
  BarChart3,
} from "lucide-react";
import { Label } from "./ui/label";
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

// Chart color palette
const CHART_COLORS = [
  "var(--gi-dark-green)",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#10b981",
];

export function Reports() {
  // Get user role from sessionStorage
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setUserRole(sessionStorage.getItem("userRole"));
  }, []);

  // Filters
  const { developers, agents, purchaseStatuses } = useFilters();
  const [reportType] = useState<ReportType>("monthly_revenue");
  const [selectedDeveloper, setSelectedDeveloper] = useState("all");
  const [selectedAgent, setSelectedAgent] = useState("all");
  const [selectedPurchaseStatus, setSelectedPurchaseStatus] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType | "custom">(
    "month"
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

  // Set default date range on mount
  useEffect(() => {
    const { from_date, to_date } = reportsApi.getDateRangeForPeriod("month");
    setStartDate(from_date);
    setEndDate(to_date);
  }, []);

  // Fetch analytics data
  const fetchAnalytics = useCallback(async () => {
    if (!startDate || !endDate) return;

    setIsLoading(true);
    setError(null);

    try {
      let response: AnalyticsResponse;

      // Use comprehensive endpoint for finance and CEO roles (no filters supported)
      if (userRole === "finance" || userRole === "ceo") {
        const compData = await financeApi.getComprehensiveData();

        // Transform the comprehensive response to AnalyticsResponse format
        response = {
          report_type: "monthly_revenue",
          data: compData.monthlyRevenueDetails.map((detail) => ({
            month: detail.month,
            revenue: detail.revenue,
            deals: detail.numberOfDeals,
            units: detail.numberOfUnits,
          })),
          summary: {
            total_revenue: compData.totalRevenue,
            total_deals: compData.dealClosed,
            total_collected: compData.commissionCollected,
            total_pending: compData.pendingCommission,
            total_transferred: compData.commissionOverview.transferred,
            total_expected: compData.commissionOverview.expected,
            collection_rate: compData.commissionOverview.collectionProgress,
            total_commission: compData.totalCommission,
            gross_revenue: compData.grossRevenue,
            external_agent_commissions: compData.externalAgentCommissions,
            agent_commission: compData.agentCommission,
            manager_commission: compData.managerCommission,
            net_revenue: compData.netRevenue,
          },
        };
      } else {
        // Use regular reports endpoint for other roles
        response = await reportsApi.getAnalytics({
          report_type: reportType,
          from_date: startDate,
          to_date: endDate,
          developer_id:
            selectedDeveloper !== "all" ? selectedDeveloper : undefined,
          agent_id: selectedAgent !== "all" ? selectedAgent : undefined,
          purchase_status_id:
            selectedPurchaseStatus !== "all"
              ? selectedPurchaseStatus
              : undefined,
        });
      }

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
    reportType,
    startDate,
    endDate,
    selectedDeveloper,
    selectedAgent,
    selectedPurchaseStatus,
    userRole,
  ]);

  // Fetch data when filters change
  useEffect(() => {
    if (startDate && endDate) {
      fetchAnalytics();
    }
  }, [fetchAnalytics, startDate, endDate]);

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

    toast.info(`Exporting as ${format.toUpperCase()}`, {
      description: "Your report is being generated...",
    });

    try {
      await reportsApi.exportReport({
        format,
        report_type: reportType,
        from_date: startDate || undefined,
        to_date: endDate || undefined,
      });

      toast.success("Export Complete", {
        description: `Your ${format.toUpperCase()} report has been downloaded.`,
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

  // Get report type label
  const getReportTypeLabel = (type: ReportType) => {
    switch (type) {
      case "monthly_revenue":
        return "Monthly Revenue";
      case "commission_summary":
        return "Commission Summary";
      case "deal_pipeline":
        return "Deal Pipeline";
      case "agent_performance":
        return "Agent Performance";
      default:
        return "Report";
    }
  };

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
              <p className="text-white/80 mb-2">Business Intelligence</p>
              <h2 className="text-white mb-1">Reports & Analytics</h2>
              <p className="text-white/70">
                Generate comprehensive business reports
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => fetchAnalytics()}
                disabled={isLoading}
                className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExport("excel")}
                disabled={isExporting !== null}
                className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm disabled:opacity-50"
              >
                {isExporting === "excel" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {isExporting === "excel" ? "Exporting..." : "Export Excel"}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExport("pdf")}
                disabled={isExporting !== null}
                className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm disabled:opacity-50"
              >
                {isExporting === "pdf" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
                {isExporting === "pdf" ? "Exporting..." : "Export PDF"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              <CardTitle>Report Filters</CardTitle>
            </div>

            {/* Quick Period Filters */}
            <div className="flex flex-wrap gap-2">
              {(["today", "week", "month", "quarter", "year"] as const).map(
                (period) => (
                  <button
                    key={period}
                    onClick={() => handlePeriodChange(period)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                      selectedPeriod === period
                        ? "bg-green-600 text-white shadow"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* <div>
              <Label htmlFor="reportType">Report Type</Label>
              <Select
                value={reportType}
                onValueChange={(value) => setReportType(value as ReportType)}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly_revenue">
                    Monthly Revenue
                  </SelectItem>
                  <SelectItem value="commission_summary">
                    Commission Summary
                  </SelectItem>
                  <SelectItem value="deal_pipeline">Deal Pipeline</SelectItem>
                  <SelectItem value="agent_performance">
                    Agent Performance
                  </SelectItem>
                </SelectContent>
              </Select>
            </div> */}
            <div>
              <Label htmlFor="developer">Developer</Label>
              <Select
                value={selectedDeveloper}
                onValueChange={(value) => setSelectedDeveloper(value)}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select developer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Developers</SelectItem>
                  {developers.map((dev) => (
                    <SelectItem key={dev.id} value={dev.id}>
                      {dev.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="agent">Agent</Label>
              <Select
                value={selectedAgent}
                onValueChange={(value) => setSelectedAgent(value)}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agents</SelectItem>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="purchaseStatus">Purchase Status</Label>
              <Select
                value={selectedPurchaseStatus}
                onValueChange={(value) => setSelectedPurchaseStatus(value)}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {purchaseStatuses.map((status) => (
                    <SelectItem key={status.id} value={status.id}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <StyledDatePicker
                value={startDate}
                onChange={handleStartDateChange}
                placeholder="Select start date"
                label="From Date"
              />
            </div>
            <div>
              <StyledDatePicker
                value={endDate}
                onChange={handleEndDateChange}
                placeholder="Select end date"
                label="To Date"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">
            Loading report data...
          </span>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-12 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button onClick={fetchAnalytics} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      )}

      {/* Content - only show when not loading and no error */}
      {!isLoading && !error && (
        <>
          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Commission Card */}
            <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-5 pt-4">
                <CardTitle className="text-base font-medium text-gray-600 dark:text-gray-400">
                  Total Commission
                </CardTitle>
                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </CardHeader>
              <CardContent className="pt-0 px-5 pb-4">
                <div className="text-3xl text-gray-900 dark:text-white font-bold">
                  AED{" "}
                  {summaryMetrics.totalCommission >= 1000
                    ? `${(summaryMetrics.totalCommission / 1000).toFixed(0)}K`
                    : summaryMetrics.totalCommission.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            {/* Gross Revenue Card */}
            <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-5 pt-4">
                <CardTitle className="text-base font-medium text-gray-600 dark:text-gray-400">
                  Gross Revenue
                </CardTitle>
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </CardHeader>
              <CardContent className="pt-0 px-5 pb-4">
                <div className="text-3xl text-gray-900 dark:text-white font-bold">
                  AED{" "}
                  {summaryMetrics.grossRevenue >= 1000
                    ? `${(summaryMetrics.grossRevenue / 1000).toFixed(0)}K`
                    : summaryMetrics.grossRevenue.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            {/* Net Revenue Card */}
            <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-teal-50 to-white dark:from-teal-900/20 dark:to-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-5 pt-4">
                <CardTitle className="text-base font-medium text-gray-600 dark:text-gray-400">
                  Net Revenue
                </CardTitle>
                <div className="h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                </div>
              </CardHeader>
              <CardContent className="pt-0 px-5 pb-4">
                <div className="text-3xl text-gray-900 dark:text-white font-bold">
                  AED{" "}
                  {summaryMetrics.netRevenue >= 1000
                    ? `${(summaryMetrics.netRevenue / 1000).toFixed(0)}K`
                    : summaryMetrics.netRevenue.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Main Chart based on report type */}
            <Card className="border-0 shadow-lg">
              <CardContent>
                <div className="space-y-4">
                  {/* Collection & Deals */}
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <Target className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Collection & Deals
                      </p>
                    </div>
                    <div className="space-y-2.5 ml-15">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Collected
                        </span>
                        <span className="text-base font-bold text-gray-900 dark:text-white">
                          AED{" "}
                          {summaryMetrics.commissionCollected >= 1000
                            ? `${(
                                summaryMetrics.commissionCollected / 1000
                              ).toFixed(0)}K`
                            : summaryMetrics.commissionCollected.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Pending
                        </span>
                        <span className="text-base font-bold text-orange-600 dark:text-orange-400">
                          AED{" "}
                          {summaryMetrics.pendingCommission >= 1000
                            ? `${(
                                summaryMetrics.pendingCommission / 1000
                              ).toFixed(0)}K`
                            : summaryMetrics.pendingCommission.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-emerald-200 dark:border-emerald-800">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Deals Closed
                        </span>
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {summaryMetrics.dealClosed}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Commission Breakdown */}
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                        <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Commission Breakdown
                      </p>
                    </div>
                    <div className="space-y-2.5 ml-15">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Agent
                        </span>
                        <span className="text-base font-bold text-gray-900 dark:text-white">
                          AED{" "}
                          {summaryMetrics.agentCommission >= 1000
                            ? `${(
                                summaryMetrics.agentCommission / 1000
                              ).toFixed(0)}K`
                            : summaryMetrics.agentCommission.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          External
                        </span>
                        <span className="text-base font-bold text-cyan-600 dark:text-cyan-400">
                          AED{" "}
                          {summaryMetrics.externalAgentCommissions >= 1000
                            ? `${(
                                summaryMetrics.externalAgentCommissions / 1000
                              ).toFixed(0)}K`
                            : summaryMetrics.externalAgentCommissions.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-indigo-200 dark:border-indigo-800">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Manager
                        </span>
                        <span className="text-base font-bold text-pink-600 dark:text-pink-400">
                          AED{" "}
                          {summaryMetrics.managerCommission >= 1000
                            ? `${(
                                summaryMetrics.managerCommission / 1000
                              ).toFixed(0)}K`
                            : summaryMetrics.managerCommission.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Commission Overview</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span>Collected</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                      <span>Pending</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Commission Progress */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-base font-medium text-gray-700 dark:text-gray-300">
                        Collection Progress
                      </span>
                      <span className="text-base text-gray-900 dark:text-white font-semibold">
                        {analyticsData?.summary?.collection_rate
                          ? `${analyticsData.summary.collection_rate.toFixed(
                              1
                            )}%`
                          : "0%"}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                      <div
                        className="bg-green-500 h-4 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            analyticsData?.summary?.collection_rate || 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Collected
                      </p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        AED{" "}
                        {(
                          analyticsData?.summary?.total_collected || 0
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Pending
                      </p>
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        AED{" "}
                        {(
                          analyticsData?.summary?.total_pending || 0
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Transferred
                      </p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        AED{" "}
                        {(
                          analyticsData?.summary?.total_transferred || 0
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Expected
                      </p>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        AED{" "}
                        {(
                          analyticsData?.summary?.total_expected || 0
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg lg:col-span-2">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle>{getReportTypeLabel(reportType)}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: "var(--gi-dark-green)" }}
                    ></div>
                    <span>Data</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {(() => {
                  // Check if chartData has any non-zero values
                  type ChartDataItem = {
                    revenue?: number;
                    count?: number;
                    value?: number;
                    commission?: number;
                    [key: string]: unknown;
                  };
                  const typedChartData = chartData as ChartDataItem[];
                  const hasData =
                    typedChartData.length > 0 &&
                    (reportType === "monthly_revenue"
                      ? typedChartData.some((item) => (item.revenue || 0) > 0)
                      : reportType === "deal_pipeline"
                      ? typedChartData.some((item) => (item.count || 0) > 0)
                      : typedChartData.some((item) => {
                          const value =
                            item.value ||
                            item.commission ||
                            item.revenue ||
                            item.count ||
                            0;
                          return value > 0;
                        }));

                  if (!hasData) {
                    return (
                      <div className="flex flex-col items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
                        <BarChart3 className="h-12 w-12 mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-1">
                          No Data Available
                        </p>
                        <p className="text-sm text-center">
                          No data available for the selected period and filters
                        </p>
                      </div>
                    );
                  }

                  return (
                    <ResponsiveContainer width="100%" height={300}>
                      {reportType === "monthly_revenue" ? (
                        <LineChart data={chartData}>
                          <defs>
                            <linearGradient
                              id="colorRevenueReport"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="var(--gi-dark-green)"
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor="var(--gi-dark-green)"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f0f0f0"
                          />
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
                            stroke="var(--gi-dark-green)"
                            strokeWidth={3}
                            fill="url(#colorRevenueReport)"
                          />
                        </LineChart>
                      ) : reportType === "deal_pipeline" ? (
                        <PieChart>
                          <Pie
                            data={
                              chartData as Array<{
                                stage: string;
                                count: number;
                                value: number;
                                percentage: number;
                              }>
                            }
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="count"
                            nameKey="stage"
                            label={({ name, percent }) =>
                              `${name ?? ""} ${((percent ?? 0) * 100).toFixed(
                                0
                              )}%`
                            }
                          >
                            {chartData.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={CHART_COLORS[index % CHART_COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: number, name: string) => [
                              value,
                              name,
                            ]}
                          />
                        </PieChart>
                      ) : (
                        <BarChart data={chartData}>
                          <defs>
                            <linearGradient
                              id="colorBarReport"
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
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f0f0f0"
                          />
                          <XAxis
                            dataKey={
                              reportType === "agent_performance"
                                ? "agent_name"
                                : "category"
                            }
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#6b7280", fontSize: 12 }}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#6b7280", fontSize: 12 }}
                            tickFormatter={(value) =>
                              value >= 1000 ? `${value / 1000}K` : value
                            }
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "none",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            }}
                            formatter={(value: number) => [
                              value >= 1000
                                ? `AED ${value.toLocaleString()}`
                                : value,
                              reportType === "agent_performance"
                                ? "Commission"
                                : "Amount",
                            ]}
                          />
                          <Bar
                            dataKey={
                              reportType === "agent_performance"
                                ? "total_commission"
                                : reportType === "commission_summary"
                                ? "collected"
                                : "value"
                            }
                            fill="url(#colorBarReport)"
                            radius={[8, 8, 0, 0]}
                          />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  );
                })()}
              </CardContent>
            </Card>

            {/* Key Metrics Summary Card */}

            {/* Secondary Chart - Commission Breakdown */}
          </div>

          {/* Data Table */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle>{getReportTypeLabel(reportType)} Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                {chartData.length > 0 ? (
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        {reportType === "monthly_revenue" && (
                          <>
                            <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100 font-medium rounded-tl-lg">
                              Month
                            </th>
                            <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                              Deals
                            </th>
                            <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                              Units
                            </th>
                            <th className="text-right py-3 px-4 text-gray-900 dark:text-gray-100 font-medium rounded-tr-lg">
                              Revenue
                            </th>
                          </>
                        )}
                        {reportType === "agent_performance" && (
                          <>
                            <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100 font-medium rounded-tl-lg">
                              Agent
                            </th>
                            <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                              Deals
                            </th>
                            <th className="text-right py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                              Commission
                            </th>
                            <th className="text-right py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                              Paid
                            </th>
                            <th className="text-right py-3 px-4 text-gray-900 dark:text-gray-100 font-medium rounded-tr-lg">
                              Payment %
                            </th>
                          </>
                        )}
                        {reportType === "commission_summary" && (
                          <>
                            <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100 font-medium rounded-tl-lg">
                              Category
                            </th>
                            <th className="text-right py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                              Expected
                            </th>
                            <th className="text-right py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                              Collected
                            </th>
                            <th className="text-right py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                              Transferred
                            </th>
                            <th className="text-right py-3 px-4 text-gray-900 dark:text-gray-100 font-medium rounded-tr-lg">
                              Pending
                            </th>
                          </>
                        )}
                        {reportType === "deal_pipeline" && (
                          <>
                            <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100 font-medium rounded-tl-lg">
                              Stage
                            </th>
                            <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                              Count
                            </th>
                            <th className="text-right py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                              Value
                            </th>
                            <th className="text-right py-3 px-4 text-gray-900 dark:text-gray-100 font-medium rounded-tr-lg">
                              Percentage
                            </th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {chartData.map((row, index) => (
                        <tr
                          key={index}
                          className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          {reportType === "monthly_revenue" && (
                            <>
                              <td className="py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                                {(row as { month: string }).month}
                              </td>
                              <td className="py-3 px-4 text-gray-900 dark:text-gray-100">
                                {(row as { deals: number }).deals}
                              </td>
                              <td className="py-3 px-4 text-gray-900 dark:text-gray-100">
                                {(row as { units: number }).units}
                              </td>
                              <td className="py-3 px-4 text-right text-gray-900 dark:text-gray-100 font-medium">
                                AED{" "}
                                {(
                                  row as { revenue: number }
                                ).revenue.toLocaleString()}
                              </td>
                            </>
                          )}
                          {reportType === "agent_performance" && (
                            <>
                              <td className="py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                                {(row as { agent_name: string }).agent_name}
                              </td>
                              <td className="py-3 px-4 text-gray-900 dark:text-gray-100">
                                {(row as { deals_count: number }).deals_count}
                              </td>
                              <td className="py-3 px-4 text-right text-gray-900 dark:text-gray-100">
                                AED{" "}
                                {(
                                  row as { total_commission: number }
                                ).total_commission.toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-right text-green-600 dark:text-green-400 font-medium">
                                AED{" "}
                                {(
                                  row as { paid_commission: number }
                                ).paid_commission.toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-right text-gray-900 dark:text-gray-100">
                                <div className="flex items-center justify-end gap-2">
                                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-[60px]">
                                    <div
                                      className="bg-green-500 h-2 rounded-full"
                                      style={{
                                        width: `${
                                          (
                                            row as {
                                              payment_percentage: number;
                                            }
                                          ).payment_percentage
                                        }%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span>
                                    {(
                                      row as { payment_percentage: number }
                                    ).payment_percentage.toFixed(1)}
                                    %
                                  </span>
                                </div>
                              </td>
                            </>
                          )}
                          {reportType === "commission_summary" && (
                            <>
                              <td className="py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                                {(row as { category: string }).category}
                              </td>
                              <td className="py-3 px-4 text-right text-gray-900 dark:text-gray-100">
                                AED{" "}
                                {(
                                  row as { expected: number }
                                ).expected.toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-right text-green-600 dark:text-green-400 font-medium">
                                AED{" "}
                                {(
                                  row as { collected: number }
                                ).collected.toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-right text-blue-600 dark:text-blue-400">
                                AED{" "}
                                {(
                                  row as { transferred: number }
                                ).transferred.toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-right text-orange-600 dark:text-orange-400 font-medium">
                                AED{" "}
                                {(
                                  row as { pending: number }
                                ).pending.toLocaleString()}
                              </td>
                            </>
                          )}
                          {reportType === "deal_pipeline" && (
                            <>
                              <td className="py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                                {(row as { stage: string }).stage}
                              </td>
                              <td className="py-3 px-4 text-gray-900 dark:text-gray-100">
                                {(row as { count: number }).count}
                              </td>
                              <td className="py-3 px-4 text-right text-gray-900 dark:text-gray-100">
                                AED{" "}
                                {(
                                  row as { value: number }
                                ).value.toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-right text-gray-900 dark:text-gray-100">
                                {(
                                  row as { percentage: number }
                                ).percentage.toFixed(1)}
                                %
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-12 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    No data available for selected filters
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
