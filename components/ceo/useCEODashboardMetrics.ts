import { useMemo } from "react";
import type { Deal } from "@/lib/deals";
import type { CEOMetricsResponse, TopPerformanceResponse } from "@/lib/finance";

interface UseCEODashboardMetricsProps {
  ceoMetrics: CEOMetricsResponse | null;
  topPerformance: TopPerformanceResponse | null;
  filteredDeals: Deal[];
}

interface AgentPerformanceData {
  id: string;
  name: string;
  commission: number;
  revenue: number;
}

interface DeveloperPerformanceData {
  id: string;
  name: string;
  value: number;
  commission: number;
}

interface ManagerPerformanceData {
  id: string;
  name: string;
  commission: number;
  revenue: number;
}

export function useCEODashboardMetrics({
  ceoMetrics,
  topPerformance,
  filteredDeals,
}: UseCEODashboardMetricsProps) {
  // Get total pipeline from API (fallback to deals calculation if API data not available)
  const totalPipeline = useMemo(() => {
    return (
      ceoMetrics?.total_pipeline?.value ||
      filteredDeals
        .filter((d) => d.statusId !== "Closed")
        .reduce((sum, d) => {
          const value =
            typeof d.dealValue === "string"
              ? parseFloat(d.dealValue)
              : d.dealValue;
          return sum + (value || 0);
        }, 0)
    );
  }, [ceoMetrics, filteredDeals]);

  // Get closed deals count from API (fallback to deals filtering if API data not available)
  const closedDeals = useMemo(() => {
    return (
      ceoMetrics?.closed_deals?.count ||
      filteredDeals.filter((d) => d.statusId === "Closed").length
    );
  }, [ceoMetrics, filteredDeals]);

  // Get total revenue from API (fallback to deals calculation if API data not available)
  const totalRevenue = useMemo(() => {
    return (
      ceoMetrics?.total_revenue?.value ||
      filteredDeals
        .filter((d) => d.commission?.total)
        .reduce((sum, d) => sum + (d.commission?.total || 0), 0)
    );
  }, [ceoMetrics, filteredDeals]);

  // Get average deal size from API (fallback to deals calculation if API data not available)
  const avgDealSize = useMemo(() => {
    if (ceoMetrics?.avg_deal_size?.value) {
      return ceoMetrics.avg_deal_size.value;
    }
    return filteredDeals.length > 0
      ? filteredDeals.reduce((sum, d) => {
          const value =
            typeof d.dealValue === "string"
              ? parseFloat(d.dealValue)
              : d.dealValue;
          return sum + (value || 0);
        }, 0) / filteredDeals.length
      : 0;
  }, [ceoMetrics, filteredDeals]);

  // Get active agents count from API (fallback to deals calculation if API data not available)
  const activeAgents = useMemo(() => {
    if (ceoMetrics?.active_agents?.value) {
      return ceoMetrics.active_agents.value;
    }
    const uniqueAgents = new Set(
      filteredDeals.map((d) => d.agent?.id).filter((id): id is string => !!id)
    );
    return uniqueAgents.size;
  }, [ceoMetrics, filteredDeals]);

  // Get active developers count from API (fallback to deals calculation if API data not available)
  const activeDevelopers = useMemo(() => {
    if (ceoMetrics?.developers?.value) {
      return ceoMetrics.developers.value;
    }
    const uniqueDevelopers = new Set(
      filteredDeals
        .map((d) => d.developer?.id)
        .filter((id): id is string => !!id)
    );
    return uniqueDevelopers.size;
  }, [ceoMetrics, filteredDeals]);

  // Transform agent performance from API
  const agentPerformance: AgentPerformanceData[] = useMemo(() => {
    if (!topPerformance?.top_agents) return [];
    return topPerformance.top_agents.map((agent) => ({
      id: agent.id,
      name: agent.name,
      commission: agent.total_revenue, // Use total_revenue from API as commission
      revenue: agent.total_revenue, // Keep for consistency
    }));
  }, [topPerformance]);

  // Transform developer performance from API
  const developerPerformance: DeveloperPerformanceData[] = useMemo(() => {
    if (!topPerformance?.top_developers) return [];
    return topPerformance.top_developers.map((dev) => ({
      id: dev.id,
      name: dev.name,
      value: dev.total_revenue, // Use total_revenue from API
      commission: dev.total_revenue, // Use total_revenue for commission display
    }));
  }, [topPerformance]);

  // Transform manager performance from API
  const managerPerformance: ManagerPerformanceData[] = useMemo(() => {
    if (!topPerformance?.top_managers) return [];
    return topPerformance.top_managers.map((manager) => ({
      id: manager.id,
      name: manager.name,
      commission: manager.total_revenue, // Use total_revenue from API as commission
      revenue: manager.total_revenue, // Keep for consistency
    }));
  }, [topPerformance]);

  return {
    totalPipeline,
    closedDeals,
    totalRevenue,
    avgDealSize,
    activeAgents,
    activeDevelopers,
    agentPerformance,
    developerPerformance,
    managerPerformance,
  };
}
