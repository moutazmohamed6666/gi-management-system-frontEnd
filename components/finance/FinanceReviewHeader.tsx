"use client";

import { Button } from "../ui/button";
import { ArrowLeft, Save, CheckCircle, Edit2, X, Loader2 } from "lucide-react";

interface FinanceReviewHeaderProps {
  dealNumber: string;
  project: string;
  buyerName: string;
  isDealApproved: boolean;
  isEditingOverview: boolean;
  isSaving: boolean;
  isLoading?: boolean;
  onBack: () => void;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSaveOverview: () => void;
  onApproveDeal: () => void;
  onSaveFinanceData: () => void;
}

export function FinanceReviewHeader({
  dealNumber,
  project,
  buyerName,
  isDealApproved,
  isEditingOverview,
  isSaving,
  isLoading = false,
  onBack,
  onEdit,
  onCancelEdit,
  onSaveOverview,
  onApproveDeal,
  onSaveFinanceData,
}: FinanceReviewHeaderProps) {
  return (
    <div className="lg:static lg:bg-transparent lg:p-0 lg:shadow-none lg:border-none fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 p-4 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Back button and title */}
        <div className="flex items-center gap-2 lg:gap-4">
          <Button
            variant="ghost"
            onClick={onBack}
            size="sm"
            className="lg:size-default shrink-0"
          >
            <ArrowLeft className="h-4 w-4 lg:mr-2" />
            <span className="hidden lg:inline">Back to Deals</span>
          </Button>
          <div className="min-w-0">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white truncate">
              Finance Review - {dealNumber}
            </h2>
            <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 truncate">
              {project} • {buyerName}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 justify-end flex-wrap shrink-0">
          {isEditingOverview ? (
            <>
              <Button
                variant="outline"
                onClick={onCancelEdit}
                disabled={isSaving}
                size="sm"
                className="flex items-center gap-1 lg:gap-2 lg:size-default"
              >
                <X className="h-4 w-4" />
                <span className="hidden sm:inline">Cancel</span>
              </Button>
              <Button
                onClick={onSaveOverview}
                disabled={isSaving}
                size="sm"
                className="flex items-center gap-1 lg:gap-2 gi-bg-dark-green lg:size-default"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">Save Overview</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={onEdit}
                disabled={isLoading || isSaving}
                size="sm"
                className="flex items-center gap-1 lg:gap-2 lg:size-default"
              >
                <Edit2 className="h-4 w-4" />
                <span className="hidden sm:inline">Edit Deal</span>
              </Button>

              {!isDealApproved ? (
                <Button
                  onClick={onApproveDeal}
                  size="sm"
                  className="flex items-center gap-1 lg:gap-2 bg-green-600 hover:bg-green-700 lg:size-default"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    Approve Deal Overview
                  </span>
                  <span className="sm:hidden">Approve</span>
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={onSaveFinanceData}
                    disabled={isSaving}
                    size="sm"
                    className="flex items-center gap-1 lg:gap-2 lg:size-default"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span className="hidden sm:inline">Save Finance Data</span>
                  </Button>
                  <Button
                    onClick={onApproveDeal}
                    disabled={isSaving}
                    size="sm"
                    className="flex items-center gap-1 lg:gap-2 bg-green-600 hover:bg-green-700 lg:size-default"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    <span className="hidden sm:inline">Final Approval</span>
                    <span className="sm:hidden">Approve</span>
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
