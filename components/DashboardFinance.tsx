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
import type {
  KPIsResponse,
  DealsByStageResponse,
  ExceptionsSummaryResponse,
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
import { ExceptionsList } from "./finance/ExceptionsList";
import { TopPerformance } from "./finance/TopPerformance";
import { MonthlyTrendsChart } from "./finance/MonthlyTrendsChart";
import { FinanceNotesTable } from "./finance/FinanceNotesTable";
import { useFilters } from "@/lib/useFilters";

type DashboardSectionErrorKey =
  | "kpis"
  | "exceptions"
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
  const [commissionTypeFilter, setCommissionTypeFilter] = useState("all");

  // API Data States
  const [kpis, setKpis] = useState<KPIsResponse | null>(null);
  const [dealsByStage, setDealsByStage] = useState<DealsByStageResponse>([]);
  const [exceptions, setExceptions] = useState<ExceptionsSummaryResponse>([]);
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
  const [sectionErrors, setSectionErrors] = useState<DashboardSectionErrors>({});

  const getErrorMessage = (err: unknown, fallback: string) =>
    err instanceof Error ? err.message : fallback;

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
    commissionTypes,
    isLoading: filtersLoading,
  } = useFilters();

  // Fetch all finance dashboard data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setSectionErrors({});

      const results = await Promise.allSettled([
        financeApi.getKPIs(),
        financeApi.getDealsByStage(),
        financeApi.getExceptionsSummary(),
        financeApi.getCommissionTransfers(),
        financeApi.getTopPerformance(),
        financeApi.getReceivablesForecast(),
        financeApi.getRecentFinanceNotes(),
        financeApi.getFinanceMetrics(),
      ]);

      const [
        kpisRes,
        dealsByStageRes,
        exceptionsRes,
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
        nextErrors.kpis = getErrorMessage(kpisRes.reason, "Failed to load KPIs");
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

      if (exceptionsRes.status === "fulfilled") {
        setExceptions(exceptionsRes.value);
      } else {
        nextErrors.exceptions = getErrorMessage(
          exceptionsRes.reason,
          "Failed to load exceptions"
        );
        setExceptions([]);
        console.error("Error fetching exceptions:", exceptionsRes.reason);
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
        console.error("Error fetching top performance:", topPerformanceRes.reason);
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
        console.error("Error fetching finance metrics:", financeMetricsRes.reason);
      }

      setSectionErrors(nextErrors);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleDateChange = (_start: string, _end: string) => {
    // Date filtering can be implemented when API supports it
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
          <DateRangeFilter onDateChange={handleDateChange} />

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700"></div>

          {/* Other Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

            {/* Commission Type Filter */}
            <Select
              value={commissionTypeFilter}
              onValueChange={setCommissionTypeFilter}
              disabled={filtersLoading}
            >
              <SelectTrigger className="h-[38px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {commissionTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
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

      {/* Exception Alerts */}
      {sectionErrors.exceptions ? (
        <SectionErrorCard
          title="Exceptions Requiring Action"
          message={String(sectionErrors.exceptions)}
        />
      ) : (
        <ExceptionsList exceptions={exceptions} />
      )}

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

        {/* Developer Aging Report - Removed as it's not available in API */}
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
              Developer Aging Report - Coming Soon
            </div>
          </CardContent>
        </Card>
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
