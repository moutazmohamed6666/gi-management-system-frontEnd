// Deals API Types and Utilities

import { apiClient } from "./api";

// ============================================================================
// Type Definitions
// ============================================================================

// API Deal Types (matching actual API response)
export interface Project {
  id: string;
  name: string;
  developerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Developer {
  id: string;
  name: string;
  userId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface BuyerSellerDetail {
  id: string;
  dealId: string;
  name: string;
  phone: string;
  nationalityId?: string;
  sourceId?: string;
  isBuyer: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Agent {
  id: string;
  username: string;
  email: string;
  name: string;
  roleId?: string;
  defaultCommissionTypeId?: string | null;
  defaultCommissionValue?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Manager {
  id: string;
  username: string;
  email: string;
  name: string;
  roleId?: string;
  defaultCommissionTypeId?: string | null;
  defaultCommissionValue?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Commission {
  id: string;
  dealId: string;
  typeId: string;
  roleId: string;
  statusId: string;
  expectedAmount: string;
  paidAmount: string;
  currency: string;
  dueDate: string | null;
  paidDate: string | null;
  ruleId: string | null;
  isOverride: boolean;
  overrideReason: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// Deal type matching the actual API response
export interface Deal {
  id: string;
  dealNumber: string;
  stageId?: string;
  statusId?: string;
  purchaseStatusId?: string;
  dealValue: string; // String in API
  totalCommissionTypeId?: string | null;
  totalCommissionValue?: string | null;
  closeDate: string;
  bookingDate?: string;
  cfExpiry?: string;
  dealTypeId?: string;
  numberOfDeal?: number;
  propertyName?: string;
  propertyTypeId?: string;
  unitNumber?: string;
  unitTypeId?: string;
  size?: string;
  buyerId?: string;
  sellerId?: string;
  developerId?: string;
  projectId?: string;
  agentId?: string;
  managerId?: string;
  createdAt: string;
  updatedAt: string;
  // Related objects
  project: Project;
  developer: Developer;
  agent: Agent;
  manager?: Manager;
  buyerSellerDetails: BuyerSellerDetail[];
  commissions: Commission[];
  // Helper getters (computed from arrays)
  buyer?: BuyerSellerDetail | null;
  seller?: BuyerSellerDetail | null;
  // Computed commission summary
  commission?: {
    total: number;
    paid: number;
    status: "Pending" | "Partially Paid" | "Paid";
  };
}

// Get All Deals Response (with search and filters)
export interface GetDealsParams {
  search?: string;
  // Prefer snake_case to match backend query params
  status_id?: string; // UUID for deal status
  stage_id?: string; // UUID for deal stage
  // Backward compat (older callers)
  statusId?: string; // UUID for deal status
  stageId?: string; // UUID for deal stage
  agent_id?: string;
  developer_id?: string;
  project_id?: string;
  page?: number;
  page_size?: number;
}

export interface GetDealsResponse {
  data: Deal[];
  total: number;
  page: number;
  page_size: number;
}

// Create Deal Request (matching actual API payload)
export interface AdditionalAgent {
  agentId?: string;
  externalAgentName?: string;
  commissionTypeId: string;
  commissionValue: number;
  isInternal: boolean;
}

export interface BuyerSellerInput {
  name: string;
  phone: string;
  nationalityId: string;
  sourceId: string;
}

export interface CreateDealRequest {
  dealValue: number;
  developerId: string;
  projectId: string;
  agentId: string;
  bookingDate: string; // ISO date string
  cfExpiry: string; // ISO date string
  closeDate: string; // ISO date string
  dealTypeId: string;
  numberOfDeal?: number;
  propertyName: string;
  propertyTypeId: string;
  unitNumber: string;
  unitTypeId: string;
  size: number;
  buyer: BuyerSellerInput;
  seller: BuyerSellerInput;
  buyerId?: string; // Optional - for existing buyer
  sellerId?: string; // Optional - for existing seller
  agentCommissionTypeId?: string;
  agentCommissionValue?: number;
  totalCommissionTypeId?: string;
  totalCommissionValue?: number;
  additionalAgents?: AdditionalAgent[];
  stageId?: string;
  statusId?: string;
  purchaseStatusId?: string;
}

// Create Deal Response
export interface CreateDealResponse {
  id: string;
  dealNumber: string;
  message?: string;
  data: Deal;
}

// Update Deal Request/Response
// Backend typically accepts the same payload shape as create for updates.
export type UpdateDealRequest = CreateDealRequest;
export type UpdateDealResponse = CreateDealResponse | Deal;

// Finance Update Request (for finance role editing deals)
export interface FinanceUpdateDealRequest {
  // Deal overview fields that finance can modify
  dealValue?: number;
  propertyName?: string;
  unitNumber?: string;
  closeDate?: string;
  bookingDate?: string;
  cfExpiry?: string;
  // Buyer/Seller updates
  buyer?: {
    name?: string;
    phone?: string;
    nationalityId?: string;
    sourceId?: string;
  };
  seller?: {
    name?: string;
    phone?: string;
    nationalityId?: string;
    sourceId?: string;
  };
  // Commission fields
  totalCommissionTypeId?: string;
  totalCommissionValue?: number;
  // Finance-specific fields
  financeNotes?: string;
  stageId?: string; // For approval workflow
  statusId?: string;
}

export interface FinanceUpdateDealResponse {
  id: string;
  message?: string;
  data: Deal;
}

// Update Deal Status Request
export interface UpdateDealStatusRequest {
  statusId: string; // UUID
  purchasestatusId?: string; // UUID (optional)
}

// Update Deal Status Response
export interface UpdateDealStatusResponse {
  id: string;
  statusId: string;
  message?: string;
}

// Get Deal by ID Response
export type GetDealByIdResponse = Deal;

// Get Deal Agents Response (for commission transfer)
export interface DealAgent {
  id: string;
  name: string;
  role: "agent" | "manager";
  email?: string;
  commission?: number;
}

export interface GetDealAgentsResponse {
  agents: DealAgent[];
  managers: DealAgent[];
}

// ============================================================================
// API Functions
// ============================================================================

export const dealsApi = {
  // Get all deals with search and filters
  getDeals: async (params?: GetDealsParams): Promise<GetDealsResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.search) {
      queryParams.append("search", params.search);
    }
    const statusId = params?.status_id ?? params?.statusId;
    if (statusId) queryParams.append("status_id", statusId);

    const stageId = params?.stage_id ?? params?.stageId;
    if (stageId) queryParams.append("stage_id", stageId);

    if (params?.agent_id) {
      queryParams.append("agent_id", params.agent_id);
    }
    if (params?.developer_id) {
      queryParams.append("developer_id", params.developer_id);
    }
    if (params?.project_id) {
      queryParams.append("project_id", params.project_id);
    }
    if (params?.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params?.page_size) {
      queryParams.append("page_size", params.page_size.toString());
    }

    const queryString = queryParams.toString();
    const endpoint = `/api/deals${queryString ? `?${queryString}` : ""}`;

    return apiClient<GetDealsResponse>(endpoint);
  },

  // Create a new deal (auto-generates deal number, auto-assigns manager)
  createDeal: async (deal: CreateDealRequest): Promise<CreateDealResponse> => {
    return apiClient<CreateDealResponse>("/api/deals", {
      method: "POST",
      body: JSON.stringify(deal),
    });
  },

  // Update an existing deal
  updateDeal: async (
    dealId: string,
    deal: UpdateDealRequest
  ): Promise<UpdateDealResponse> => {
    return apiClient<UpdateDealResponse>(`/api/deals/${dealId}`, {
      method: "PUT",
      body: JSON.stringify(deal),
    });
  },

  // Update deal status
  updateDealStatus: async (
    dealId: string,
    statusId: string,
    purchasestatusId?: string
  ): Promise<UpdateDealStatusResponse> => {
    const body: UpdateDealStatusRequest = { statusId };
    if (purchasestatusId) {
      body.purchasestatusId = purchasestatusId;
    }
    return apiClient<UpdateDealStatusResponse>(`/api/deals/${dealId}/status`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  // Get deal by ID
  getDealById: async (dealId: string): Promise<GetDealByIdResponse> => {
    return apiClient<GetDealByIdResponse>(`/api/deals/${dealId}`);
  },

  // Get all agents and managers for a deal (for commission transfer)
  getDealAgents: async (dealId: string): Promise<GetDealAgentsResponse> => {
    return apiClient<GetDealAgentsResponse>(`/api/deals/${dealId}/agents`);
  },

  // Finance role: Update deal with finance-specific fields
  updateDealAsFinance: async (
    dealId: string,
    data: FinanceUpdateDealRequest
  ): Promise<FinanceUpdateDealResponse> => {
    return apiClient<FinanceUpdateDealResponse>(
      `/api/deals/${dealId}/finance`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },
};
