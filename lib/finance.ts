// Finance Dashboard API Types and Utilities

import { apiClient } from "./api";

// ============================================================================
// Type Definitions
// ============================================================================

// KPIs Response
export interface KPIsResponse {
  total_expected_commission: number;
  total_paid_commission: number;
  pending_commission_amount: number;
  commission_breakdown: {
    AGENT: {
      expected: number;
      paid: number;
    };
    MANAGER: {
      expected: number;
      paid: number;
    };
    COMPANY: {
      expected: number;
      paid: number;
    };
  };
  pending_transfers: {
    count: number;
    amount: number;
  };
  overdue_approvals: number;
}

// Deals by Stage Response
export interface DealStage {
  stage: string;
  count: number;
  total_value: number;
}

export type DealsByStageResponse = DealStage[];

// Exceptions Summary Response
export interface ExceptionItem {
  type: string;
  label: string;
  count: number;
}

export type ExceptionsSummaryResponse = ExceptionItem[];

// Commission Transfers Response
export interface CommissionTransfersResponse {
  pending_transfers: {
    count: number;
    amount: number;
  };
  completed_this_month: {
    count: number;
    amount: number;
  };
  avg_transfer_time_hours: number;
}

// Top Performance Response
export interface TopPerformer {
  id: string;
  name: string;
  total_revenue: number;
}

export interface TopPerformanceResponse {
  top_developers: TopPerformer[];
  top_agents: TopPerformer[];
  top_managers: TopPerformer[];
}

// Receivables Forecast Response
export interface ReceivablesForecastResponse {
  next_30_days: number;
  next_60_days: number;
  next_90_days: number;
}

// Recent Finance Notes Response
export interface FinanceNote {
  deal_id: string;
  agent: string;
  finance_note: string;
  timestamp: string;
  added_by: string;
}

export interface RecentFinanceNotesResponse {
  data: FinanceNote[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

// Agent Metrics Response
export interface AgentMetricsResponse {
  units_sold: {
    value: number;
    trend: number;
    period: string;
  };
  total_commission: {
    value: number;
    currency: string;
    trend: number;
    status: string;
    period: string;
  };
}

// Finance Metrics Response
export interface FinanceMetricsResponse {
  collection_rate: {
    value: number;
    trend: "up" | "down" | "stable";
  };
  received: {
    total: number;
    current_month: number;
    month_label: string;
    currency: string;
  };
  expected_commission: {
    total: number;
    currency: string;
  };
  monthly_breakdown: Record<string, number>;
}

// CEO Metrics Response
export interface CEOMetricsResponse {
  total_pipeline: {
    value: number;
    currency: string;
    trend: number;
    period: string;
    label: string;
  };
  closed_deals: {
    count: number;
    period: string;
    previous_count: number;
  };
  executive_overview: {
    quarter_trend: string;
    period: string;
  };
}

// Admin Metrics Response
export interface AdminMetricsResponse {
  total_users: {
    count: number;
    active: number;
    trend: number;
    period: string;
  };
  total_deals: {
    count: number;
    period: string;
  };
}

// ============================================================================
// API Functions
// ============================================================================

export const financeApi = {
  // Get all KPI metrics
  getKPIs: async (): Promise<KPIsResponse> => {
    return apiClient<KPIsResponse>("/api/finance-dashboard/kpis");
  },

  // Get deals breakdown by stage
  getDealsByStage: async (): Promise<DealsByStageResponse> => {
    // TEMP: API removed for now (will be added back later)
    // Previously:
    // return apiClient<DealsByStageResponse>(
    //   "/api/finance-dashboard/deals-by-stage"
    // );
    return [];
  },

  // Get exceptions summary
  getExceptionsSummary: async (): Promise<ExceptionsSummaryResponse> => {
    return apiClient<ExceptionsSummaryResponse>(
      "/api/finance-dashboard/exceptions-summary"
    );
  },

  // Get commission transfers metrics
  getCommissionTransfers: async (): Promise<CommissionTransfersResponse> => {
    return apiClient<CommissionTransfersResponse>(
      "/api/finance-dashboard/commission-transfers"
    );
  },

  // Get top performance by role
  getTopPerformance: async (): Promise<TopPerformanceResponse> => {
    return apiClient<TopPerformanceResponse>(
      "/api/finance-dashboard/top-performance"
    );
  },

  // Get receivables forecast
  getReceivablesForecast: async (): Promise<ReceivablesForecastResponse> => {
    return apiClient<ReceivablesForecastResponse>(
      "/api/finance-dashboard/receivables-forecast"
    );
  },

  // Get recent finance notes
  getRecentFinanceNotes: async (): Promise<RecentFinanceNotesResponse> => {
    return apiClient<RecentFinanceNotesResponse>(
      "/api/finance-dashboard/recent-finance-notes"
    );
  },

  // Get agent-specific dashboard metrics
  getAgentMetrics: async (): Promise<AgentMetricsResponse> => {
    return apiClient<AgentMetricsResponse>(
      "/api/finance-dashboard/agent-metrics"
    );
  },

  // Get finance dashboard metrics
  getFinanceMetrics: async (): Promise<FinanceMetricsResponse> => {
    return apiClient<FinanceMetricsResponse>(
      "/api/finance-dashboard/finance-metrics"
    );
  },

  // Get CEO dashboard metrics
  getCEOMetrics: async (): Promise<CEOMetricsResponse> => {
    return apiClient<CEOMetricsResponse>("/api/finance-dashboard/ceo-metrics");
  },

  // Get admin dashboard metrics
  getAdminMetrics: async (): Promise<AdminMetricsResponse> => {
    return apiClient<AdminMetricsResponse>(
      "/api/finance-dashboard/admin-metrics"
    );
  },
};
