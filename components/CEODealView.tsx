"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { dealsApi, type Deal, type BuyerSeller } from "@/lib/deals";
import { filtersApi } from "@/lib/filters";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { CEODealHeader } from "./ceo/CEODealHeader";
import { CEODealInfo } from "./ceo/CEODealInfo";
import { CEOCommissionDetails } from "./ceo/CEOCommissionDetails";
import { CEOPropertyDetails } from "./ceo/CEOPropertyDetails";

interface CEODealViewProps {
  dealId: string;
  onBack: () => void;
}

export function CEODealView({ dealId, onBack }: CEODealViewProps) {
  const [deal, setDeal] = useState<Deal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [ceoApprovedStatusId, setCeoApprovedStatusId] = useState<string | null>(
    null
  );
  const [ceoRejectedStatusId, setCeoRejectedStatusId] = useState<string | null>(
    null
  );

  // Fetch statuses to get CEO Approved and CEO Rejected IDs
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const statusList = await filtersApi.getStatuses();

        // Find CEO Approved and CEO Rejected status IDs (case-insensitive)
        const approvedStatus = statusList.find(
          (s) =>
            s.name.toLowerCase() === "ceo approved" ||
            s.name.toLowerCase() === "ceo approve"
        );
        const rejectedStatus = statusList.find(
          (s) =>
            s.name.toLowerCase() === "ceo rejected" ||
            s.name.toLowerCase() === "ceo reject"
        );

        if (approvedStatus) {
          setCeoApprovedStatusId(approvedStatus.id);
        }
        if (rejectedStatus) {
          setCeoRejectedStatusId(rejectedStatus.id);
        }
      } catch (err) {
        console.error("Error fetching statuses:", err);
      }
    };

    fetchStatuses();
  }, []);

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
  }, [fetchDeal]);

  const handleApprove = async () => {
    if (!deal) return;

    if (!ceoApprovedStatusId) {
      toast.error("Status ID not found", {
        description:
          "CEO Approved status ID not available. Please refresh the page.",
      });
      return;
    }

    setIsApproving(true);
    try {
      // Call API to update deal status to CEO Approved
      await dealsApi.updateDealStatus(deal.id, ceoApprovedStatusId);

      toast.success("Deal Approved", {
        description: `Deal ${deal.dealNumber} has been approved and moved to the next stage.`,
        duration: 3000,
      });
      setTimeout(() => {
        onBack();
      }, 1500);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to approve deal";
      toast.error("Approval Failed", {
        description: errorMessage,
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!deal) return;

    if (!ceoRejectedStatusId) {
      toast.error("Status ID not found", {
        description:
          "CEO Rejected status ID not available. Please refresh the page.",
      });
      return;
    }

    setIsRejecting(true);
    try {
      // Call API to update deal status to CEO Rejected
      await dealsApi.updateDealStatus(deal.id, ceoRejectedStatusId);

      toast.success("Deal Rejected", {
        description: `Deal ${deal.dealNumber} has been rejected and returned for review.`,
        duration: 3000,
      });
      setTimeout(() => {
        onBack();
      }, 1500);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to reject deal";
      toast.error("Rejection Failed", {
        description: errorMessage,
      });
    } finally {
      setIsRejecting(false);
    }
  };

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
      <div className="space-y-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Deals
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-600 dark:text-red-400">
                {error || "Deal not found"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Extract buyer and seller - support both old and new API structure
  const buyer = (deal.buyer ||
    deal.buyerSellerDetails?.find((d) => d.isBuyer === true)) as
    | BuyerSeller
    | undefined;
  const seller = (deal.seller ||
    deal.buyerSellerDetails?.find((d) => d.isBuyer === false)) as
    | BuyerSeller
    | undefined;

  // Check if deal is already CEO Approved or CEO Rejected
  // Deal API response may have status as object or statusId as string
  type DealWithStatus = Deal & {
    status?: {
      id: string;
      name: string;
    };
  };
  const dealWithStatus = deal as DealWithStatus;
  const dealStatus = dealWithStatus.status;
  const statusName = dealStatus?.name || "";
  const statusId = dealStatus?.id || deal.statusId || "";
  const isAlreadyApproved =
    (ceoApprovedStatusId && statusId === ceoApprovedStatusId) ||
    statusName.toLowerCase() === "ceo approved" ||
    statusName.toLowerCase() === "ceo approve";
  const isAlreadyRejected =
    (ceoRejectedStatusId && statusId === ceoRejectedStatusId) ||
    statusName.toLowerCase() === "ceo rejected" ||
    statusName.toLowerCase() === "ceo reject";
  const showActions = !isAlreadyApproved && !isAlreadyRejected;

  return (
    <div className="space-y-6">
      {/* Header */}
      <CEODealHeader
        dealNumber={deal.dealNumber}
        projectName={deal.project?.name || "-"}
        buyerName={buyer?.name || "-"}
        onBack={onBack}
        onApprove={handleApprove}
        onReject={handleReject}
        isApproving={isApproving}
        isRejecting={isRejecting}
        showActions={showActions}
      />

      {/* Deal Information */}
      <CEODealInfo deal={deal} />

      {/* Commission Details - Summary only (Breakdown hidden) */}
      <CEOCommissionDetails deal={deal} commissions={deal.commissions || []} />

      {/* Property Details */}
      <CEOPropertyDetails deal={deal} />

      {/* Buyer, Seller, and Agent Information - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Buyer Information */}
        {buyer && (
          <Card>
            <CardHeader>
              <CardTitle>Buyer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Buyer Name
                  </div>
                  <div className="text-base text-gray-900 dark:text-white font-medium">
                    {buyer.name || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Buyer Phone
                  </div>
                  <div className="text-base text-gray-900 dark:text-white font-medium">
                    {buyer.phone || "-"}
                  </div>
                </div>
                {(buyer as BuyerSeller).email && (
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Buyer Email
                    </div>
                    <div className="text-base text-gray-900 dark:text-white font-medium">
                      {(buyer as BuyerSeller).email}
                    </div>
                  </div>
                )}
                {(buyer as BuyerSeller).nationality && (
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Nationality
                    </div>
                    <div className="text-base text-gray-900 dark:text-white font-medium">
                      {(buyer as BuyerSeller).nationality?.name}
                    </div>
                  </div>
                )}
                {(buyer as BuyerSeller).source && (
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Source
                    </div>
                    <div className="text-base text-gray-900 dark:text-white font-medium">
                      {(buyer as BuyerSeller).source?.name}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Seller Information */}
        {seller && (
          <Card>
            <CardHeader>
              <CardTitle>Seller Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Seller Name
                  </div>
                  <div className="text-base text-gray-900 dark:text-white font-medium">
                    {seller.name || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Seller Phone
                  </div>
                  <div className="text-base text-gray-900 dark:text-white font-medium">
                    {seller.phone || "-"}
                  </div>
                </div>
                {(seller as BuyerSeller).email && (
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Seller Email
                    </div>
                    <div className="text-base text-gray-900 dark:text-white font-medium">
                      {(seller as BuyerSeller).email}
                    </div>
                  </div>
                )}
                {(seller as BuyerSeller).nationality && (
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Nationality
                    </div>
                    <div className="text-base text-gray-900 dark:text-white font-medium">
                      {(seller as BuyerSeller).nationality?.name}
                    </div>
                  </div>
                )}
                {(seller as BuyerSeller).source && (
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Source
                    </div>
                    <div className="text-base text-gray-900 dark:text-white font-medium">
                      {(seller as BuyerSeller).source?.name}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Agent Information */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Agent Name
                </div>
                <div className="text-base text-gray-900 dark:text-white font-medium">
                  {deal.agent?.name || "-"}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Agent Email
                </div>
                <div className="text-base text-gray-900 dark:text-white font-medium">
                  {deal.agent?.email || "-"}
                </div>
              </div>
              {deal.manager && (
                <>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Manager Name
                    </div>
                    <div className="text-base text-gray-900 dark:text-white font-medium">
                      {deal.manager.name || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Manager Email
                    </div>
                    <div className="text-base text-gray-900 dark:text-white font-medium">
                      {deal.manager.email || "-"}
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Media Files Section */}
      {deal.media && deal.media.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Attached Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deal.media.map((mediaItem) => (
                <div
                  key={mediaItem.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {mediaItem.mediaType.name}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <div>File: {mediaItem.filename}</div>
                    <div>Size: {(mediaItem.fileSize / 1024).toFixed(2)} KB</div>
                    <div>Uploaded by: {mediaItem.uploadedBy.name}</div>
                    <div>
                      Date: {new Date(mediaItem.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
