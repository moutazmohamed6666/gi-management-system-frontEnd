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

// Commission Type for new API structure (can be used with required or optional fields)
export interface CommissionType {
  id: string;
  name: string;
}

// Status object for new API structure
export interface DealStatus {
  id: string;
  name: string;
}

// Total Commission object for new API structure
export interface TotalCommission {
  value: number;
  commissionValue: number;
  type: CommissionType;
}

// Agent Commission for new API structure
export interface AgentCommission {
  id: string;
  agent: Agent;
  commissionType: CommissionType;
  commissionValue: number;
  expectedAmount: number;
  paidAmount: number;
  status: DealStatus;
  currency: string;
  dueDate: string | null;
  paidDate: string | null;
}

// Additional Agent Commission for new API structure
export interface AdditionalAgentCommission {
  id: string;
  agent: Agent & { isInternal?: boolean };
  commissionType: CommissionType;
  commissionValue: number;
  isInternal: boolean;
}

// Agent Commissions object for new API structure
export interface AgentCommissions {
  mainAgent: AgentCommission;
  additionalAgents: AdditionalAgentCommission[];
  totalExpected: number;
  totalPaid: number;
}

// Source and Nationality objects for new API structure
export interface Source {
  id: string;
  name: string;
}

export interface Nationality {
  id: string;
  name: string;
}

// Buyer/Seller objects for new API structure
export interface BuyerSeller {
  id: string;
  name: string;
  phone: string;
  email?: string; // Email field added in new API
  source?: Source;
  nationality?: Nationality;
  // Old structure fields (for backward compatibility)
  sourceId?: string;
  nationalityId?: string;
}

// Deal Type object for new API structure
export interface DealType {
  id: string;
  name: string;
}

// Purchase Status object for new API structure
export interface PurchaseStatus {
  id: string;
  name: string;
}

// Property Type object for new API structure
export interface PropertyType {
  id: string;
  name: string;
}

// Property object for new API structure
export interface Property {
  name: string;
  type: PropertyType;
}

// Unit Type object for new API structure
export interface UnitType {
  id: string;
  name: string;
}

// Bedroom object for new API structure
export interface Bedroom {
  id: string;
  name: string;
}

// Unit object for new API structure
export interface Unit {
  number: string;
  type: UnitType;
  size: number;
  bedroom?: Bedroom; // Bedroom nested in unit object
}

// Media Type object for new API structure
export interface MediaType {
  id: string;
  name: string;
}

// User object for uploaded by field
export interface User {
  id: string;
  name: string;
  email: string;
}

// Media object for new API structure
export interface Media {
  id: string;
  mediaType: MediaType;
  filename: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: User;
  createdAt: string;
  updatedAt: string;
}

// Deal Media File (from GET /api/media/deal/{dealId})
export interface DealMediaFile {
  id: string;
  dealId: string;
  mediaTypeId: string;
  mediaType: {
    id: string;
    name: string;
  };
  filename: string;
  originalFilename: string;
  fileSize: number;
  mimeType: string;
  fileUrl: string;
  uploadedById: string;
  uploadedBy: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Deal type matching the actual API response
// Supports both old structure (buyerSellerDetails, commissions array) and new structure (buyer/seller objects, agentCommissions)
export interface Deal {
  id: string;
  dealNumber: string;
  stageId?: string;
  statusId?: string;
  purchaseStatusId?: string;
  dealValue: string | number; // Can be string or number in API
  totalCommissionTypeId?: string | null;
  totalCommissionValue?: string | null;
  collected_commissions?: string | null;
  closeDate: string | null;
  bookingDate?: string;
  cfExpiry?: string;
  dealTypeId?: string;
  numberOfDeal?: number | null;
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
  // Old structure (for backward compatibility)
  buyerSellerDetails?: BuyerSellerDetail[];
  commissions?: Commission[];
  // New structure (for finance API)
  buyer?: BuyerSeller;
  seller?: BuyerSeller;
  status?: DealStatus;
  purchaseStatus?: PurchaseStatus | null;
  dealType?: DealType;
  property?: Property;
  unit?: Unit;
  totalCommission?: TotalCommission;
  agentCommissions?: AgentCommissions;
  downpayment?: number; // Downpayment field added in new API
  media?: Media[]; // Media attachments array added in new API
  // Helper getters (computed from arrays)
  // buyer?: BuyerSellerDetail | null;
  // seller?: BuyerSellerDetail | null;
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

// Agent Deals Parameters (for /api/deals/agent/my-deals endpoint)
export interface GetAgentDealsParams {
  page?: number;
  page_size?: number;
}

export interface GetAgentDealsResponse {
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
  email?: string; // Optional email field
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
  closeDate?: string; // ISO date string - optional for agents
  dealTypeId: string;
  propertyName: string;
  propertyTypeId: string;
  unitNumber: string;
  unitTypeId: string;
  size: number;
  bedroomId?: string; // Changed from bedroomsId to bedroomId (singular)
  downpayment?: number; // New field in API
  buyer: BuyerSellerInput;
  seller: BuyerSellerInput;
  buyerId?: string; // Optional - for existing buyer
  sellerId?: string; // Optional - for existing seller
  agentCommissionTypeId?: string;
  agentCommissionValue?: number;
  totalCommissionTypeId?: string;
  totalCommissionValue?: number;
  additionalAgents?: AdditionalAgent[]; // Now supports multiple external agents
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

// New API response structure for /api/deals/{id}/agents
// Note: CommissionType is defined above, using optional fields where needed

export interface DealAgentResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  commissionType?: Partial<CommissionType>;
  commissionValue?: number;
  manager?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface ExternalAgentResponse {
  name: string;
  commissionType?: Partial<CommissionType>;
  commissionValue?: number;
}

export interface GetDealAgentsResponse {
  mainAgent: DealAgentResponse;
  manager: DealAgentResponse | null;
  internalAgents: DealAgentResponse[];
  externalAgents: ExternalAgentResponse[];
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

  // Get agent's deals (for agent role)
  getAgentDeals: async (
    params?: GetAgentDealsParams
  ): Promise<GetAgentDealsResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params?.page_size) {
      queryParams.append("page_size", params.page_size.toString());
    }

    const queryString = queryParams.toString();
    const endpoint = `/api/deals/agent/my-deals${
      queryString ? `?${queryString}` : ""
    }`;

    return apiClient<GetAgentDealsResponse>(endpoint);
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
    return apiClient<UpdateDealResponse>(`/api/deals/${dealId}/finance`, {
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

  // Upload media file for a deal
  uploadMedia: async (
    dealId: string,
    file: File,
    mediaTypeId: string
  ): Promise<{ message: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("mediaTypeId", mediaTypeId);

    const token =
      typeof window !== "undefined"
        ? sessionStorage.getItem("authToken")
        : null;
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_BASE_URL || "https://dev.shaheen-env.work";

    const response = await fetch(`${API_BASE_URL}/api/media/deal/${dealId}`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Upload failed" }));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  },

  // Get all media files for a deal
  getDealMedia: async (dealId: string): Promise<DealMediaFile[]> => {
    return apiClient<DealMediaFile[]>(`/api/media/deal/${dealId}`);
  },
};
