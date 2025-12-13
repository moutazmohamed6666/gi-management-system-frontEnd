"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { X } from "lucide-react";

interface TransferCommissionModalProps {
  deal: any;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (recipientType: string, recipientName: string, amount: string) => void;
}

export function TransferCommissionModal({ deal, isOpen, onClose, onConfirm }: TransferCommissionModalProps) {
  const [recipientType, setRecipientType] = useState<string>("");
  const [recipientName, setRecipientName] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [amountError, setAmountError] = useState<string>("");

  if (!isOpen) return null;

  // Mock data for agents and managers
  const agents = [
    "Sarah Johnson",
    "Michael Chen",
    "Ahmed Hassan",
    "Emily Rodriguez",
    "David Kim"
  ];

  const managers = [
    "David Wilson",
    "Lisa Anderson",
    "Mohammed Ali",
    "Jennifer Lee"
  ];

  const handleAmountChange = (value: string) => {
    // Only allow numbers and one decimal point
    const regex = /^\d*\.?\d*$/;
    if (regex.test(value) || value === "") {
      setAmount(value);
      setAmountError("");
    }
  };

  const handleRecipientTypeChange = (value: string) => {
    setRecipientType(value);
    setRecipientName(""); // Reset recipient name when type changes
  };

  const handleConfirm = () => {
    // Validate inputs
    if (!recipientType) {
      return;
    }
    if (!recipientName) {
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setAmountError("Please enter a valid amount");
      return;
    }

    onConfirm(recipientType, recipientName, amount);
    
    // Reset form
    setRecipientType("");
    setRecipientName("");
    setAmount("");
    setAmountError("");
  };

  const handleCancel = () => {
    // Reset form
    setRecipientType("");
    setRecipientName("");
    setAmount("");
    setAmountError("");
    onClose();
  };

  const getRecipientOptions = () => {
    if (recipientType === "agent") return agents;
    if (recipientType === "manager") return managers;
    return [];
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl text-gray-900 dark:text-white font-semibold">Transfer Commission</h3>
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

        {/* Transfer Form */}
        <div className="p-6 space-y-4">
          <div>
            <Label htmlFor="recipientType" className="text-gray-900 dark:text-white">Transfer To</Label>
            <Select value={recipientType} onValueChange={handleRecipientTypeChange}>
              <SelectTrigger id="recipientType" className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Select recipient type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {recipientType && (
            <div>
              <Label htmlFor="recipientName" className="text-gray-900 dark:text-white">
                {recipientType === "agent" ? "Select Agent" : "Select Manager"}
              </Label>
              <Select value={recipientName} onValueChange={setRecipientName}>
                <SelectTrigger id="recipientName" className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue placeholder={`Select ${recipientType}`} />
                </SelectTrigger>
                <SelectContent>
                  {getRecipientOptions().map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="amount" className="text-gray-900 dark:text-white">Amount (AED)</Label>
            <Input
              id="amount"
              type="text"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="Enter amount to transfer"
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
            disabled={!recipientType || !recipientName || !amount}
            className="gi-bg-dark-green dark:bg-green-600 dark:hover:bg-green-700"
          >
            Confirm Transfer
          </Button>
        </div>
      </div>
    </div>
  );
}

