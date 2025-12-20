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
  amount: number;
  paymentMethod: PaymentMethodType;
  sourceType: "buyer" | "seller" | "developer";
  sourceId?: string; // UUID of the source (buyerId/sellerId/developerId)
  receivedDate?: string; // ISO date string, defaults to now
  reference?: string; // Payment reference number
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
  paymentMethod: string;
  sourceType: string;
  sourceId: string | null;
  receivedDate: string;
  reference: string | null;
  notes: string | null;
  createdAt: string;
}

export type GetDealCollectionsResponse = DealCollection[];

// ============================================================================
// Commission Transfer (to agent/manager)
// ============================================================================

export interface TransferCommissionRequest {
  dealId: string;
  recipientId: string; // Agent or Manager UUID
  recipientType: "agent" | "manager";
  amount: number;
  notes?: string;
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

// ============================================================================
// Commission Summary (computed from collections/transfers)
// ============================================================================

export interface CommissionSummary {
  totalExpected: number;
  totalCollected: number;
  totalTransferred: number;
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
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        sourceType: data.sourceType,
        sourceId: data.sourceId,
        receivedDate: data.receivedDate || new Date().toISOString(),
        reference: data.reference,
        notes: data.notes,
      }),
    });
  },

  // Get all collections for a deal
  getDealCollections: async (
    dealId: string
  ): Promise<GetDealCollectionsResponse> => {
    return apiClient<GetDealCollectionsResponse>(
      `/api/commissions/collections/deal/${dealId}`
    );
  },

  // Transfer commission to agent/manager
  transferCommission: async (
    data: TransferCommissionRequest
  ): Promise<TransferCommissionResponse> => {
    return apiClient<TransferCommissionResponse>(
      "/api/commissions/transfer",
      {
        method: "POST",
        body: JSON.stringify({
          dealId: data.dealId,
          recipientId: data.recipientId,
          recipientType: data.recipientType,
          amount: data.amount,
          notes: data.notes,
        }),
      }
    );
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

  // Helper: Calculate commission summary for a deal
  calculateSummary: (
    commissions: Array<{ expectedAmount: string; paidAmount: string }>,
    collections: DealCollection[]
  ): CommissionSummary => {
    const totalExpected = commissions.reduce(
      (sum, c) => sum + parseFloat(c.expectedAmount || "0"),
      0
    );
    const totalCollected = collections.reduce(
      (sum, c) => sum + parseFloat(c.amount || "0"),
      0
    );
    const totalTransferred = commissions.reduce(
      (sum, c) => sum + parseFloat(c.paidAmount || "0"),
      0
    );

    const remainingToCollect = totalExpected - totalCollected;
    const remainingToTransfer = totalCollected - totalTransferred;

    let status: CommissionStatusType = "Pending";
    if (totalTransferred >= totalExpected && totalExpected > 0) {
      status = "Paid";
    } else if (totalTransferred > 0 || totalCollected > 0) {
      status = "Partially Paid";
    }

    return {
      totalExpected,
      totalCollected,
      totalTransferred,
      pendingTransfers: remainingToTransfer > 0 ? remainingToTransfer : 0,
      remainingToCollect: remainingToCollect > 0 ? remainingToCollect : 0,
      remainingToTransfer: remainingToTransfer > 0 ? remainingToTransfer : 0,
      status,
    };
  },
};

