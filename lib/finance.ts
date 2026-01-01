// Finance Dashboard API Types and Utilities

import { apiClient } from "./api";

// ============================================================================
// Type Definitions
// ============================================================================

// KPIs Response
export interface KPIsResponse {
  total_expected_commission: number;
  total_paid_commission: number;
  collected_commissions: number;
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
  pending_external_transfers: {
    count: number;
    amount: number;
  };
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

// Recent Finance Notes Parameters
export interface GetRecentFinanceNotesParams {
  page?: number; // Default: 1
  page_size?: number; // Default: 10
  from_date?: string; // YYYY-MM-DD format
  to_date?: string; // YYYY-MM-DD format
  developer_id?: string;
  agent_id?: string;
  project_id?: string;
  status?: string; // Deal status
  commission_type?: string; // "FIXED", "PERCENTAGE", "OVERRIDE"
}

// Agent Deal Status Breakdown Item
export interface DealStatusBreakdownItem {
  status: string;
  count: number;
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
  deal_status_breakdown?: DealStatusBreakdownItem[];
}

// Agent My Performance Response
export interface AgentMyPerformanceResponse {
  unitsSold: number;
  totalCommission: number;
  paidTransferred: number;
  pending: number;
  numberOfDevelopers: number;
  currency: string;
}

// Agent Monthly Performance Response
export interface MonthlyPerformanceData {
  month: string;
  totalCommission: number;
}

export interface AgentMonthlyPerformanceResponse {
  data: MonthlyPerformanceData[];
  currency: string;
}

// Agent Metrics Parameters
export interface GetAgentMetricsParams {
  agent_id?: string; // Agent ID
  from_date?: string; // YYYY-MM-DD format
  to_date?: string; // YYYY-MM-DD format
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

// Finance Metrics Parameters
export interface GetFinanceMetricsParams {
  from_date?: string; // YYYY-MM-DD format
  to_date?: string; // YYYY-MM-DD format
  developer_id?: string;
  agent_id?: string;
  project_id?: string;
  status?: string; // Deal status
  commission_type?: string; // "FIXED", "PERCENTAGE", "OVERRIDE"
}

// KPIs Parameters
export interface GetKPIsParams {
  from_date?: string; // YYYY-MM-DD format
  to_date?: string; // YYYY-MM-DD format
  developer_id?: string;
  agent_id?: string;
  project_id?: string;
  status?: string; // Deal status
  commission_type?: string; // "FIXED", "PERCENTAGE", "OVERRIDE"
}

// Commission Transfers Parameters
export interface GetCommissionTransfersParams {
  from_date?: string; // YYYY-MM-DD format
  to_date?: string; // YYYY-MM-DD format
  developer_id?: string;
  agent_id?: string;
  project_id?: string;
  status?: string; // Deal status
  commission_type?: string; // "FIXED", "PERCENTAGE", "OVERRIDE"
}

// Top Performance Parameters
export interface GetTopPerformanceParams {
  limit?: number; // Number of top performers to return (default: 3)
  from_date?: string; // YYYY-MM-DD format
  to_date?: string; // YYYY-MM-DD format
  developer_id?: string;
  agent_id?: string;
  project_id?: string;
  status?: string; // Deal status
  commission_type?: string; // "FIXED", "PERCENTAGE", "OVERRIDE"
}

// Receivables Forecast Parameters
export interface GetReceivablesForecastParams {
  from_date?: string; // YYYY-MM-DD format
  to_date?: string; // YYYY-MM-DD format
  developer_id?: string;
  agent_id?: string;
  project_id?: string;
  status?: string; // Deal status
  commission_type?: string; // "FIXED", "PERCENTAGE", "OVERRIDE"
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
  total_revenue: {
    value: number;
    currency: string;
    label: string;
  };
  avg_deal_size: {
    value: number;
    currency: string;
    label: string;
  };
  active_agents: {
    value: number;
    label: string;
  };
  developers: {
    value: number;
    label: string;
  };
}

// CEO Metrics Parameters
export interface GetCEOMetricsParams {
  from_date?: string; // YYYY-MM-DD format
  to_date?: string; // YYYY-MM-DD format
  developer_id?: string;
  agent_id?: string;
  project_id?: string;
  status?: string; // Deal status
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

// Comprehensive Finance Dashboard Parameters
export interface GetComprehensiveDataParams {
  from_date?: string; // YYYY-MM-DD format
  to_date?: string; // YYYY-MM-DD format
  developer_id?: string;
  agent_id?: string;
  purchase_status_id?: string;
}

// Comprehensive Finance Dashboard Response (for Reports)
// Actual API response structure
export interface ComprehensiveFinanceResponse {
  totalRevenue: number;
  dealClosed: number;
  commissionCollected: number;
  pendingCommission: number;
  totalCommission: number;
  grossRevenue: number;
  externalAgentCommissions: number;
  agentCommission: number;
  managerCommission: number;
  netRevenue: number;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
  }>;
  commissionOverview: {
    collectedCommission: number;
    pending: number;
    transferred: number;
    expected: number;
    collectionProgress: number;
  };
  monthlyRevenueDetails: Array<{
    month: string;
    numberOfDeals: number;
    numberOfUnits: number;
    revenue: number;
  }>;
}

// ============================================================================
// API Functions
// ============================================================================

export const financeApi = {
  // Get all KPI metrics
  getKPIs: async (params?: GetKPIsParams): Promise<KPIsResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.from_date) {
      queryParams.append("from_date", params.from_date);
    }
    if (params?.to_date) {
      queryParams.append("to_date", params.to_date);
    }
    if (params?.developer_id) {
      queryParams.append("developer_id", params.developer_id);
    }
    if (params?.agent_id) {
      queryParams.append("agent_id", params.agent_id);
    }
    if (params?.project_id) {
      queryParams.append("project_id", params.project_id);
    }
    if (params?.status) {
      queryParams.append("status", params.status);
    }
    if (params?.commission_type) {
      queryParams.append("commission_type", params.commission_type);
    }

    const queryString = queryParams.toString();
    const endpoint = `/api/finance-dashboard/kpis${
      queryString ? `?${queryString}` : ""
    }`;

    return apiClient<KPIsResponse>(endpoint);
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
  getCommissionTransfers: async (
    params?: GetCommissionTransfersParams
  ): Promise<CommissionTransfersResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.from_date) {
      queryParams.append("from_date", params.from_date);
    }
    if (params?.to_date) {
      queryParams.append("to_date", params.to_date);
    }
    if (params?.developer_id) {
      queryParams.append("developer_id", params.developer_id);
    }
    if (params?.agent_id) {
      queryParams.append("agent_id", params.agent_id);
    }
    if (params?.project_id) {
      queryParams.append("project_id", params.project_id);
    }
    if (params?.status) {
      queryParams.append("status", params.status);
    }
    if (params?.commission_type) {
      queryParams.append("commission_type", params.commission_type);
    }

    const queryString = queryParams.toString();
    const endpoint = `/api/finance-dashboard/commission-transfers${
      queryString ? `?${queryString}` : ""
    }`;

    return apiClient<CommissionTransfersResponse>(endpoint);
  },

  // Get top performance by role
  getTopPerformance: async (
    params?: GetTopPerformanceParams
  ): Promise<TopPerformanceResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.limit) {
      queryParams.append("limit", params.limit.toString());
    }
    if (params?.from_date) {
      queryParams.append("from_date", params.from_date);
    }
    if (params?.to_date) {
      queryParams.append("to_date", params.to_date);
    }
    if (params?.developer_id) {
      queryParams.append("developer_id", params.developer_id);
    }
    if (params?.agent_id) {
      queryParams.append("agent_id", params.agent_id);
    }
    if (params?.project_id) {
      queryParams.append("project_id", params.project_id);
    }
    if (params?.status) {
      queryParams.append("status", params.status);
    }
    if (params?.commission_type) {
      queryParams.append("commission_type", params.commission_type);
    }

    const queryString = queryParams.toString();
    const endpoint = `/api/finance-dashboard/top-performance${
      queryString ? `?${queryString}` : ""
    }`;

    return apiClient<TopPerformanceResponse>(endpoint);
  },

  // Get receivables forecast
  getReceivablesForecast: async (
    params?: GetReceivablesForecastParams
  ): Promise<ReceivablesForecastResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.from_date) {
      queryParams.append("from_date", params.from_date);
    }
    if (params?.to_date) {
      queryParams.append("to_date", params.to_date);
    }
    if (params?.developer_id) {
      queryParams.append("developer_id", params.developer_id);
    }
    if (params?.agent_id) {
      queryParams.append("agent_id", params.agent_id);
    }
    if (params?.project_id) {
      queryParams.append("project_id", params.project_id);
    }
    if (params?.status) {
      queryParams.append("status", params.status);
    }
    if (params?.commission_type) {
      queryParams.append("commission_type", params.commission_type);
    }

    const queryString = queryParams.toString();
    const endpoint = `/api/finance-dashboard/receivables-forecast${
      queryString ? `?${queryString}` : ""
    }`;

    return apiClient<ReceivablesForecastResponse>(endpoint);
  },

  // Get recent finance notes
  getRecentFinanceNotes: async (
    params?: GetRecentFinanceNotesParams
  ): Promise<RecentFinanceNotesResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params?.page_size) {
      queryParams.append("page_size", params.page_size.toString());
    }
    if (params?.from_date) {
      queryParams.append("from_date", params.from_date);
    }
    if (params?.to_date) {
      queryParams.append("to_date", params.to_date);
    }
    if (params?.developer_id) {
      queryParams.append("developer_id", params.developer_id);
    }
    if (params?.agent_id) {
      queryParams.append("agent_id", params.agent_id);
    }
    if (params?.project_id) {
      queryParams.append("project_id", params.project_id);
    }
    if (params?.status) {
      queryParams.append("status", params.status);
    }
    if (params?.commission_type) {
      queryParams.append("commission_type", params.commission_type);
    }

    const queryString = queryParams.toString();
    const endpoint = `/api/finance-dashboard/recent-finance-notes${
      queryString ? `?${queryString}` : ""
    }`;

    return apiClient<RecentFinanceNotesResponse>(endpoint);
  },

  // Get agent-specific dashboard metrics
  getAgentMetrics: async (
    params?: GetAgentMetricsParams
  ): Promise<AgentMetricsResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.agent_id) {
      queryParams.append("agent_id", params.agent_id);
    }
    if (params?.from_date) {
      queryParams.append("from_date", params.from_date);
    }
    if (params?.to_date) {
      queryParams.append("to_date", params.to_date);
    }

    const queryString = queryParams.toString();
    const endpoint = `/api/finance-dashboard/agent-metrics${
      queryString ? `?${queryString}` : ""
    }`;

    return apiClient<AgentMetricsResponse>(endpoint);
  },

  // Get agent my performance metrics
  getAgentMyPerformance: async (
    params?: GetAgentMetricsParams
  ): Promise<AgentMyPerformanceResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.from_date) {
      queryParams.append("from_date", params.from_date);
    }
    if (params?.to_date) {
      queryParams.append("to_date", params.to_date);
    }

    const queryString = queryParams.toString();
    const endpoint = `/api/finance-dashboard/agent-metrics/my-performance${
      queryString ? `?${queryString}` : ""
    }`;

    return apiClient<AgentMyPerformanceResponse>(endpoint);
  },

  // Get agent monthly performance metrics
  getAgentMonthlyPerformance: async (
    params?: GetAgentMetricsParams
  ): Promise<AgentMonthlyPerformanceResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.from_date) {
      queryParams.append("from_date", params.from_date);
    }
    if (params?.to_date) {
      queryParams.append("to_date", params.to_date);
    }

    const queryString = queryParams.toString();
    const endpoint = `/api/finance-dashboard/agent-metrics/monthly-performance${
      queryString ? `?${queryString}` : ""
    }`;

    return apiClient<AgentMonthlyPerformanceResponse>(endpoint);
  },

  // Get finance dashboard metrics
  getFinanceMetrics: async (
    params?: GetFinanceMetricsParams
  ): Promise<FinanceMetricsResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.from_date) {
      queryParams.append("from_date", params.from_date);
    }
    if (params?.to_date) {
      queryParams.append("to_date", params.to_date);
    }
    if (params?.developer_id) {
      queryParams.append("developer_id", params.developer_id);
    }
    if (params?.agent_id) {
      queryParams.append("agent_id", params.agent_id);
    }
    if (params?.project_id) {
      queryParams.append("project_id", params.project_id);
    }
    if (params?.status) {
      queryParams.append("status", params.status);
    }
    if (params?.commission_type) {
      queryParams.append("commission_type", params.commission_type);
    }

    const queryString = queryParams.toString();
    const endpoint = `/api/finance-dashboard/finance-metrics${
      queryString ? `?${queryString}` : ""
    }`;

    return apiClient<FinanceMetricsResponse>(endpoint);
  },

  // Get CEO dashboard metrics
  getCEOMetrics: async (
    params?: GetCEOMetricsParams
  ): Promise<CEOMetricsResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.from_date) {
      queryParams.append("from_date", params.from_date);
    }
    if (params?.to_date) {
      queryParams.append("to_date", params.to_date);
    }
    if (params?.developer_id) {
      queryParams.append("developer_id", params.developer_id);
    }
    if (params?.agent_id) {
      queryParams.append("agent_id", params.agent_id);
    }
    if (params?.project_id) {
      queryParams.append("project_id", params.project_id);
    }
    if (params?.status) {
      queryParams.append("status", params.status);
    }

    const queryString = queryParams.toString();
    const endpoint = `/api/finance-dashboard/ceo-metrics${
      queryString ? `?${queryString}` : ""
    }`;

    return apiClient<CEOMetricsResponse>(endpoint);
  },

  // Get admin dashboard metrics
  getAdminMetrics: async (): Promise<AdminMetricsResponse> => {
    return apiClient<AdminMetricsResponse>(
      "/api/finance-dashboard/admin-metrics"
    );
  },

  // Get comprehensive finance dashboard data (for Reports)
  getComprehensiveData: async (
    params?: GetComprehensiveDataParams
  ): Promise<ComprehensiveFinanceResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.from_date) {
      queryParams.append("from_date", params.from_date);
    }
    if (params?.to_date) {
      queryParams.append("to_date", params.to_date);
    }
    if (params?.developer_id) {
      queryParams.append("developer_id", params.developer_id);
    }
    if (params?.agent_id) {
      queryParams.append("agent_id", params.agent_id);
    }
    if (params?.purchase_status_id) {
      queryParams.append("purchase_status_id", params.purchase_status_id);
    }
    const queryString = queryParams.toString();
    const endpoint = `/api/finance-dashboard/comprehensive${
      queryString ? `?${queryString}` : ""
    }`;

    return apiClient<ComprehensiveFinanceResponse>(endpoint);
  },

  // Export comprehensive finance dashboard data as Excel
  exportComprehensiveData: async (
    params?: GetComprehensiveDataParams
  ): Promise<void> => {
    const queryParams = new URLSearchParams();

    if (params?.from_date) {
      queryParams.append("from_date", params.from_date);
    }
    if (params?.to_date) {
      queryParams.append("to_date", params.to_date);
    }
    if (params?.developer_id) {
      queryParams.append("developer_id", params.developer_id);
    }
    if (params?.agent_id) {
      queryParams.append("agent_id", params.agent_id);
    }
    if (params?.purchase_status_id) {
      queryParams.append("purchase_status_id", params.purchase_status_id);
    }
    const queryString = queryParams.toString();
    const endpoint = `/api/finance-dashboard/comprehensive/export${
      queryString ? `?${queryString}` : ""
    }`;

    // Use apiClient with blob response type
    const blob = await apiClient<Blob>(endpoint, {
      responseType: "blob",
    });

    // Trigger download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `finance-report-${
      new Date().toISOString().split("T")[0]
    }.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};
