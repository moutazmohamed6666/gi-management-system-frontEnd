"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { dealsApi, type Deal } from "@/lib/deals";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

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

  // Calculate commission totals
  const totalCommission =
    deal.commissions?.reduce(
      (sum, c) => sum + parseFloat(c.expectedAmount || "0"),
      0
    ) ||
    parseFloat(deal.totalCommissionValue || "0") ||
    0;
  const paidAmount =
    deal.commissions?.reduce(
      (sum, c) => sum + parseFloat(c.paidAmount || "0"),
      0
    ) || 0;

  // Format date helper
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  // Format currency helper
  const formatCurrency = (value: string | number | undefined) => {
    if (!value) return "-";
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(numValue)) return "-";
    return `AED ${numValue.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Deals
          </Button>
          <div>
            <h2 className="text-gray-900 dark:text-white">
              Deal Review - {deal.dealNumber}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {deal.project?.name || "-"} • {buyer?.name || "-"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {isRejecting ? (
            <Button
              variant="outline"
              disabled
              className="flex items-center gap-2 border-red-600 text-red-600"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              Rejecting...
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handleReject}
              className="flex items-center gap-2 border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <XCircle className="h-4 w-4" />
              Reject Deal
            </Button>
          )}
          {isApproving ? (
            <Button
              variant="default"
              disabled
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              Approving...
            </Button>
          ) : (
            <Button
              variant="default"
              onClick={handleApprove}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="h-4 w-4" />
              Approve Deal
            </Button>
          )}
        </div>
      </div>

      {/* Deal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Deal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Deal Number
              </div>
              <div className="text-base text-gray-900 dark:text-white font-medium">
                {deal.dealNumber || "-"}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Deal Value
              </div>
              <div className="text-base text-gray-900 dark:text-white font-medium">
                {formatCurrency(deal.dealValue)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Close Date
              </div>
              <div className="text-base text-gray-900 dark:text-white font-medium">
                {formatDate(deal.closeDate)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Booking Date
              </div>
              <div className="text-base text-gray-900 dark:text-white font-medium">
                {formatDate(deal.bookingDate)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                CF Expiry
              </div>
              <div className="text-base text-gray-900 dark:text-white font-medium">
                {formatDate(deal.cfExpiry)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Created At
              </div>
              <div className="text-base text-gray-900 dark:text-white font-medium">
                {formatDate(deal.createdAt)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Details */}
      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Developer
              </div>
              <div className="text-base text-gray-900 dark:text-white font-medium">
                {deal.developer?.name || "-"}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Project
              </div>
              <div className="text-base text-gray-900 dark:text-white font-medium">
                {deal.project?.name || "-"}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Property Name
              </div>
              <div className="text-base text-gray-900 dark:text-white font-medium">
                {deal.propertyName || "-"}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Unit Number
              </div>
              <div className="text-base text-gray-900 dark:text-white font-medium">
                {deal.unitNumber || "-"}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Size
              </div>
              <div className="text-base text-gray-900 dark:text-white font-medium">
                {deal.size ? `${deal.size} sqft` : "-"}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Number of Deals
              </div>
              <div className="text-base text-gray-900 dark:text-white font-medium">
                {deal.numberOfDeal || "-"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buyer Information */}
      {buyer && (
        <Card>
          <CardHeader>
            <CardTitle>Buyer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* Commission Details */}
      {totalCommission > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Commission Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total Commission
                </div>
                <div className="text-lg text-gray-900 dark:text-white font-semibold">
                  {formatCurrency(totalCommission)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Paid Amount
                </div>
                <div className="text-lg text-gray-900 dark:text-white font-semibold">
                  {formatCurrency(paidAmount)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Remaining Amount
                </div>
                <div className="text-lg text-gray-900 dark:text-white font-semibold">
                  {formatCurrency(totalCommission - paidAmount)}
                </div>
              </div>
              {deal.commissions && deal.commissions.length > 0 && (
                <div className="md:col-span-2">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Commission Breakdown
                  </div>
                  <div className="space-y-2">
                    {deal.commissions.map((commission) => (
                      <div
                        key={commission.id}
                        className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              Expected:{" "}
                              {formatCurrency(commission.expectedAmount)}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Paid: {formatCurrency(commission.paidAmount)}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {commission.paidDate
                              ? `Paid: ${formatDate(commission.paidDate)}`
                              : commission.dueDate
                              ? `Due: ${formatDate(commission.dueDate)}`
                              : "Pending"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
