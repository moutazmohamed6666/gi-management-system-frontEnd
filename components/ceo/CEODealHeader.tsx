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
  showActions?: boolean;
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
  showActions = true,
}: CEODealHeaderProps) {
  return (
    <div className="lg:static lg:bg-transparent lg:p-0 lg:shadow-none lg:border-none fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 p-4 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Back button and title */}
        <div className="flex items-center gap-2 lg:gap-4">
          <Button variant="ghost" onClick={onBack} size="sm" className="lg:size-default shrink-0">
            <ArrowLeft className="h-4 w-4 lg:mr-2" />
            <span className="hidden lg:inline">Back to Deals</span>
          </Button>
          <div className="min-w-0">
            <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white truncate">
              Deal Review - {dealNumber}
            </h2>
            <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 truncate">
              {projectName || "-"} • {buyerName || "-"}
            </p>
          </div>
        </div>
        
        {/* Action buttons */}
        {showActions && (
          <div className="flex gap-2 justify-end shrink-0">
            {isRejecting ? (
              <Button
                variant="outline"
                disabled
                size="sm"
                className="flex items-center gap-1 lg:gap-2 border-red-600 text-red-600 lg:size-default"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Rejecting...</span>
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={onReject}
                size="sm"
                className="flex items-center gap-1 lg:gap-2 border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 lg:size-default"
              >
                <XCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Reject Deal</span>
              </Button>
            )}
            {isApproving ? (
              <Button
                variant="default"
                disabled
                size="sm"
                className="flex items-center gap-1 lg:gap-2 bg-green-600 hover:bg-green-700 lg:size-default"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Approving...</span>
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={onApprove}
                size="sm"
                className="flex items-center gap-1 lg:gap-2 bg-green-600 hover:bg-green-700 text-white lg:size-default"
              >
                <CheckCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Approve Deal</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

