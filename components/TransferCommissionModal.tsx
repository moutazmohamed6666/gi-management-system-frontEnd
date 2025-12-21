"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
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
  type TransferCommissionResponse,
} from "@/lib/commissions";
import { dealsApi, type Deal, type GetDealAgentsResponse } from "@/lib/deals";

interface TransferCommissionModalProps {
  deal: Deal;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (transfer: TransferCommissionResponse) => void;
}

export function TransferCommissionModal({
  deal,
  isOpen,
  onClose,
  onSuccess,
}: TransferCommissionModalProps) {
  const [fromAccount] = useState<string>("from company"); // Fixed, not editable
  const [toAccount, setToAccount] = useState<string>("");
  const [toUserId, setToUserId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);
  const [dealAgents, setDealAgents] = useState<GetDealAgentsResponse | null>(null);
  const [amountError, setAmountError] = useState<string>("");

  // Fetch agents and managers when modal opens
  useEffect(() => {
    if (isOpen && deal.id) {
      fetchDealAgents();
    }
  }, [isOpen, deal.id]);

  const fetchDealAgents = async () => {
    setIsLoadingAgents(true);
    try {
      const response = await dealsApi.getDealAgents(deal.id);
      setDealAgents(response);
    } catch (error) {
      console.error("Error fetching deal agents:", error);
      toast.error("Failed to load agents", {
        description: "Could not fetch agents for this deal",
      });
      setDealAgents(null);
    } finally {
      setIsLoadingAgents(false);
    }
  };

  // Get all available users for transfer (mainAgent, manager, internalAgents)
  const getAvailableUsers = () => {
    if (!dealAgents) return [];
    
    const users: Array<{ id: string; name: string; email: string; role: string }> = [];
    
    // Add main agent
    if (dealAgents.mainAgent) {
      users.push({
        id: dealAgents.mainAgent.id,
        name: dealAgents.mainAgent.name,
        email: dealAgents.mainAgent.email,
        role: dealAgents.mainAgent.role,
      });
    }
    
    // Add manager if exists
    if (dealAgents.manager) {
      users.push({
        id: dealAgents.manager.id,
        name: dealAgents.manager.name,
        email: dealAgents.manager.email,
        role: dealAgents.manager.role,
      });
    }
    
    // Add internal agents
    if (dealAgents.internalAgents && dealAgents.internalAgents.length > 0) {
      dealAgents.internalAgents.forEach((agent) => {
        users.push({
          id: agent.id,
          name: agent.name,
          email: agent.email,
          role: agent.role,
        });
      });
    }
    
    return users;
  };

  if (!isOpen) return null;

  const buyer = deal.buyerSellerDetails?.find((d) => d.isBuyer === true);

  // Calculate available amount to transfer
  const totalCollected =
    deal.commissions?.reduce(
      (sum, c) => sum + parseFloat(c.paidAmount || "0"),
      0
    ) || 0;

  const totalCommission =
    deal.commissions?.reduce(
      (sum, c) => sum + parseFloat(c.expectedAmount || "0"),
      0
    ) || parseFloat(deal.totalCommissionValue || "0") || 0;

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
    if (!toAccount) {
      toast.error("Please enter destination account name");
      return;
    }
    if (!toUserId) {
      toast.error("Please select a user to transfer to");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setAmountError("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await commissionsApi.transferCommission({
        dealId: deal.id,
        fromAccount: "from company", // Fixed value
        toAccount,
        toUserId,
        amount: parseFloat(amount),
      });

      const recipientName = getRecipientName(toUserId);
      toast.success("Commission Transferred", {
        description: `AED ${parseFloat(amount).toLocaleString()} transferred to ${recipientName}.`,
      });

      onSuccess(response);
      handleReset();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to transfer commission";
      toast.error("Transfer Failed", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setToAccount("");
    setToUserId("");
    setAmount("");
    setAmountError("");
  };

  const handleCancel = () => {
    handleReset();
    onClose();
  };

  const getRecipientName = (id: string): string => {
    const users = getAvailableUsers();
    return users.find((u) => u.id === id)?.name || "Unknown";
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl text-gray-900 dark:text-white font-semibold">
            Transfer Commission
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
                Collected Amount
              </div>
              <div className="text-sm font-medium text-green-600 dark:text-green-400">
                AED {totalCollected.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Available to Transfer
              </div>
              <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                AED {totalCollected.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Transfer Form */}
        <div className="p-6 space-y-4">
          <div>
            <Label
              htmlFor="fromAccount"
              className="text-gray-900 dark:text-white"
            >
              Source Account <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fromAccount"
              type="text"
              value={fromAccount}
              disabled
              className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white opacity-60 cursor-not-allowed"
            />
          </div>

          <div>
            <Label
              htmlFor="toAccount"
              className="text-gray-900 dark:text-white"
            >
              Destination Account <span className="text-red-500">*</span>
            </Label>
            <Input
              id="toAccount"
              type="text"
              value={toAccount}
              onChange={(e) => setToAccount(e.target.value)}
              placeholder="Enter destination account name"
              className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <Label
              htmlFor="toUserId"
              className="text-gray-900 dark:text-white"
            >
              Select User <span className="text-red-500">*</span>
            </Label>
            <Select value={toUserId} onValueChange={setToUserId}>
              <SelectTrigger
                id="toUserId"
                className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                disabled={isLoadingAgents}
              >
                <SelectValue
                  placeholder={
                    isLoadingAgents
                      ? "Loading users..."
                      : "Select user to transfer to"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {getAvailableUsers().map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                    {user.email && (
                      <span className="text-gray-500 ml-2">
                        ({user.email}) - {user.role}
                      </span>
                    )}
                  </SelectItem>
                ))}
                {getAvailableUsers().length === 0 && !isLoadingAgents && (
                  <div className="px-2 py-1 text-gray-500 text-sm">
                    No users found
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="amount" className="text-gray-900 dark:text-white">
              Amount (AED) <span className="text-red-500">*</span>
            </Label>
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
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {amountError}
              </p>
            )}
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
              !toAccount ||
              !toUserId ||
              !amount ||
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
              "Confirm Transfer"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
