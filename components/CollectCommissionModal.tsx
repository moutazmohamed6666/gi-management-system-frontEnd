"use client";

import { useState } from "react";
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
import {
  commissionsApi,
  type PaymentMethodType,
  type CollectionResponse,
} from "@/lib/commissions";
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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType | "">("");
  const [amount, setAmount] = useState<string>("");
  const [sourceType, setSourceType] = useState<"buyer" | "seller" | "developer">(
    "developer"
  );
  const [reference, setReference] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amountError, setAmountError] = useState<string>("");

  if (!isOpen) return null;

  const buyer = deal.buyerSellerDetails?.find((d) => d.isBuyer === true);
  const seller = deal.buyerSellerDetails?.find((d) => d.isBuyer === false);

  // Calculate total commission and remaining
  const totalCommission =
    deal.commissions?.reduce(
      (sum, c) => sum + parseFloat(c.expectedAmount || "0"),
      0
    ) || parseFloat(deal.totalCommissionValue || "0") || 0;

  const paidAmount =
    deal.commissions?.reduce(
      (sum, c) => sum + parseFloat(c.paidAmount || "0"),
      0
    ) || 0;

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
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setAmountError("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get source ID based on source type
      let sourceId: string | undefined;
      if (sourceType === "buyer" && buyer) {
        sourceId = buyer.id;
      } else if (sourceType === "seller" && seller) {
        sourceId = seller.id;
      } else if (sourceType === "developer" && deal.developerId) {
        sourceId = deal.developerId;
      }

      const response = await commissionsApi.recordCollection({
        dealId: deal.id,
        amount: parseFloat(amount),
        paymentMethod: paymentMethod as PaymentMethodType,
        sourceType,
        sourceId,
        reference: reference || undefined,
        notes: notes || undefined,
      });

      toast.success("Commission Collected", {
        description: `AED ${parseFloat(amount).toLocaleString()} collected successfully.`,
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
    setPaymentMethod("");
    setAmount("");
    setSourceType("developer");
    setReference("");
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
                AED {parseFloat(deal.dealValue || "0").toLocaleString()}
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
                htmlFor="sourceType"
                className="text-gray-900 dark:text-white"
              >
                Received From
              </Label>
              <Select
                value={sourceType}
                onValueChange={(value) =>
                  setSourceType(value as "buyer" | "seller" | "developer")
                }
              >
                <SelectTrigger
                  id="sourceType"
                  className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="developer">
                    Developer ({deal.developer?.name || "N/A"})
                  </SelectItem>
                  <SelectItem value="buyer">
                    Buyer ({buyer?.name || "N/A"})
                  </SelectItem>
                  <SelectItem value="seller">
                    Seller ({seller?.name || "N/A"})
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label
                htmlFor="paymentMethod"
                className="text-gray-900 dark:text-white"
              >
                Payment Method
              </Label>
              <Select
                value={paymentMethod}
                onValueChange={(value) =>
                  setPaymentMethod(value as PaymentMethodType)
                }
              >
                <SelectTrigger
                  id="paymentMethod"
                  className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="credit-card">Credit Card</SelectItem>
                  <SelectItem value="online-payment">Online Payment</SelectItem>
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
                htmlFor="reference"
                className="text-gray-900 dark:text-white"
              >
                Reference Number (Optional)
              </Label>
              <Input
                id="reference"
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Payment reference"
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
            disabled={!paymentMethod || !amount || isSubmitting}
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
