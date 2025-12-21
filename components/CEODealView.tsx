"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { dealsApi, type Deal } from "@/lib/deals";
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

    setIsApproving(true);
    try {
      // TODO: Implement actual approval API call
      // await dealsApi.approveDeal(dealId);

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

    setIsRejecting(true);
    try {
      // TODO: Implement actual rejection API call
      // await dealsApi.rejectDeal(dealId);

      toast.error("Deal Rejected", {
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

  // Extract buyer and seller from buyerSellerDetails
  const buyer = deal.buyerSellerDetails?.find((d) => d.isBuyer === true);
  const seller = deal.buyerSellerDetails?.find((d) => d.isBuyer === false);

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
    </div>
  );
}
