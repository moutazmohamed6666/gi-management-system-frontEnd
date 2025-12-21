"use client";

import { Button } from "../ui/button";
import { ArrowLeft, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface CEODealHeaderProps {
  dealNumber: string;
  projectName: string;
  buyerName: string;
  onBack: () => void;
  onApprove: () => void;
  onReject: () => void;
  isApproving: boolean;
  isRejecting: boolean;
}

export function CEODealHeader({
  dealNumber,
  projectName,
  buyerName,
  onBack,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: CEODealHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Deals
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Deal Review - {dealNumber}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {projectName || "-"} • {buyerName || "-"}
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
            onClick={onReject}
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
            onClick={onApprove}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <CheckCircle className="h-4 w-4" />
            Approve Deal
          </Button>
        )}
      </div>
    </div>
  );
}

