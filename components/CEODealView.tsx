"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { mockDeals } from "@/lib/mockData";
import { ArrowLeft, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CEODealViewProps {
  dealId: string;
  onBack: () => void;
}

export function CEODealView({ dealId, onBack }: CEODealViewProps) {
  const deal = mockDeals.find((d) => d.id === dealId);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  if (!deal) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Deals
        </Button>
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600">Deal not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleApprove = async () => {
    setIsApproving(true);

    // Simulate API call
    setTimeout(() => {
      setIsApproving(false);
      toast.success("Deal Approved", {
        description: `Deal ${deal.id} has been approved and moved to the next stage.`,
        duration: 3000,
      });
      // Optionally redirect back after approval
      setTimeout(() => {
        onBack();
      }, 1500);
    }, 1500);
  };

  const handleReject = async () => {
    setIsRejecting(true);

    // Simulate API call
    setTimeout(() => {
      setIsRejecting(false);
      toast.error("Deal Rejected", {
        description: `Deal ${deal.id} has been rejected and returned for review.`,
        duration: 3000,
      });
      // Optionally redirect back after rejection
      setTimeout(() => {
        onBack();
      }, 1500);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Finance Review":
        return "bg-orange-600";
      case "Approved":
        return "bg-blue-600";
      case "Submitted":
        return "bg-yellow-600";
      default:
        return "bg-gray-600";
    }
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
              Deal Review - {deal.id}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {deal.project} • {deal.buyerName}
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

      {/* Status Badge */}
      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <span
            className={`inline-block px-3 py-1 rounded-full text-white text-sm ${getStatusColor(
              deal.status
            )}`}
          >
            {deal.status}
          </span>
          <span className="text-orange-700 dark:text-orange-300">
            This deal requires your approval
          </span>
        </div>
      </div>

      {/* Deal Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Deal Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-gray-600 dark:text-gray-400 mb-1">
                Property Type
              </div>
              <div className="text-gray-900 dark:text-white font-medium">
                {deal.propertyType || "-"}
              </div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400 mb-1">
                Developer
              </div>
              <div className="text-gray-900 dark:text-white font-medium">
                {deal.developer || "-"}
              </div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400 mb-1">
                Project
              </div>
              <div className="text-gray-900 dark:text-white font-medium">
                {deal.project || "-"}
              </div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400 mb-1">
                Unit Type
              </div>
              <div className="text-gray-900 dark:text-white font-medium">
                {deal.unitType || "-"}
              </div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400 mb-1">
                Unit Number
              </div>
              <div className="text-gray-900 dark:text-white font-medium">
                {deal.unitNumber || "-"}
              </div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400 mb-1">
                Location
              </div>
              <div className="text-gray-900 dark:text-white font-medium">
                {deal.location || "-"}
              </div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400 mb-1">
                Buyer Name
              </div>
              <div className="text-gray-900 dark:text-white font-medium">
                {deal.buyerName || "-"}
              </div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400 mb-1">
                Buyer Contact
              </div>
              <div className="text-gray-900 dark:text-white font-medium">
                {deal.buyerContact || "-"}
              </div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400 mb-1">
                Seller Name
              </div>
              <div className="text-gray-900 dark:text-white font-medium">
                {deal.sellerName || "-"}
              </div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400 mb-1">
                Seller Contact
              </div>
              <div className="text-gray-900 dark:text-white font-medium">
                {deal.sellerContact || "-"}
              </div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400 mb-1">Agent</div>
              <div className="text-gray-900 dark:text-white font-medium">
                {deal.agentName || "-"}
              </div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400 mb-1">
                Selling Price
              </div>
              <div className="text-gray-900 dark:text-white font-medium">
                AED {deal.sellingPrice.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400 mb-1">
                Close Date
              </div>
              <div className="text-gray-900 dark:text-white font-medium">
                {deal.dealCloseDate || "-"}
              </div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400 mb-1">
                Lead Source
              </div>
              <div className="text-gray-900 dark:text-white font-medium">
                {deal.leadSource || "-"}
              </div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400 mb-1">
                Payment Plan
              </div>
              <div className="text-gray-900 dark:text-white font-medium">
                {deal.paymentPlan || "-"}
              </div>
            </div>
            {deal.notes && (
              <div className="md:col-span-3">
                <div className="text-gray-600 dark:text-gray-400 mb-1">
                  Notes
                </div>
                <div className="text-gray-900 dark:text-white">
                  {deal.notes}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Commission Details */}
      {(deal.totalCommission || deal.agentCommission) && (
        <Card>
          <CardHeader>
            <CardTitle>Commission Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {deal.totalCommission && (
                <div>
                  <div className="text-gray-600 dark:text-gray-400 mb-1">
                    Total Commission
                  </div>
                  <div className="text-gray-900 dark:text-white font-medium text-lg">
                    AED {deal.totalCommission.toLocaleString()}
                  </div>
                </div>
              )}
              {deal.agentCommission && (
                <div>
                  <div className="text-gray-600 dark:text-gray-400 mb-1">
                    Agent Commission
                  </div>
                  <div className="text-gray-900 dark:text-white font-medium text-lg">
                    AED {deal.agentCommission.toLocaleString()}
                  </div>
                </div>
              )}
              {deal.managerCommission && (
                <div>
                  <div className="text-gray-600 dark:text-gray-400 mb-1">
                    Manager Commission
                  </div>
                  <div className="text-gray-900 dark:text-white font-medium text-lg">
                    AED {deal.managerCommission.toLocaleString()}
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
