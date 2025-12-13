"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { X } from "lucide-react";

interface CollectCommissionModalProps {
  deal: any;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (paymentMethod: string, amount: string) => void;
}

export function CollectCommissionModal({ deal, isOpen, onClose, onConfirm }: CollectCommissionModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [amountError, setAmountError] = useState<string>("");

  if (!isOpen) return null;

  const handleAmountChange = (value: string) => {
    // Only allow numbers and one decimal point
    const regex = /^\d*\.?\d*$/;
    if (regex.test(value) || value === "") {
      setAmount(value);
      setAmountError("");
    }
  };

  const handleConfirm = () => {
    // Validate inputs
    if (!paymentMethod) {
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setAmountError("Please enter a valid amount");
      return;
    }

    onConfirm(paymentMethod, amount);
    
    // Reset form
    setPaymentMethod("");
    setAmount("");
    setAmountError("");
  };

  const handleCancel = () => {
    // Reset form
    setPaymentMethod("");
    setAmount("");
    setAmountError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl text-gray-900 dark:text-white font-semibold">Collect Commission</h3>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Deal Details */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Deal Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Deal ID</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">{deal.id}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Property</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">{deal.project}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Buyer</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">{deal.buyerName}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Agent</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">{deal.agentName}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Selling Price</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">AED {deal.sellingPrice.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Agent Commission</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {deal.agentCommission ? `AED ${deal.agentCommission.toLocaleString()}` : "-"}
              </div>
            </div>
          </div>
        </div>

        {/* Collection Form */}
        <div className="p-6 space-y-4">
          <div>
            <Label htmlFor="paymentMethod" className="text-gray-900 dark:text-white">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger id="paymentMethod" className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
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

          <div>
            <Label htmlFor="amount" className="text-gray-900 dark:text-white">Amount (AED)</Label>
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
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{amountError}</p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!paymentMethod || !amount}
            className="gi-bg-dark-green dark:bg-green-600 dark:hover:bg-green-700"
          >
            Confirm Collection
          </Button>
        </div>
      </div>
    </div>
  );
}

