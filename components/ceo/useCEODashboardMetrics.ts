import { useMemo } from "react";
import type { CEOMetricsResponse, TopPerformanceResponse } from "@/lib/finance";

interface UseCEODashboardMetricsProps {
  ceoMetrics: CEOMetricsResponse | null;
  topPerformance: TopPerformanceResponse | null;
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
}: UseCEODashboardMetricsProps) {
  // Get total pipeline from API
  const totalPipeline = useMemo(() => {
    return ceoMetrics?.total_pipeline?.value || 0;
  }, [ceoMetrics]);

  // Get closed deals count from API
  const closedDeals = useMemo(() => {
    return ceoMetrics?.closed_deals?.count || 0;
  }, [ceoMetrics]);

  // Get total revenue from API
  const totalRevenue = useMemo(() => {
    return ceoMetrics?.total_revenue?.value || 0;
  }, [ceoMetrics]);

  // Get average deal size from API
  const avgDealSize = useMemo(() => {
    return ceoMetrics?.avg_deal_size?.value || 0;
  }, [ceoMetrics]);

  // Get active agents count from API
  const activeAgents = useMemo(() => {
    return ceoMetrics?.active_agents?.value || 0;
  }, [ceoMetrics]);

  // Get active developers count from API
  const activeDevelopers = useMemo(() => {
    return ceoMetrics?.developers?.value || 0;
  }, [ceoMetrics]);

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
