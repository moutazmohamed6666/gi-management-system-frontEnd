"use client";

import { Button } from "../ui/button";
import {
  ArrowLeft,
  Save,
  CheckCircle,
  Edit2,
  X,
  Loader2,
} from "lucide-react";

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
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Deals
        </Button>
        <div>
          <h2 className="text-gray-900 dark:text-white text-xl font-semibold">
            Finance Review - {dealNumber}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {project} • {buyerName}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        {isEditingOverview ? (
          <>
            <Button
              variant="outline"
              onClick={onCancelEdit}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={onSaveOverview}
              disabled={isSaving}
              className="flex items-center gap-2 gi-bg-dark-green"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Overview
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={onEdit}
              disabled={isLoading || isSaving}
              className="flex items-center gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Edit Deal
            </Button>

            {!isDealApproved ? (
              <Button
                onClick={onApproveDeal}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4" />
                Approve Deal Overview
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={onSaveFinanceData}
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save Finance Data
                </Button>
                <Button
                  onClick={onApproveDeal}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  Final Approval
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

