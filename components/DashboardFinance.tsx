"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { DateRangeFilter } from "./DateRangeFilter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { TrendingUp, Loader2, AlertCircle } from "lucide-react";
import { financeApi } from "@/lib/finance";
import { getErrorMessage } from "@/lib/api";
import type {
  KPIsResponse,
  DealsByStageResponse,
  CommissionTransfersResponse,
  TopPerformanceResponse,
  ReceivablesForecastResponse,
  RecentFinanceNotesResponse,
  FinanceMetricsResponse,
} from "@/lib/finance";
import { FinanceKPICards } from "./finance/FinanceKPICards";
import { CommissionBreakdown } from "./finance/CommissionBreakdown";
import { ReceivablesForecast } from "./finance/ReceivablesForecast";
import { DealsByStageChart } from "./finance/DealsByStageChart";
import { CommissionTransfers } from "./finance/CommissionTransfers";
import { TopPerformance } from "./finance/TopPerformance";
import { MonthlyTrendsChart } from "./finance/MonthlyTrendsChart";
import { FinanceNotesTable } from "./finance/FinanceNotesTable";
import { useFilters } from "@/lib/useFilters";

type DashboardSectionErrorKey =
  | "kpis"
  | "commissionTransfers"
  | "topPerformance"
  | "receivablesForecast"
  | "financeNotes"
  | "financeMetrics";

type DashboardSectionErrors = Partial<Record<DashboardSectionErrorKey, string>>;

export function DashboardFinance() {
  const [developerFilter, setDeveloperFilter] = useState("all");
  const [agentFilter, setAgentFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [commissionTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{
    fromDate: string;
    toDate: string;
  }>({ fromDate: "", toDate: "" });

  // API Data States
  const [kpis, setKpis] = useState<KPIsResponse | null>(null);
  const [dealsByStage, setDealsByStage] = useState<DealsByStageResponse>([]);
  const [commissionTransfers, setCommissionTransfers] =
    useState<CommissionTransfersResponse | null>(null);
  const [topPerformance, setTopPerformance] =
    useState<TopPerformanceResponse | null>(null);
  const [receivablesForecast, setReceivablesForecast] =
    useState<ReceivablesForecastResponse | null>(null);
  const [financeNotes, setFinanceNotes] =
    useState<RecentFinanceNotesResponse | null>(null);
  const [financeMetrics, setFinanceMetrics] =
    useState<FinanceMetricsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sectionErrors, setSectionErrors] = useState<DashboardSectionErrors>(
    {}
  );

  // Using getErrorMessage from @/lib/api

  const SectionErrorCard = ({
    title,
    message,
  }: {
    title: string;
    message: string;
  }) => {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 mt-0.5 text-red-600" />
            <div>
              <div className="text-gray-900 dark:text-gray-100 font-medium">
                {title}
              </div>
              <div className="text-sm text-red-600 dark:text-red-400 mt-1">
                {message}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Fetch filter options
  const {
    developers,
    agents,
    projects,
    statuses,
    isLoading: filtersLoading,
  } = useFilters();

  // Fetch all finance dashboard data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setSectionErrors({});

      // Build filter params (shared by finance metrics and recent finance notes)
      const filterParams: {
        from_date?: string;
        to_date?: string;
        developer_id?: string;
        agent_id?: string;
        project_id?: string;
        status?: string;
        commission_type?: string;
      } = {};

      if (dateRange.fromDate) {
        filterParams.from_date = dateRange.fromDate;
      }
      if (dateRange.toDate) {
        filterParams.to_date = dateRange.toDate;
      }
      if (developerFilter && developerFilter !== "all") {
        filterParams.developer_id = developerFilter;
      }
      if (agentFilter && agentFilter !== "all") {
        filterParams.agent_id = agentFilter;
      }
      if (projectFilter && projectFilter !== "all") {
        filterParams.project_id = projectFilter;
      }
      if (statusFilter && statusFilter !== "all") {
        filterParams.status = statusFilter;
      }
      if (commissionTypeFilter && commissionTypeFilter !== "all") {
        filterParams.commission_type = commissionTypeFilter;
      }

      const results = await Promise.allSettled([
        financeApi.getKPIs(filterParams),
        financeApi.getDealsByStage(),
        financeApi.getCommissionTransfers(filterParams),
        financeApi.getTopPerformance({
          ...filterParams,
          limit: 3, // Default limit for top performance
        }),
        financeApi.getReceivablesForecast(filterParams),
        financeApi.getRecentFinanceNotes({
          ...filterParams,
          page: 1,
          page_size: 10,
        }),
        financeApi.getFinanceMetrics(filterParams),
      ]);

      const [
        kpisRes,
        dealsByStageRes,
        commissionTransfersRes,
        topPerformanceRes,
        receivablesForecastRes,
        financeNotesRes,
        financeMetricsRes,
      ] = results;

      const nextErrors: DashboardSectionErrors = {};

      if (kpisRes.status === "fulfilled") {
        setKpis(kpisRes.value);
      } else {
        nextErrors.kpis = getErrorMessage(
          kpisRes.reason,
          "Failed to load KPIs"
        );
        setKpis(null);
        console.error("Error fetching KPIs:", kpisRes.reason);
      }

      // dealsByStage is currently stubbed in lib/finance.ts, but we keep this for future API restore.
      if (dealsByStageRes.status === "fulfilled") {
        setDealsByStage(dealsByStageRes.value);
      } else {
        setDealsByStage([]);
        console.error("Error fetching deals-by-stage:", dealsByStageRes.reason);
      }

      if (commissionTransfersRes.status === "fulfilled") {
        setCommissionTransfers(commissionTransfersRes.value);
      } else {
        nextErrors.commissionTransfers = getErrorMessage(
          commissionTransfersRes.reason,
          "Failed to load commission transfers"
        );
        setCommissionTransfers(null);
        console.error(
          "Error fetching commission transfers:",
          commissionTransfersRes.reason
        );
      }

      if (topPerformanceRes.status === "fulfilled") {
        setTopPerformance(topPerformanceRes.value);
      } else {
        nextErrors.topPerformance = getErrorMessage(
          topPerformanceRes.reason,
          "Failed to load top performance"
        );
        setTopPerformance(null);
        console.error(
          "Error fetching top performance:",
          topPerformanceRes.reason
        );
      }

      if (receivablesForecastRes.status === "fulfilled") {
        setReceivablesForecast(receivablesForecastRes.value);
      } else {
        nextErrors.receivablesForecast = getErrorMessage(
          receivablesForecastRes.reason,
          "Failed to load receivables forecast"
        );
        setReceivablesForecast(null);
        console.error(
          "Error fetching receivables forecast:",
          receivablesForecastRes.reason
        );
      }

      if (financeNotesRes.status === "fulfilled") {
        setFinanceNotes(financeNotesRes.value);
      } else {
        nextErrors.financeNotes = getErrorMessage(
          financeNotesRes.reason,
          "Failed to load finance notes"
        );
        setFinanceNotes(null);
        console.error("Error fetching finance notes:", financeNotesRes.reason);
      }

      if (financeMetricsRes.status === "fulfilled") {
        setFinanceMetrics(financeMetricsRes.value);
      } else {
        nextErrors.financeMetrics = getErrorMessage(
          financeMetricsRes.reason,
          "Failed to load finance metrics"
        );
        setFinanceMetrics(null);
        console.error(
          "Error fetching finance metrics:",
          financeMetricsRes.reason
        );
      }

      setSectionErrors(nextErrors);
      setIsLoading(false);
    };

    fetchData();
  }, [
    dateRange.fromDate,
    dateRange.toDate,
    developerFilter,
    agentFilter,
    projectFilter,
    statusFilter,
    commissionTypeFilter,
  ]);

  const handleDateChange = (start: string, end: string) => {
    setDateRange({ fromDate: start, toDate: end });
  };

  const collectionRate = financeMetrics?.collection_rate.value || 0;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-[(--gi-dark-green)]" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading finance dashboard...
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
              <p className="text-white/80 mb-2">Finance Team</p>
              <h2 className="text-white mb-1">Financial Overview</h2>
              <p className="text-white/70">Commission tracking & approvals</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <p className="text-white/80 text-sm">Collection Rate</p>
              <div className="flex items-center gap-2 mt-1">
                <TrendingUp className="h-5 w-5 text-white" />
                <span className="text-white">{collectionRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filter Bar */}
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6 space-y-4">
          {/* Date Range Filter */}
          <DateRangeFilter
            onDateChange={handleDateChange}
            startDate={dateRange.fromDate}
            endDate={dateRange.toDate}
          />

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700"></div>

          {/* Other Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Developer Filter */}
            <Select
              value={developerFilter}
              onValueChange={setDeveloperFilter}
              disabled={filtersLoading}
            >
              <SelectTrigger className="h-[38px]">
                <SelectValue placeholder="All Developers" />
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

            {/* Agent Filter */}
            <Select
              value={agentFilter}
              onValueChange={setAgentFilter}
              disabled={filtersLoading}
            >
              <SelectTrigger className="h-[38px]">
                <SelectValue placeholder="All Agents" />
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

            {/* Project Filter */}
            <Select
              value={projectFilter}
              onValueChange={setProjectFilter}
              disabled={filtersLoading}
            >
              <SelectTrigger className="h-[38px]">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
              disabled={filtersLoading}
            >
              <SelectTrigger className="h-[38px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status.id} value={status.id}>
                    {status.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics - Row 1 */}
      {sectionErrors.kpis || sectionErrors.financeMetrics ? (
        <SectionErrorCard
          title="Key Metrics"
          message={String(sectionErrors.kpis || sectionErrors.financeMetrics)}
        />
      ) : (
        <FinanceKPICards kpis={kpis} financeMetrics={financeMetrics} />
      )}

      {/* Commission Breakdown Card */}
      {sectionErrors.kpis ? (
        <SectionErrorCard
          title="Commission Breakdown"
          message={String(sectionErrors.kpis)}
        />
      ) : (
        <CommissionBreakdown kpis={kpis} />
      )}

      {/* Receivables Forecast Cards */}
      {sectionErrors.receivablesForecast ? (
        <SectionErrorCard
          title="Receivables Forecast"
          message={String(sectionErrors.receivablesForecast)}
        />
      ) : (
        <ReceivablesForecast forecast={receivablesForecast} />
      )}

      {/* Deals by Stage & Transfer Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DealsByStageChart dealsByStage={dealsByStage} />
        {sectionErrors.commissionTransfers ? (
          <SectionErrorCard
            title="Commission Transfers"
            message={String(sectionErrors.commissionTransfers)}
          />
        ) : (
          <CommissionTransfers commissionTransfers={commissionTransfers} />
        )}
      </div>

      {/* Top Performance Mini-Tables */}
      {sectionErrors.topPerformance ? (
        <SectionErrorCard
          title="Top Performance"
          message={String(sectionErrors.topPerformance)}
        />
      ) : (
        <TopPerformance topPerformance={topPerformance} />
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Received vs Expected */}
        {sectionErrors.financeMetrics ? (
          <SectionErrorCard
            title="Received vs Expected"
            message={String(sectionErrors.financeMetrics)}
          />
        ) : (
          <MonthlyTrendsChart financeMetrics={financeMetrics} />
        )}
      </div>

      {/* Recent Finance Notes */}
      {sectionErrors.financeNotes ? (
        <SectionErrorCard
          title="Recent Finance Notes"
          message={String(sectionErrors.financeNotes)}
        />
      ) : (
        <FinanceNotesTable financeNotes={financeNotes} />
      )}
    </div>
  );
}
