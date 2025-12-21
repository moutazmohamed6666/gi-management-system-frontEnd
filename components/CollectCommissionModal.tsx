"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { commissionsApi, type CollectionResponse } from "@/lib/commissions";
import { filtersApi, type FilterOption } from "@/lib/filters";
import type { Deal } from "@/lib/deals";

interface CollectCommissionModalProps {
  deal: Deal;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (collection: CollectionResponse) => void;
}

export function CollectCommissionModal({
  deal,
  isOpen,
  onClose,
  onSuccess,
}: CollectCommissionModalProps) {
  const [collectionTypeId, setCollectionTypeId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [sourceId, setSourceId] = useState<string>("");
  const [collectionDate, setCollectionDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amountError, setAmountError] = useState<string>("");
  const [collectionTypes, setCollectionTypes] = useState<FilterOption[]>([]);
  const [collectionSources, setCollectionSources] = useState<FilterOption[]>(
    []
  );
  const [isLoadingCollectionTypes, setIsLoadingCollectionTypes] =
    useState(false);
  const [isLoadingCollectionSources, setIsLoadingCollectionSources] =
    useState(false);

  // Fetch collection types and sources on mount
  useEffect(() => {
    if (isOpen) {
      setIsLoadingCollectionTypes(true);
      setIsLoadingCollectionSources(true);

      Promise.all([
        filtersApi.getCollectionTypes(),
        filtersApi.getCollectionSources(),
      ])
        .then(([types, sources]) => {
          setCollectionTypes(types);
          setCollectionSources(sources);
        })
        .catch((error) => {
          console.error("Failed to fetch collection data:", error);
          toast.error("Failed to load collection data");
        })
        .finally(() => {
          setIsLoadingCollectionTypes(false);
          setIsLoadingCollectionSources(false);
        });
    }
  }, [isOpen]);

  // Set default collection date to now when modal opens
  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      // Format as ISO string for datetime-local input (YYYY-MM-DDTHH:mm)
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const defaultDate = `${year}-${month}-${day}T${hours}:${minutes}`;
      if (!collectionDate) {
        setCollectionDate(defaultDate);
      }
    } else {
      // Reset when modal closes
      setCollectionDate("");
    }
  }, [isOpen, collectionDate]);

  if (!isOpen) return null;

  const buyer =
    deal.buyerSellerDetails?.find((d) => d.isBuyer === true) || deal.buyer;

  // Calculate total commission and remaining
  // Use new agentCommissions structure if available, otherwise fallback to old structure
  const totalCommission =
    deal.agentCommissions?.totalExpected ??
    (deal.commissions && deal.commissions.length > 0
      ? deal.commissions.reduce(
          (sum, c) => sum + parseFloat(c.expectedAmount || "0"),
          0
        )
      : null) ??
    deal.totalCommission?.commissionValue ??
    deal.totalCommission?.value ??
    (deal.totalCommissionValue
      ? parseFloat(deal.totalCommissionValue)
      : null) ??
    0;

  const paidAmount =
    deal.agentCommissions?.totalPaid ??
    (deal.commissions && deal.commissions.length > 0
      ? deal.commissions.reduce(
          (sum, c) => sum + parseFloat(c.paidAmount || "0"),
          0
        )
      : null) ??
    0;

  const remainingAmount = totalCommission - paidAmount;

  const handleAmountChange = (value: string) => {
    // Only allow numbers and one decimal point
    const regex = /^\d*\.?\d*$/;
    if (regex.test(value) || value === "") {
      setAmount(value);
      setAmountError("");
    }
  };

  const handleConfirm = async () => {
    // Validate inputs
    if (!collectionTypeId) {
      toast.error("Please select a collection type");
      return;
    }
    if (!sourceId) {
      toast.error("Please select a collection source");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setAmountError("Please enter a valid amount");
      return;
    }
    if (!collectionDate) {
      toast.error("Please select a collection date");
      return;
    }

    // Convert datetime-local format to ISO string
    const dateObj = new Date(collectionDate);
    const collectionDateISO = dateObj.toISOString();

    setIsSubmitting(true);

    try {
      const response = await commissionsApi.recordCollection({
        dealId: deal.id,
        sourceId,
        amount: parseFloat(amount),
        collectionDate: collectionDateISO,
        collectionTypeId,
        notes: notes || undefined,
      });

      toast.success("Commission Collected", {
        description: `AED ${parseFloat(
          amount
        ).toLocaleString()} collected successfully.`,
      });

      onSuccess(response);
      handleReset();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to record collection";
      toast.error("Collection Failed", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCollectionTypeId("");
    setAmount("");
    setSourceId("");
    setCollectionDate("");
    setNotes("");
    setAmountError("");
  };

  const handleCancel = () => {
    handleReset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl text-gray-900 dark:text-white font-semibold">
            Collect Commission
          </h3>
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Deal Details */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Deal Information
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Deal Number
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {deal.dealNumber}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Project
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {deal.project?.name || "-"}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Buyer
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {buyer?.name || "-"}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Agent
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {deal.agent?.name || "-"}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Deal Value
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                AED{" "}
                {(typeof deal.dealValue === "string"
                  ? parseFloat(deal.dealValue)
                  : deal.dealValue || 0
                ).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Total Commission
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                AED {totalCommission.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Already Collected
              </div>
              <div className="text-sm font-medium text-green-600 dark:text-green-400">
                AED {paidAmount.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Remaining
              </div>
              <div className="text-sm font-medium text-orange-600 dark:text-orange-400">
                AED {remainingAmount.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Collection Form */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="sourceId"
                className="text-gray-900 dark:text-white"
              >
                Collection Source
              </Label>
              <Select
                value={sourceId}
                onValueChange={setSourceId}
                disabled={isLoadingCollectionSources}
              >
                <SelectTrigger
                  id="sourceId"
                  className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <SelectValue
                    placeholder={
                      isLoadingCollectionSources
                        ? "Loading..."
                        : "Select collection source"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {collectionSources.map((source) => (
                    <SelectItem key={source.id} value={source.id}>
                      {source.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label
                htmlFor="collectionTypeId"
                className="text-gray-900 dark:text-white"
              >
                Collection Type
              </Label>
              <Select
                value={collectionTypeId}
                onValueChange={setCollectionTypeId}
                disabled={isLoadingCollectionTypes}
              >
                <SelectTrigger
                  id="collectionTypeId"
                  className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <SelectValue
                    placeholder={
                      isLoadingCollectionTypes
                        ? "Loading..."
                        : "Select collection type"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {collectionTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount" className="text-gray-900 dark:text-white">
                Amount (AED)
              </Label>
              <Input
                id="amount"
                type="text"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="Enter amount"
                className={`mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  amountError ? "border-red-500 dark:border-red-500" : ""
                }`}
              />
              {amountError && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                  {amountError}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="collectionDate"
                className="text-gray-900 dark:text-white"
              >
                Collection Date & Time
              </Label>
              <Input
                id="collectionDate"
                type="datetime-local"
                value={collectionDate}
                onChange={(e) => setCollectionDate(e.target.value)}
                className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes" className="text-gray-900 dark:text-white">
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes..."
              rows={3}
              className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={
              !collectionTypeId ||
              !sourceId ||
              !amount ||
              !collectionDate ||
              isSubmitting
            }
            className="gi-bg-dark-green dark:bg-green-600 dark:hover:bg-green-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Collection"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
