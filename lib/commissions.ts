// Commission API Types and Utilities

import { apiClient } from "./api";

// ============================================================================
// Type Definitions
// ============================================================================

// Commission Status IDs (to be mapped from actual API)
export type CommissionStatusType = "Pending" | "Partially Paid" | "Paid";

// Payment Method Types
export type PaymentMethodType =
  | "bank-transfer"
  | "cash"
  | "check"
  | "credit-card"
  | "online-payment";

// ============================================================================
// Create Commission
// ============================================================================

export interface CreateCommissionRequest {
  dealId: string;
  typeId: string; // Commission type UUID
  roleId: string; // Role UUID (agent/manager)
  expectedAmount: number;
  currency?: string; // Defaults to AED
  dueDate?: string; // ISO date string
  isOverride?: boolean;
  overrideReason?: string;
}

export interface CreateCommissionResponse {
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
  isOverride: boolean;
  overrideReason: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Update Commission Status
// ============================================================================

export interface UpdateCommissionStatusRequest {
  statusId: string; // UUID of the new status
}

export interface UpdateCommissionStatusResponse {
  id: string;
  statusId: string;
  message?: string;
}

// ============================================================================
// Commission Collection (from buyer/seller/developer)
// ============================================================================

export interface CollectionRequest {
  dealId: string;
  sourceId: string; // UUID of the source (buyerId/sellerId/developerId)
  amount: number;
  collectionDate: string; // ISO date string
  collectionTypeId: string; // UUID of the collection type
  notes?: string;
}

export interface CollectionResponse {
  id: string;
  dealId: string;
  amount: string;
  paymentMethod: string;
  sourceType: string;
  sourceId: string | null;
  receivedDate: string;
  reference: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

// Get collections for a deal
export interface DealCollection {
  id: string;
  dealId: string;
  amount: string;
  collectionDate: string;
  collectionTypeId: string;
  sourceId: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  // Nested objects from API
  source?: {
    id: string;
    name: string;
  };
  collectionType?: {
    id: string;
    name: string;
  };
  // Computed/mapped fields for compatibility
  paymentMethod?: string; // Mapped from collectionType.name
  sourceType?: string; // Mapped from source.name
  receivedDate?: string; // Mapped from collectionDate
  reference?: string | null;
}

// API Response structure
export interface GetDealCollectionsApiResponse {
  collections: DealCollection[];
  totalCollected: string;
}

export type GetDealCollectionsResponse = DealCollection[];

// ============================================================================
// Commission Transfer (to agent/manager)
// ============================================================================

export interface TransferCommissionRequest {
  dealId: string;
  fromAccount: string; // Source account name (fixed to "from company")
  toAccount: string; // Destination account name
  toUserId: string; // User ID (agent/manager) to transfer to
  amount: number;
  transferTypeId: string; // UUID of the transfer type from collection-types
  comment?: string; // Optional comment for the transfer
}

export interface TransferCommissionResponse {
  id: string;
  dealId: string;
  recipientId: string;
  recipientType: string;
  amount: string;
  status: "pending" | "completed";
  createdAt: string;
  updatedAt: string;
}

// Complete a transfer
export interface CompleteTransferRequest {
  completedDate?: string; // ISO date string, defaults to now
  notes?: string;
}

export interface CompleteTransferResponse {
  id: string;
  status: "completed";
  completedDate: string;
  message?: string;
}

// Get transfers for a deal
export interface DealTransfer {
  id: string;
  dealId: string;
  amount: string;
  transferDate: string;
  transferTypeId: string;
  recipientId: string | null;
  recipientName?: string;
  notes: string | null;
  status: "pending" | "completed";
  createdAt: string;
  updatedAt: string;
  // Nested objects from API
  recipient?: {
    id: string;
    name: string;
    email?: string;
  };
  transferType?: {
    id: string;
    name: string;
  };
}

// API Response structure for transfers
export interface GetDealTransfersApiResponse {
  transfers: DealTransfer[];
  totalTransferred: string;
}

export type GetDealTransfersResponse = DealTransfer[];

// ============================================================================
// Commission Summary (computed from collections/transfers)
// ============================================================================

export interface CommissionSummary {
  totalExpected: number;
  totalCollected: number;
  totalTransferred?: number; // Optional - only set if transfer data is available from API
  pendingTransfers: number;
  remainingToCollect: number;
  remainingToTransfer: number;
  status: CommissionStatusType;
}

// ============================================================================
// API Functions
// ============================================================================

export const commissionsApi = {
  // Create a new commission record
  createCommission: async (
    data: CreateCommissionRequest
  ): Promise<CreateCommissionResponse> => {
    return apiClient<CreateCommissionResponse>("/api/commissions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Update commission status
  updateCommissionStatus: async (
    commissionId: string,
    statusId: string
  ): Promise<UpdateCommissionStatusResponse> => {
    return apiClient<UpdateCommissionStatusResponse>(
      `/api/commissions/${commissionId}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ statusId }),
      }
    );
  },

  // Record a commission collection from buyer/seller/developer
  recordCollection: async (
    data: CollectionRequest
  ): Promise<CollectionResponse> => {
    return apiClient<CollectionResponse>("/api/commissions/collections", {
      method: "POST",
      body: JSON.stringify({
        dealId: data.dealId,
        sourceId: data.sourceId,
        amount: data.amount,
        collectionDate: data.collectionDate,
        collectionTypeId: data.collectionTypeId,
        notes: data.notes,
      }),
    });
  },

  // Get all collections for a deal
  getDealCollections: async (
    dealId: string
  ): Promise<GetDealCollectionsResponse> => {
    const response = await apiClient<GetDealCollectionsApiResponse>(
      `/api/commissions/collections/deal/${dealId}`
    );

    // Map API response to DealCollection format with computed fields
    return response.collections.map((collection) => ({
      ...collection,
      // Map collectionType.name to paymentMethod for backward compatibility
      paymentMethod: collection.collectionType?.name || "",
      // Map source.name to sourceType for backward compatibility
      sourceType: collection.source?.name || "",
      // Map collectionDate to receivedDate for backward compatibility
      receivedDate: collection.collectionDate,
      // Reference field (not in API response, set to null)
      reference: null,
    }));
  },

  // Transfer commission to agent/manager or between accounts
  transferCommission: async (
    data: TransferCommissionRequest
  ): Promise<TransferCommissionResponse> => {
    return apiClient<TransferCommissionResponse>("/api/commissions/transfer", {
      method: "POST",
      body: JSON.stringify({
        dealId: data.dealId,
        fromAccount: data.fromAccount,
        toAccount: data.toAccount,
        toUserId: data.toUserId,
        amount: data.amount,
        transferTypeId: data.transferTypeId,
        comment: data.comment,
      }),
    });
  },

  // Complete a pending transfer
  completeTransfer: async (
    transferId: string,
    data?: CompleteTransferRequest
  ): Promise<CompleteTransferResponse> => {
    return apiClient<CompleteTransferResponse>(
      `/api/commissions/transfers/${transferId}/complete`,
      {
        method: "PATCH",
        body: JSON.stringify({
          completedDate: data?.completedDate || new Date().toISOString(),
          notes: data?.notes,
        }),
      }
    );
  },

  // Get all transfers for a deal
  getDealTransfers: async (
    dealId: string
  ): Promise<GetDealTransfersResponse> => {
    try {
      const response = await apiClient<GetDealTransfersApiResponse>(
        `/api/commissions/transfers/deal/${dealId}`
      );

      // Map API response to DealTransfer format
      return response.transfers.map((transfer) => ({
        ...transfer,
        recipientName: transfer.recipient?.name || "",
      }));
    } catch {
      // If the endpoint doesn't exist yet, return empty array
      console.warn("getDealTransfers endpoint may not be available yet");
      return [];
    }
  },

  // Helper: Calculate commission summary for a deal
  calculateSummary: (
    commissions: Array<{ expectedAmount: string; paidAmount: string }>,
    collections: DealCollection[],
    totalTransferred?: number // Optional - pass actual transfer data from API if available
  ): CommissionSummary => {
    const totalExpected = commissions.reduce(
      (sum, c) => sum + parseFloat(c.expectedAmount || "0"),
      0
    );
    const totalCollected = collections.reduce(
      (sum, c) => sum + parseFloat(c.amount || "0"),
      0
    );

    // Only use provided totalTransferred if available, otherwise don't calculate it
    // totalTransferred should come from actual transfer API data, not from commission.paidAmount
    const remainingToCollect = totalExpected - totalCollected;
    const remainingToTransfer =
      totalTransferred !== undefined ? totalCollected - totalTransferred : 0;

    // Determine status based on collected amount, not transferred amount
    let status: CommissionStatusType = "Pending";
    if (totalCollected >= totalExpected && totalExpected > 0) {
      status = "Paid";
    } else if (totalCollected > 0) {
      status = "Partially Paid";
    }

    return {
      totalExpected,
      totalCollected,
      totalTransferred, // Only set if provided from API
      pendingTransfers: remainingToTransfer > 0 ? remainingToTransfer : 0,
      remainingToCollect: remainingToCollect > 0 ? remainingToCollect : 0,
      remainingToTransfer: remainingToTransfer > 0 ? remainingToTransfer : 0,
      status,
    };
  },
};
