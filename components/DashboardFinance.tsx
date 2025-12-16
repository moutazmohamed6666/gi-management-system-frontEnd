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
  const [error, setError] = useState<string | null>(null);

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
      try {
        setIsLoading(true);
        setError(null);

        const [
          kpisData,
          dealsByStageData,
          exceptionsData,
          commissionTransfersData,
          topPerformanceData,
          receivablesForecastData,
          financeNotesData,
          financeMetricsData,
        ] = await Promise.all([
          financeApi.getKPIs(),
          financeApi.getDealsByStage(),
          financeApi.getExceptionsSummary(),
          financeApi.getCommissionTransfers(),
          financeApi.getTopPerformance(),
          financeApi.getReceivablesForecast(),
          financeApi.getRecentFinanceNotes(),
          financeApi.getFinanceMetrics(),
        ]);

        setKpis(kpisData);
        setDealsByStage(dealsByStageData);
        setExceptions(exceptionsData);
        setCommissionTransfers(commissionTransfersData);
        setTopPerformance(topPerformanceData);
        setReceivablesForecast(receivablesForecastData);
        setFinanceNotes(financeNotesData);
        setFinanceMetrics(financeMetricsData);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load finance dashboard data";
        setError(errorMessage);
        console.error("Error fetching finance dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
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

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto text-red-600" />
          <p className="mt-4 text-red-600 dark:text-red-400">{error}</p>
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
      <FinanceKPICards kpis={kpis} financeMetrics={financeMetrics} />

      {/* Commission Breakdown Card */}
      <CommissionBreakdown kpis={kpis} />

      {/* Receivables Forecast Cards */}
      <ReceivablesForecast forecast={receivablesForecast} />

      {/* Deals by Stage & Transfer Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DealsByStageChart dealsByStage={dealsByStage} />
        <CommissionTransfers commissionTransfers={commissionTransfers} />
      </div>

      {/* Exception Alerts */}
      <ExceptionsList exceptions={exceptions} />

      {/* Top Performance Mini-Tables */}
      <TopPerformance topPerformance={topPerformance} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Received vs Expected */}
        <MonthlyTrendsChart financeMetrics={financeMetrics} />

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
      <FinanceNotesTable financeNotes={financeNotes} />
    </div>
  );
}
