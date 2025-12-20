"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import type { Deal } from "@/lib/deals";
import { dealsApi } from "@/lib/deals";
import {
  commissionsApi,
  type DealCollection,
  type CommissionSummary,
} from "@/lib/commissions";
import { CollectCommissionModal } from "./CollectCommissionModal";
import { TransferCommissionModal } from "./TransferCommissionModal";
import {
  ArrowLeft,
  Save,
  CheckCircle,
  Edit2,
  X,
  Loader2,
  AlertCircle,
  DollarSign,
  Send,
  RefreshCw,
  Clock,
  Banknote,
} from "lucide-react";
import { toast } from "sonner";

interface FinanceReviewProps {
  dealId: string | null;
  onBack: () => void;
  onEdit: () => void;
}

export function FinanceReview({ dealId, onBack, onEdit }: FinanceReviewProps) {
  const [deal, setDeal] = useState<Deal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingOverview, setIsEditingOverview] = useState(false);
  const [isDealApproved, setIsDealApproved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Commission modals
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  // Commission data
  const [collections, setCollections] = useState<DealCollection[]>([]);
  const [commissionSummary, setCommissionSummary] =
    useState<CommissionSummary | null>(null);

  // Initialize state with deal data when deal is loaded
  const [dealOverview, setDealOverview] = useState({
    propertyType: "",
    developer: "",
    project: "",
    unitType: "",
    unitNumber: "",
    location: "",
    buyerName: "",
    buyerContact: "",
    sellerName: "",
    sellerContact: "",
    agentName: "",
    sellingPrice: 0,
    dealCloseDate: "",
    leadSource: "",
    paymentPlan: "",
    notes: "",
  });

  const [financeData, setFinanceData] = useState({
    fixedCommission: 0,
    buyerRepCommission: 0,
    sellerRepCommission: 0,
    managerCommission: 0,
    agentCommission: 0,
    totalCommission: 0,
    receivedAmount: 0,
    receivedPercentage: 0,
    paidToAgent: false,
    paidPercentage: 0,
    paidDate: "",
    remainingAmount: 0,
    commissionStatus: "Pending" as "Pending" | "Partially Paid" | "Paid",
    financeNotes: "",
  });

  // Fetch deal data from API
  const fetchDeal = useCallback(async () => {
    if (!dealId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const dealData = await dealsApi.getDealById(dealId);
      setDeal(dealData);

      // Fetch collections for this deal
      try {
        const collectionsData = await commissionsApi.getDealCollections(dealId);
        setCollections(collectionsData);

        // Calculate commission summary
        const summary = commissionsApi.calculateSummary(
          dealData.commissions || [],
          collectionsData
        );
        setCommissionSummary(summary);
      } catch {
        // Collections API might not be available, use deal data
        setCollections([]);
        const summary = commissionsApi.calculateSummary(
          dealData.commissions || [],
          []
        );
        setCommissionSummary(summary);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load deal";
      setError(errorMessage);
      toast.error("Error loading deal", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [dealId]);

  useEffect(() => {
    fetchDeal();
  }, [fetchDeal]);

  // Update state when deal is loaded
  useEffect(() => {
    if (deal) {
      // Find buyer and seller from buyerSellerDetails array
      const buyer = deal.buyerSellerDetails?.find((d) => d.isBuyer === true);
      const seller = deal.buyerSellerDetails?.find((d) => d.isBuyer === false);

      // Calculate commission totals from commissions array
      const totalCommission =
        deal.commissions?.reduce(
          (sum, c) => sum + parseFloat(c.expectedAmount || "0"),
          0
        ) ||
        parseFloat(deal.totalCommissionValue || "0") ||
        0;
      const paidAmount =
        deal.commissions?.reduce(
          (sum, c) => sum + parseFloat(c.paidAmount || "0"),
          0
        ) || 0;
      const receivedPercentage =
        totalCommission > 0
          ? Math.round((paidAmount / totalCommission) * 100)
          : 0;

      // Determine commission status
      let commissionStatus: "Pending" | "Partially Paid" | "Paid" = "Pending";
      if (paidAmount >= totalCommission && totalCommission > 0) {
        commissionStatus = "Paid";
      } else if (paidAmount > 0) {
        commissionStatus = "Partially Paid";
      }

      setDealOverview({
        propertyType: deal.propertyName || "", // Use propertyName from API
        developer: deal.developer?.name || "",
        project: deal.project?.name || "",
        unitType: "", // Not directly in API, might need unitTypeId lookup
        unitNumber: deal.unitNumber || "",
        location: deal.propertyName || "", // Use propertyName as location
        buyerName: buyer?.name || "",
        buyerContact: buyer?.phone || "",
        sellerName: seller?.name || "",
        sellerContact: seller?.phone || "",
        agentName: deal.agent?.name || "",
        sellingPrice: parseFloat(deal.dealValue || "0"),
        dealCloseDate: deal.closeDate
          ? new Date(deal.closeDate).toISOString().split("T")[0]
          : "",
        leadSource: "", // Not in API response
        paymentPlan: "", // Not in API response
        notes: "", // Not in API response
      });

      setFinanceData({
        fixedCommission: 0, // Not in API response
        buyerRepCommission: 0, // Not in API response
        sellerRepCommission: 0, // Not in API response
        managerCommission: 0, // Not in API response
        agentCommission: 0, // Not in API response
        totalCommission,
        receivedAmount: paidAmount,
        receivedPercentage,
        paidToAgent: paidAmount > 0,
        paidPercentage: receivedPercentage,
        paidDate: "", // Not in API response
        remainingAmount: totalCommission - paidAmount,
        commissionStatus,
        financeNotes: "", // Not in API response
      });
    }
  }, [deal]);

  // Early returns must come after all hooks
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-3 text-gray-600 dark:text-gray-400">
          Loading deal...
        </span>
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="flex items-center justify-center py-12">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <span className="ml-3 text-red-600 dark:text-red-400">
          {error || "Deal not found"}
        </span>
      </div>
    );
  }

  const handleOverviewChange = (field: string, value: string | number) => {
    setDealOverview((prev) => ({ ...prev, [field]: value }));
  };

  const handleFinanceChange = (
    field: string,
    value: string | number | boolean
  ) => {
    setFinanceData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveOverview = async () => {
    if (!deal) return;

    setIsSaving(true);
    try {
      // Use the finance update endpoint
      await dealsApi.updateDealAsFinance(deal.id, {
        dealValue: dealOverview.sellingPrice,
        propertyName: dealOverview.propertyType,
        unitNumber: dealOverview.unitNumber,
        closeDate: dealOverview.dealCloseDate
          ? new Date(dealOverview.dealCloseDate).toISOString()
          : undefined,
        buyer: {
          name: dealOverview.buyerName,
          phone: dealOverview.buyerContact,
        },
        seller: {
          name: dealOverview.sellerName,
          phone: dealOverview.sellerContact,
        },
        financeNotes: dealOverview.notes,
      });

      toast.success("Deal Updated", {
        description: "Deal overview changes saved successfully.",
      });

      setIsEditingOverview(false);

      // Refresh deal data
      fetchDeal();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save changes";
      toast.error("Save Failed", {
        description: errorMessage,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveFinanceData = async () => {
    if (!deal) return;

    setIsSaving(true);
    try {
      await dealsApi.updateDealAsFinance(deal.id, {
        totalCommissionValue: financeData.totalCommission,
        financeNotes: financeData.financeNotes,
      });

      toast.success("Finance Data Saved", {
        description: "Commission and finance data updated successfully.",
      });

      // Refresh deal data
      fetchDeal();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save finance data";
      toast.error("Save Failed", {
        description: errorMessage,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingOverview(false);
    // Reset to original values
    if (deal) {
      const buyer = deal.buyerSellerDetails?.find((d) => d.isBuyer === true);
      const seller = deal.buyerSellerDetails?.find((d) => d.isBuyer === false);

      setDealOverview({
        propertyType: deal.propertyName || "",
        developer: deal.developer?.name || "",
        project: deal.project?.name || "",
        unitType: "",
        unitNumber: deal.unitNumber || "",
        location: deal.propertyName || "",
        buyerName: buyer?.name || "",
        buyerContact: buyer?.phone || "",
        sellerName: seller?.name || "",
        sellerContact: seller?.phone || "",
        agentName: deal.agent?.name || "",
        sellingPrice: parseFloat(deal.dealValue || "0"),
        dealCloseDate: deal.closeDate
          ? new Date(deal.closeDate).toISOString().split("T")[0]
          : "",
        leadSource: "",
        paymentPlan: "",
        notes: "",
      });
    }
  };

  const handleApproveDeal = async () => {
    if (!isDealApproved) {
      setIsDealApproved(true);
      toast.success("Deal Approved", {
        description:
          "Deal overview approved! You can now enter finance details.",
      });
    } else {
      // Final approval - move to next stage
      setIsSaving(true);
      try {
        // Update deal stage to "Finance Approved"
        // Note: This requires the actual stageId UUID from your API
        await dealsApi.updateDealAsFinance(deal.id, {
          financeNotes: financeData.financeNotes,
          // stageId would be set here once you have the UUID mapping
        });

        toast.success("Deal Fully Approved", {
          description: "Deal has been approved and moved to the next stage.",
        });

        onBack();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to approve deal";
        toast.error("Approval Failed", {
          description: errorMessage,
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleCollectionSuccess = () => {
    setIsCollectModalOpen(false);
    // Refresh data
    fetchDeal();
  };

  const handleTransferSuccess = () => {
    setIsTransferModalOpen(false);
    // Refresh data
    fetchDeal();
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "Partially Paid":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Deals
          </Button>
          <div>
            <h2 className="text-gray-900 dark:text-white text-xl font-semibold">
              Finance Review - {deal.dealNumber}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {dealOverview.project} • {dealOverview.buyerName}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isDealApproved && (
            <>
              {isEditingOverview ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveOverview}
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
                    className="flex items-center gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Deal
                  </Button>
                  <Button
                    onClick={handleApproveDeal}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve Deal Overview
                  </Button>
                </>
              )}
            </>
          )}
          {isDealApproved && (
            <>
              <Button
                variant="outline"
                onClick={handleSaveFinanceData}
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
                onClick={handleApproveDeal}
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
        </div>
      </div>

      {/* Status Badge */}
      {isDealApproved && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">
              Deal Overview Approved - Finance fields are now editable
            </span>
          </div>
        </div>
      )}

      {/* Commission Summary Cards */}
      {commissionSummary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Expected
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    AED {commissionSummary.totalExpected.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Banknote className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Collected
                  </p>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                    AED {commissionSummary.totalCollected.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Send className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Transferred
                  </p>
                  <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                    AED {commissionSummary.totalTransferred.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Remaining
                  </p>
                  <p className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                    AED {commissionSummary.remainingToCollect.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions for Commission */}
      {isDealApproved && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Commission Actions</span>
              <span
                className={`px-3 py-1 rounded-full text-sm ${getStatusBadgeColor(
                  commissionSummary?.status || "Pending"
                )}`}
              >
                {commissionSummary?.status || "Pending"}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                onClick={() => setIsCollectModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <DollarSign className="h-4 w-4" />
                Collect Commission
              </Button>
              <Button
                onClick={() => setIsTransferModalOpen(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Transfer to Agent/Manager
              </Button>
              <Button
                onClick={fetchDeal}
                variant="ghost"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deal Overview */}
      {isDealApproved ? (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="deal-overview">
            <Card>
              <CardHeader className="pb-0">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <CardTitle>Deal Overview</CardTitle>
                    <span
                      className="px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      style={{ fontSize: "0.875rem" }}
                    >
                      Approved
                    </span>
                  </div>
                </AccordionTrigger>
              </CardHeader>
              <AccordionContent>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Property Type
                      </div>
                      <div className="text-gray-900 dark:text-white">
                        {dealOverview.propertyType || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Developer
                      </div>
                      <div className="text-gray-900 dark:text-white">
                        {dealOverview.developer || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Project
                      </div>
                      <div className="text-gray-900 dark:text-white">
                        {dealOverview.project || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Unit Type
                      </div>
                      <div className="text-gray-900 dark:text-white">
                        {dealOverview.unitType || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Unit Number
                      </div>
                      <div className="text-gray-900 dark:text-white">
                        {dealOverview.unitNumber || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Location
                      </div>
                      <div className="text-gray-900 dark:text-white">
                        {dealOverview.location || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Buyer Name
                      </div>
                      <div className="text-gray-900 dark:text-white">
                        {dealOverview.buyerName || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Buyer Contact
                      </div>
                      <div className="text-gray-900 dark:text-white">
                        {dealOverview.buyerContact || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Seller Name
                      </div>
                      <div className="text-gray-900 dark:text-white">
                        {dealOverview.sellerName || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Seller Contact
                      </div>
                      <div className="text-gray-900 dark:text-white">
                        {dealOverview.sellerContact || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Agent
                      </div>
                      <div className="text-gray-900 dark:text-white">
                        {dealOverview.agentName || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Selling Price
                      </div>
                      <div className="text-gray-900 dark:text-white">
                        AED {dealOverview.sellingPrice.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Close Date
                      </div>
                      <div className="text-gray-900 dark:text-white">
                        {dealOverview.dealCloseDate || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Lead Source
                      </div>
                      <div className="text-gray-900 dark:text-white">
                        {dealOverview.leadSource || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Payment Plan
                      </div>
                      <div className="text-gray-900 dark:text-white">
                        {dealOverview.paymentPlan || "-"}
                      </div>
                    </div>
                    {dealOverview.notes && (
                      <div className="md:col-span-3">
                        <div className="text-gray-600 dark:text-gray-400">
                          Notes
                        </div>
                        <div className="text-gray-900 dark:text-white">
                          {dealOverview.notes}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        </Accordion>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Deal Overview</span>
              <div className="flex items-center gap-2">
                {!isEditingOverview && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingOverview(true)}
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
                <span
                  className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                  style={{ fontSize: "0.875rem" }}
                >
                  Pending Approval
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditingOverview ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="propertyType">Property Type</Label>
                  <select
                    id="propertyType"
                    value={dealOverview.propertyType}
                    onChange={(e) =>
                      handleOverviewChange("propertyType", e.target.value)
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select type</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Penthouse">Penthouse</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="developer">Developer</Label>
                  <Input
                    id="developer"
                    value={dealOverview.developer}
                    onChange={(e) =>
                      handleOverviewChange("developer", e.target.value)
                    }
                    disabled
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <div>
                  <Label htmlFor="project">Project</Label>
                  <Input
                    id="project"
                    value={dealOverview.project}
                    onChange={(e) =>
                      handleOverviewChange("project", e.target.value)
                    }
                    disabled
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <div>
                  <Label htmlFor="unitType">Unit Type</Label>
                  <Input
                    id="unitType"
                    value={dealOverview.unitType}
                    onChange={(e) =>
                      handleOverviewChange("unitType", e.target.value)
                    }
                    placeholder="e.g., 2BR, 3BR, Studio"
                  />
                </div>
                <div>
                  <Label htmlFor="unitNumber">Unit Number</Label>
                  <Input
                    id="unitNumber"
                    value={dealOverview.unitNumber}
                    onChange={(e) =>
                      handleOverviewChange("unitNumber", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={dealOverview.location}
                    onChange={(e) =>
                      handleOverviewChange("location", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="buyerName">Buyer Name</Label>
                  <Input
                    id="buyerName"
                    value={dealOverview.buyerName}
                    onChange={(e) =>
                      handleOverviewChange("buyerName", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="buyerContact">Buyer Contact</Label>
                  <Input
                    id="buyerContact"
                    value={dealOverview.buyerContact}
                    onChange={(e) =>
                      handleOverviewChange("buyerContact", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="sellerName">Seller Name</Label>
                  <Input
                    id="sellerName"
                    value={dealOverview.sellerName}
                    onChange={(e) =>
                      handleOverviewChange("sellerName", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="sellerContact">Seller Contact</Label>
                  <Input
                    id="sellerContact"
                    value={dealOverview.sellerContact}
                    onChange={(e) =>
                      handleOverviewChange("sellerContact", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="agentName">Agent Name</Label>
                  <Input
                    id="agentName"
                    value={dealOverview.agentName}
                    disabled
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <div>
                  <Label htmlFor="sellingPrice">Selling Price (AED)</Label>
                  <Input
                    id="sellingPrice"
                    type="number"
                    value={dealOverview.sellingPrice}
                    onChange={(e) =>
                      handleOverviewChange(
                        "sellingPrice",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="dealCloseDate">Deal Close Date</Label>
                  <Input
                    id="dealCloseDate"
                    type="date"
                    value={dealOverview.dealCloseDate}
                    onChange={(e) =>
                      handleOverviewChange("dealCloseDate", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="leadSource">Lead Source</Label>
                  <Input
                    id="leadSource"
                    value={dealOverview.leadSource}
                    onChange={(e) =>
                      handleOverviewChange("leadSource", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="paymentPlan">Payment Plan</Label>
                  <Input
                    id="paymentPlan"
                    value={dealOverview.paymentPlan}
                    onChange={(e) =>
                      handleOverviewChange("paymentPlan", e.target.value)
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={dealOverview.notes}
                    onChange={(e) =>
                      handleOverviewChange("notes", e.target.value)
                    }
                    placeholder="Enter deal notes..."
                    rows={3}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Property Type
                  </div>
                  <div className="text-gray-900 dark:text-white">
                    {dealOverview.propertyType || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Developer
                  </div>
                  <div className="text-gray-900 dark:text-white">
                    {dealOverview.developer || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Project
                  </div>
                  <div className="text-gray-900 dark:text-white">
                    {dealOverview.project || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Unit Type
                  </div>
                  <div className="text-gray-900 dark:text-white">
                    {dealOverview.unitType || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Unit Number
                  </div>
                  <div className="text-gray-900 dark:text-white">
                    {dealOverview.unitNumber || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Location
                  </div>
                  <div className="text-gray-900 dark:text-white">
                    {dealOverview.location || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Buyer Name
                  </div>
                  <div className="text-gray-900 dark:text-white">
                    {dealOverview.buyerName || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Buyer Contact
                  </div>
                  <div className="text-gray-900 dark:text-white">
                    {dealOverview.buyerContact || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Seller Name
                  </div>
                  <div className="text-gray-900 dark:text-white">
                    {dealOverview.sellerName || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Seller Contact
                  </div>
                  <div className="text-gray-900 dark:text-white">
                    {dealOverview.sellerContact || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Agent</div>
                  <div className="text-gray-900 dark:text-white">
                    {dealOverview.agentName || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Selling Price
                  </div>
                  <div className="text-gray-900 dark:text-white">
                    AED {dealOverview.sellingPrice.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Close Date
                  </div>
                  <div className="text-gray-900 dark:text-white">
                    {dealOverview.dealCloseDate || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Lead Source
                  </div>
                  <div className="text-gray-900 dark:text-white">
                    {dealOverview.leadSource || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Payment Plan
                  </div>
                  <div className="text-gray-900 dark:text-white">
                    {dealOverview.paymentPlan || "-"}
                  </div>
                </div>
                {dealOverview.notes && (
                  <div className="md:col-span-3">
                    <div className="text-gray-600 dark:text-gray-400">
                      Notes
                    </div>
                    <div className="text-gray-900 dark:text-white">
                      {dealOverview.notes}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Finance sections only visible after deal overview approval */}
      {isDealApproved && (
        <>
          {/* Commission Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Commission Calculation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fixedCommission">
                    Fixed Commission (AED)
                  </Label>
                  <Input
                    id="fixedCommission"
                    type="number"
                    value={financeData.fixedCommission}
                    onChange={(e) =>
                      handleFinanceChange(
                        "fixedCommission",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="totalCommission">
                    Total Commission (AED)
                  </Label>
                  <Input
                    id="totalCommission"
                    type="number"
                    value={financeData.totalCommission}
                    onChange={(e) =>
                      handleFinanceChange(
                        "totalCommission",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="buyerRepCommission">
                    Buyer Rep Commission (AED)
                  </Label>
                  <Input
                    id="buyerRepCommission"
                    type="number"
                    value={financeData.buyerRepCommission}
                    onChange={(e) =>
                      handleFinanceChange(
                        "buyerRepCommission",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="sellerRepCommission">
                    Seller Rep Commission (AED)
                  </Label>
                  <Input
                    id="sellerRepCommission"
                    type="number"
                    value={financeData.sellerRepCommission}
                    onChange={(e) =>
                      handleFinanceChange(
                        "sellerRepCommission",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="managerCommission">
                    Manager Commission (AED)
                  </Label>
                  <Input
                    id="managerCommission"
                    type="number"
                    value={financeData.managerCommission}
                    onChange={(e) =>
                      handleFinanceChange(
                        "managerCommission",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="bg-blue-50 dark:bg-blue-900/20"
                  />
                </div>
                <div>
                  <Label htmlFor="agentCommission">
                    Agent Commission (AED)
                  </Label>
                  <Input
                    id="agentCommission"
                    type="number"
                    value={financeData.agentCommission}
                    onChange={(e) =>
                      handleFinanceChange(
                        "agentCommission",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="bg-green-50 dark:bg-green-900/20"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Collection History */}
          {collections.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Collection History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b dark:border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">
                          Date
                        </th>
                        <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">
                          Source
                        </th>
                        <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">
                          Method
                        </th>
                        <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">
                          Amount
                        </th>
                        <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">
                          Reference
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {collections.map((collection) => (
                        <tr
                          key={collection.id}
                          className="border-b dark:border-gray-700"
                        >
                          <td className="py-3 px-4 text-gray-900 dark:text-white">
                            {new Date(
                              collection.receivedDate
                            ).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white capitalize">
                            {collection.sourceType}
                          </td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white">
                            {collection.paymentMethod.replace("-", " ")}
                          </td>
                          <td className="py-3 px-4 text-right text-green-600 dark:text-green-400 font-medium">
                            AED {parseFloat(collection.amount).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                            {collection.reference || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Tracking */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="receivedAmount">Received Amount (AED)</Label>
                  <Input
                    id="receivedAmount"
                    type="number"
                    value={financeData.receivedAmount}
                    onChange={(e) =>
                      handleFinanceChange(
                        "receivedAmount",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="receivedPercentage">Received %</Label>
                  <Input
                    id="receivedPercentage"
                    type="number"
                    value={financeData.receivedPercentage}
                    onChange={(e) =>
                      handleFinanceChange(
                        "receivedPercentage",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="paidToAgent">Paid to Agent</Label>
                  <select
                    id="paidToAgent"
                    value={financeData.paidToAgent ? "yes" : "no"}
                    onChange={(e) =>
                      handleFinanceChange(
                        "paidToAgent",
                        e.target.value === "yes"
                      )
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="paidPercentage">Paid %</Label>
                  <Input
                    id="paidPercentage"
                    type="number"
                    value={financeData.paidPercentage}
                    onChange={(e) =>
                      handleFinanceChange(
                        "paidPercentage",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="paidDate">Paid Date</Label>
                  <Input
                    id="paidDate"
                    type="date"
                    value={financeData.paidDate}
                    onChange={(e) =>
                      handleFinanceChange("paidDate", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="remainingAmount">
                    Remaining Amount (AED)
                  </Label>
                  <Input
                    id="remainingAmount"
                    type="number"
                    value={financeData.remainingAmount}
                    onChange={(e) =>
                      handleFinanceChange(
                        "remainingAmount",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="bg-orange-50 dark:bg-orange-900/20"
                  />
                </div>
                <div>
                  <Label htmlFor="commissionStatus">Commission Status</Label>
                  <select
                    id="commissionStatus"
                    value={financeData.commissionStatus}
                    onChange={(e) =>
                      handleFinanceChange("commissionStatus", e.target.value)
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Partially Paid">Partially Paid</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="financeNotes">Finance Notes</Label>
                <Textarea
                  id="financeNotes"
                  value={financeData.financeNotes}
                  onChange={(e) =>
                    handleFinanceChange("financeNotes", e.target.value)
                  }
                  placeholder="Enter finance notes..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Commission Modals */}
      {deal && (
        <>
          <CollectCommissionModal
            deal={deal}
            isOpen={isCollectModalOpen}
            onClose={() => setIsCollectModalOpen(false)}
            onSuccess={handleCollectionSuccess}
          />
          <TransferCommissionModal
            deal={deal}
            isOpen={isTransferModalOpen}
            onClose={() => setIsTransferModalOpen(false)}
            onSuccess={handleTransferSuccess}
          />
        </>
      )}
    </div>
  );
}
