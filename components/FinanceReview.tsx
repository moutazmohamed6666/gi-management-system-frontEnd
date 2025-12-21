"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import type { Deal } from "@/lib/deals";
import { dealsApi } from "@/lib/deals";
import {
  commissionsApi,
  type DealCollection,
  type CommissionSummary,
} from "@/lib/commissions";
import { CollectCommissionModal } from "./CollectCommissionModal";
import { TransferCommissionModal } from "./TransferCommissionModal";
import { FinanceReviewHeader } from "./finance/FinanceReviewHeader";
import { ApprovalStatusBadge } from "./finance/ApprovalStatusBadge";
import { CommissionSummaryCards } from "./finance/CommissionSummaryCards";
import { CommissionActionsCard } from "./finance/CommissionActionsCard";
import { DealOverviewSection } from "./finance/DealOverviewSection";
import { CommissionCalculationSection } from "./finance/CommissionCalculationSection";
import { CollectionHistoryTable } from "./finance/CollectionHistoryTable";
import { PaymentTrackingSection } from "./finance/PaymentTrackingSection";
import type { DealOverview } from "./finance/DealOverviewForm";

interface FinanceReviewProps {
  dealId: string | null;
  onBack: () => void;
  onEdit: () => void;
}

export function FinanceReview({ dealId, onBack, onEdit }: FinanceReviewProps) {
  const [deal, setDeal] = useState<Deal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingOverview, setIsEditingOverview] = useState(false);
  const [isDealApproved, setIsDealApproved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Commission modals
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  // Commission data
  const [collections, setCollections] = useState<DealCollection[]>([]);
  const [commissionSummary, setCommissionSummary] =
    useState<CommissionSummary | null>(null);

  // Initialize state with deal data when deal is loaded
  const [dealOverview, setDealOverview] = useState<DealOverview>({
    propertyType: "",
    developer: "",
    project: "",
    unitType: "",
    unitNumber: "",
    location: "",
    buyerName: "",
    buyerContact: "",
    sellerName: "",
    sellerContact: "",
    agentName: "",
    sellingPrice: 0,
    dealCloseDate: "",
    leadSource: "",
    paymentPlan: "",
    notes: "",
  });

  const [financeData, setFinanceData] = useState({
    fixedCommission: 0,
    buyerRepCommission: 0,
    sellerRepCommission: 0,
    managerCommission: 0,
    agentCommission: 0,
    totalCommission: 0,
    receivedAmount: 0,
    receivedPercentage: 0,
    paidToAgent: false,
    paidPercentage: 0,
    paidDate: "",
    remainingAmount: 0,
    commissionStatus: "Pending" as "Pending" | "Partially Paid" | "Paid",
    financeNotes: "",
  });

  // Fetch deal data from API
  const fetchDeal = useCallback(async () => {
    if (!dealId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const dealData = await dealsApi.getDealById(dealId);
      setDeal(dealData);

      // Fetch collections for this deal
      try {
        const collectionsData = await commissionsApi.getDealCollections(dealId);
        setCollections(collectionsData);

        // Calculate commission summary - handle both old and new structures
        let commissionsForSummary: Array<{
          expectedAmount: string;
          paidAmount: string;
        }> = [];

        // New structure: convert agentCommissions to commissions format
        if (dealData.agentCommissions) {
          // Use mainAgent and additionalAgents to build commissions array
          const mainAgent = dealData.agentCommissions.mainAgent;
          if (mainAgent) {
            commissionsForSummary.push({
              expectedAmount: String(mainAgent.expectedAmount || 0),
              paidAmount: String(mainAgent.paidAmount || 0),
            });
          }
          // Add additional agents
          dealData.agentCommissions.additionalAgents?.forEach((agent) => {
            // Additional agents might not have expectedAmount/paidAmount, use commissionValue
            commissionsForSummary.push({
              expectedAmount: String(agent.commissionValue || 0),
              paidAmount: "0", // Additional agents typically don't have paidAmount
            });
          });
        } else if (dealData.commissions) {
          // Old structure: use commissions array directly
          commissionsForSummary = dealData.commissions;
        }

        const summary = commissionsApi.calculateSummary(
          commissionsForSummary,
          collectionsData
        );
        setCommissionSummary(summary);
      } catch (err) {
        // Collections API might not be available, use deal data
        console.error("Error fetching collections:", err);
        setCollections([]);

        // Build commissions array for summary calculation
        let commissionsForSummary: Array<{
          expectedAmount: string;
          paidAmount: string;
        }> = [];

        if (dealData.agentCommissions) {
          const mainAgent = dealData.agentCommissions.mainAgent;
          if (mainAgent) {
            commissionsForSummary.push({
              expectedAmount: String(mainAgent.expectedAmount || 0),
              paidAmount: String(mainAgent.paidAmount || 0),
            });
          }
          dealData.agentCommissions.additionalAgents?.forEach((agent) => {
            commissionsForSummary.push({
              expectedAmount: String(agent.commissionValue || 0),
              paidAmount: "0",
            });
          });
        } else if (dealData.commissions) {
          commissionsForSummary = dealData.commissions;
        }

        const summary = commissionsApi.calculateSummary(
          commissionsForSummary,
          []
        );
        setCommissionSummary(summary);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load deal";
      setError(errorMessage);
      toast.error("Error loading deal", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [dealId]);

  useEffect(() => {
    fetchDeal();
    // Reset edit mode when dealId changes
    setIsEditingOverview(false);
  }, [fetchDeal]);

  // Update state when deal is loaded
  useEffect(() => {
    if (deal) {
      // Handle both old structure (buyerSellerDetails) and new structure (buyer/seller objects)
      const buyer =
        deal.buyer || deal.buyerSellerDetails?.find((d) => d.isBuyer === true);
      const seller =
        deal.seller ||
        deal.buyerSellerDetails?.find((d) => d.isBuyer === false);

      // Calculate commission totals - handle both old and new structures
      let totalCommission = 0;
      let paidAmount = 0;

      // New structure: use agentCommissions or totalCommission
      if (deal.agentCommissions) {
        totalCommission = deal.agentCommissions.totalExpected || 0;
        paidAmount = deal.agentCommissions.totalPaid || 0;
      } else if (deal.totalCommission) {
        totalCommission =
          deal.totalCommission.value ||
          deal.totalCommission.commissionValue ||
          0;
        // For new structure, paid amount comes from agentCommissions.totalPaid
        // If not available, use commissions array as fallback
        paidAmount =
          deal.commissions?.reduce(
            (sum, c) => sum + parseFloat(c.paidAmount || "0"),
            0
          ) || 0;
      } else {
        // Old structure: use commissions array
        totalCommission =
          deal.commissions?.reduce(
            (sum, c) => sum + parseFloat(c.expectedAmount || "0"),
            0
          ) ||
          parseFloat(deal.totalCommissionValue || "0") ||
          0;
        paidAmount =
          deal.commissions?.reduce(
            (sum, c) => sum + parseFloat(c.paidAmount || "0"),
            0
          ) || 0;
      }

      const receivedPercentage =
        totalCommission > 0
          ? Math.round((paidAmount / totalCommission) * 100)
          : 0;

      // Determine commission status
      let commissionStatus: "Pending" | "Partially Paid" | "Paid" = "Pending";
      if (paidAmount >= totalCommission && totalCommission > 0) {
        commissionStatus = "Paid";
      } else if (paidAmount > 0) {
        commissionStatus = "Partially Paid";
      }

      // Handle dealValue - can be string or number
      const dealValue =
        typeof deal.dealValue === "number"
          ? deal.dealValue
          : parseFloat(deal.dealValue || "0");

      setDealOverview({
        propertyType: deal.propertyName || "",
        developer: deal.developer?.name || "",
        project: deal.project?.name || "",
        unitType: "",
        unitNumber: deal.unitNumber || "",
        location: deal.propertyName || "",
        buyerName: buyer?.name || "",
        buyerContact: buyer?.phone || "",
        sellerName: seller?.name || "",
        sellerContact: seller?.phone || "",
        agentName: deal.agent?.name || "",
        sellingPrice: dealValue,
        dealCloseDate: deal.closeDate
          ? new Date(deal.closeDate).toISOString().split("T")[0]
          : "",
        leadSource: "",
        paymentPlan: "",
        notes: "",
      });

      setFinanceData({
        fixedCommission: 0,
        buyerRepCommission: 0,
        sellerRepCommission: 0,
        managerCommission: 0,
        agentCommission: 0,
        totalCommission,
        receivedAmount: paidAmount,
        receivedPercentage,
        paidToAgent: paidAmount > 0,
        paidPercentage: receivedPercentage,
        paidDate: "",
        remainingAmount: totalCommission - paidAmount,
        commissionStatus,
        financeNotes: "",
      });
    }
  }, [deal]);

  // Early returns must come after all hooks
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-3 text-gray-600 dark:text-gray-400">
          Loading deal...
        </span>
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="flex items-center justify-center py-12">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <span className="ml-3 text-red-600 dark:text-red-400">
          {error || "Deal not found"}
        </span>
      </div>
    );
  }

  const handleOverviewChange = (field: string, value: string | number) => {
    setDealOverview((prev) => ({ ...prev, [field]: value }));
  };

  const handleFinanceChange = (
    field: string,
    value: string | number | boolean
  ) => {
    setFinanceData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveOverview = async () => {
    if (!deal) return;

    setIsSaving(true);
    try {
      await dealsApi.updateDealAsFinance(deal.id, {
        dealValue: dealOverview.sellingPrice,
        propertyName: dealOverview.propertyType,
        unitNumber: dealOverview.unitNumber,
        closeDate: dealOverview.dealCloseDate
          ? new Date(dealOverview.dealCloseDate).toISOString()
          : undefined,
        buyer: {
          name: dealOverview.buyerName,
          phone: dealOverview.buyerContact,
        },
        seller: {
          name: dealOverview.sellerName,
          phone: dealOverview.sellerContact,
        },
        financeNotes: dealOverview.notes,
      });

      toast.success("Deal Updated", {
        description: "Deal overview changes saved successfully.",
      });

      setIsEditingOverview(false);
      fetchDeal();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save changes";
      toast.error("Save Failed", {
        description: errorMessage,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveFinanceData = async () => {
    if (!deal) return;

    setIsSaving(true);
    try {
      await dealsApi.updateDealAsFinance(deal.id, {
        totalCommissionValue: financeData.totalCommission,
        financeNotes: financeData.financeNotes,
      });

      toast.success("Finance Data Saved", {
        description: "Commission and finance data updated successfully.",
      });

      fetchDeal();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save finance data";
      toast.error("Save Failed", {
        description: errorMessage,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingOverview(false);
    if (deal) {
      // Handle both old structure (buyerSellerDetails) and new structure (buyer/seller objects)
      const buyer =
        deal.buyer || deal.buyerSellerDetails?.find((d) => d.isBuyer === true);
      const seller =
        deal.seller ||
        deal.buyerSellerDetails?.find((d) => d.isBuyer === false);

      // Handle dealValue - can be string or number
      const dealValue =
        typeof deal.dealValue === "number"
          ? deal.dealValue
          : parseFloat(deal.dealValue || "0");

      setDealOverview({
        propertyType: deal.propertyName || "",
        developer: deal.developer?.name || "",
        project: deal.project?.name || "",
        unitType: "",
        unitNumber: deal.unitNumber || "",
        location: deal.propertyName || "",
        buyerName: buyer?.name || "",
        buyerContact: buyer?.phone || "",
        sellerName: seller?.name || "",
        sellerContact: seller?.phone || "",
        agentName: deal.agent?.name || "",
        sellingPrice: dealValue,
        dealCloseDate: deal.closeDate
          ? new Date(deal.closeDate).toISOString().split("T")[0]
          : "",
        leadSource: "",
        paymentPlan: "",
        notes: "",
      });
    }
  };

  const handleApproveDeal = async () => {
    if (!isDealApproved) {
      setIsDealApproved(true);
      toast.success("Deal Approved", {
        description:
          "Deal overview approved! You can now enter finance details.",
      });
    } else {
      setIsSaving(true);
      try {
        await dealsApi.updateDealAsFinance(deal.id, {
          financeNotes: financeData.financeNotes,
        });

        toast.success("Deal Fully Approved", {
          description: "Deal has been approved and moved to the next stage.",
        });

        onBack();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to approve deal";
        toast.error("Approval Failed", {
          description: errorMessage,
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleCollectionSuccess = () => {
    setIsCollectModalOpen(false);
    fetchDeal();
  };

  const handleTransferSuccess = () => {
    setIsTransferModalOpen(false);
    fetchDeal();
  };

  return (
    <div className="space-y-6">
      <FinanceReviewHeader
        dealNumber={deal.dealNumber}
        project={dealOverview.project}
        buyerName={dealOverview.buyerName}
        isDealApproved={isDealApproved}
        isEditingOverview={isEditingOverview}
        isSaving={isSaving}
        isLoading={isLoading}
        onBack={onBack}
        onEdit={() => {
          // Only allow editing if deal is loaded
          if (deal && !isLoading) {
            setIsEditingOverview(true);
            onEdit();
          }
        }}
        onCancelEdit={handleCancelEdit}
        onSaveOverview={handleSaveOverview}
        onApproveDeal={handleApproveDeal}
        onSaveFinanceData={handleSaveFinanceData}
      />

      {isDealApproved && <ApprovalStatusBadge />}

      {commissionSummary && (
        <CommissionSummaryCards summary={commissionSummary} />
      )}

      {isDealApproved && (
        <CommissionActionsCard
          commissionSummary={commissionSummary}
          onCollect={() => setIsCollectModalOpen(true)}
          onTransfer={() => setIsTransferModalOpen(true)}
          onRefresh={fetchDeal}
        />
      )}

      <DealOverviewSection
        isDealApproved={isDealApproved}
        isEditingOverview={isEditingOverview}
        dealOverview={dealOverview}
        onOverviewChange={handleOverviewChange}
      />

      {/* {isDealApproved && (
        <>
          <CommissionCalculationSection
            financeData={financeData}
            onChange={handleFinanceChange}
          />

          <CollectionHistoryTable collections={collections} />

          <PaymentTrackingSection
            financeData={financeData}
            onChange={handleFinanceChange}
          />
        </>
      )} */}

      {deal && (
        <>
          <CollectCommissionModal
            deal={deal}
            isOpen={isCollectModalOpen}
            onClose={() => setIsCollectModalOpen(false)}
            onSuccess={handleCollectionSuccess}
          />
          <TransferCommissionModal
            deal={deal}
            isOpen={isTransferModalOpen}
            onClose={() => setIsTransferModalOpen(false)}
            onSuccess={handleTransferSuccess}
          />
        </>
      )}
    </div>
  );
}
