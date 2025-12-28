import type { Deal } from "@/lib/deals";

// Type for API response structure (status as object, not string)
export type DealApiResponse = Deal & {
  status?: {
    id: string;
    name: string;
  };
  totalCommission?: {
    value: number | null;
    commissionValue: number | null;
    collectedAmount?: number | null;
    status?: {
      id: string;
      name: string;
    } | null;
    type?: {
      id: string;
      name: string;
    } | null;
  };
  agentCommissions?: {
    mainAgent?: {
      id: string;
      agent?: {
        id: string;
        name: string;
        email: string;
      };
      commissionType?: {
        id: string;
        name: string;
      };
      commissionValue?: number;
      expectedAmount?: number;
      paidAmount?: number;
      status?: {
        id: string;
        name: string;
      };
      currency?: string;
      dueDate?: string | null;
      paidDate?: string | null;
    };
    additionalAgents?: Array<{
      id: string;
      agent?: {
        id?: string;
        name: string;
        email?: string;
        isInternal?: boolean;
      };
      commissionType?: {
        id: string;
        name: string;
      };
      commissionValue: number;
      isInternal: boolean;
    }>;
    totalExpected?: number;
    totalPaid?: number;
  };
  dealValue?: number | string; // Can be number or string in API
  buyer?: {
    id: string;
    name: string;
    phone?: string;
  };
  seller?: {
    id: string;
    name: string;
    phone?: string;
  };
};

