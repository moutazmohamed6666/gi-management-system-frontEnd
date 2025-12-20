// Reports API Types and Utilities

import { apiClient, getAuthToken } from "./api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://dev.shaheen-env.work";

// ============================================================================
// Type Definitions
// ============================================================================

// Report Types matching API
export type ReportType =
  | "monthly_revenue"
  | "commission_summary"
  | "deal_pipeline"
  | "agent_performance";

// Time Period Filter
export type PeriodType = "today" | "week" | "month" | "quarter" | "year";

// Export Format
export type ExportFormat = "excel" | "pdf";

// ============================================================================
// Request Parameters
// ============================================================================

export interface ReportsAnalyticsParams {
  report_type: ReportType;
  from_date?: string; // YYYY-MM-DD
  to_date?: string; // YYYY-MM-DD
  developer_id?: string;
  agent_id?: string;
  project_id?: string;
  period?: PeriodType;
}

export interface ReportsExportParams {
  format: ExportFormat; // Required
  report_type?: ReportType;
  from_date?: string; // YYYY-MM-DD
  to_date?: string; // YYYY-MM-DD
}

// ============================================================================
// Response Types
// ============================================================================

// Monthly Revenue Report
export interface MonthlyRevenueData {
  month: string;
  revenue: number;
  deals: number;
  units: number;
}

export interface MonthlyRevenueResponse {
  report_type: "monthly_revenue";
  data: MonthlyRevenueData[];
  summary: {
    total_revenue: number;
    total_deals: number;
    total_units: number;
    average_deal_value: number;
  };
}

// Commission Summary Report
export interface CommissionSummaryData {
  category: string;
  expected: number;
  collected: number;
  transferred: number;
  pending: number;
}

export interface CommissionSummaryResponse {
  report_type: "commission_summary";
  data: CommissionSummaryData[];
  summary: {
    total_expected: number;
    total_collected: number;
    total_transferred: number;
    total_pending: number;
    collection_rate: number;
  };
}

// Deal Pipeline Report
export interface DealPipelineData {
  stage: string;
  count: number;
  value: number;
  percentage: number;
}

export interface DealPipelineResponse {
  report_type: "deal_pipeline";
  data: DealPipelineData[];
  summary: {
    total_deals: number;
    total_value: number;
    conversion_rate: number;
  };
}

// Agent Performance Report
export interface AgentPerformanceData {
  agent_id: string;
  agent_name: string;
  deals_count: number;
  total_commission: number;
  paid_commission: number;
  unpaid_commission: number;
  payment_percentage: number;
}

export interface AgentPerformanceResponse {
  report_type: "agent_performance";
  data: AgentPerformanceData[];
  summary: {
    total_agents: number;
    total_deals: number;
    total_commission: number;
    average_per_agent: number;
  };
}

// Developer Performance (derived from deals)
export interface DeveloperPerformanceData {
  developer_id: string;
  developer_name: string;
  deals_count: number;
  total_value: number;
  total_commission: number;
  average_deal_size: number;
}

// Union type for all report responses
export type ReportsAnalyticsResponse =
  | MonthlyRevenueResponse
  | CommissionSummaryResponse
  | DealPipelineResponse
  | AgentPerformanceResponse;

// Generic analytics response that covers all types
export interface AnalyticsResponse {
  report_type: string;
  data: unknown[];
  summary: {
    total_revenue?: number;
    total_deals?: number;
    total_commission?: number;
    total_collected?: number;
    total_transferred?: number;
    total_pending?: number;
    total_expected?: number;
    collection_rate?: number;
    conversion_rate?: number;
    average_deal_value?: number;
    average_per_agent?: number;
    total_agents?: number;
    total_units?: number;
    total_value?: number;
  };
  filters_applied?: {
    from_date?: string;
    to_date?: string;
    developer_id?: string;
    agent_id?: string;
    project_id?: string;
    period?: string;
  };
}

// ============================================================================
// API Functions
// ============================================================================

export const reportsApi = {
  // Get analytics data for reports
  getAnalytics: async (
    params: ReportsAnalyticsParams
  ): Promise<AnalyticsResponse> => {
    const queryParams = new URLSearchParams();

    queryParams.append("report_type", params.report_type);

    if (params.from_date) {
      queryParams.append("from_date", params.from_date);
    }
    if (params.to_date) {
      queryParams.append("to_date", params.to_date);
    }
    if (params.developer_id) {
      queryParams.append("developer_id", params.developer_id);
    }
    if (params.agent_id) {
      queryParams.append("agent_id", params.agent_id);
    }
    if (params.project_id) {
      queryParams.append("project_id", params.project_id);
    }
    if (params.period) {
      queryParams.append("period", params.period);
    }

    const queryString = queryParams.toString();
    return apiClient<AnalyticsResponse>(
      `/api/reports/analytics?${queryString}`
    );
  },

  // Get monthly revenue report
  getMonthlyRevenue: async (
    params: Omit<ReportsAnalyticsParams, "report_type">
  ): Promise<AnalyticsResponse> => {
    return reportsApi.getAnalytics({
      ...params,
      report_type: "monthly_revenue",
    });
  },

  // Get commission summary report
  getCommissionSummary: async (
    params: Omit<ReportsAnalyticsParams, "report_type">
  ): Promise<AnalyticsResponse> => {
    return reportsApi.getAnalytics({
      ...params,
      report_type: "commission_summary",
    });
  },

  // Get deal pipeline report
  getDealPipeline: async (
    params: Omit<ReportsAnalyticsParams, "report_type">
  ): Promise<AnalyticsResponse> => {
    return reportsApi.getAnalytics({
      ...params,
      report_type: "deal_pipeline",
    });
  },

  // Get agent performance report
  getAgentPerformance: async (
    params: Omit<ReportsAnalyticsParams, "report_type">
  ): Promise<AnalyticsResponse> => {
    return reportsApi.getAnalytics({
      ...params,
      report_type: "agent_performance",
    });
  },

  // Helper: Get date range for period
  getDateRangeForPeriod: (
    period: PeriodType
  ): { from_date: string; to_date: string } => {
    const today = new Date();
    const toDate = today.toISOString().split("T")[0];
    let fromDate: Date;

    switch (period) {
      case "today":
        fromDate = today;
        break;
      case "week":
        fromDate = new Date(today);
        fromDate.setDate(today.getDate() - 7);
        break;
      case "month":
        fromDate = new Date(today);
        fromDate.setMonth(today.getMonth() - 1);
        break;
      case "quarter":
        fromDate = new Date(today);
        fromDate.setMonth(today.getMonth() - 3);
        break;
      case "year":
        fromDate = new Date(today);
        fromDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        fromDate = new Date(today);
        fromDate.setMonth(today.getMonth() - 1);
    }

    return {
      from_date: fromDate.toISOString().split("T")[0],
      to_date: toDate,
    };
  },

  // Export report data as Excel or PDF
  exportReport: async (params: ReportsExportParams): Promise<void> => {
    const queryParams = new URLSearchParams();

    queryParams.append("format", params.format);

    if (params.report_type) {
      queryParams.append("report_type", params.report_type);
    }
    if (params.from_date) {
      queryParams.append("from_date", params.from_date);
    }
    if (params.to_date) {
      queryParams.append("to_date", params.to_date);
    }

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/api/reports/export?${queryString}`;
    const token = getAuthToken();

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept:
            params.format === "excel"
              ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              : "application/pdf",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Export failed" }));
        throw new Error(errorData.message || `Export failed: ${response.status}`);
      }

      // Get the filename from Content-Disposition header or generate one
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = `report_${params.report_type || "all"}_${new Date().toISOString().split("T")[0]}`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, "");
        }
      } else {
        filename += params.format === "excel" ? ".xlsx" : ".pdf";
      }

      // Create blob and download
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to export report");
    }
  },

  // Export as Excel
  exportExcel: async (
    params: Omit<ReportsExportParams, "format">
  ): Promise<void> => {
    return reportsApi.exportReport({ ...params, format: "excel" });
  },

  // Export as PDF
  exportPdf: async (
    params: Omit<ReportsExportParams, "format">
  ): Promise<void> => {
    return reportsApi.exportReport({ ...params, format: "pdf" });
  },
};

