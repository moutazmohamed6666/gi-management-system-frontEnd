"use client";

import { useState, useEffect } from "react";
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
  ArrowLeft,
  Save,
  CheckCircle,
  Edit2,
  X,
  Loader2,
  AlertCircle,
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
  useEffect(() => {
    const fetchDeal = async () => {
      if (!dealId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const dealData = await dealsApi.getDealById(dealId);
        setDeal(dealData);
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
    };

    fetchDeal();
  }, [dealId]);

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
        ) || 0;
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

  const handleSaveOverview = () => {
    setIsEditingOverview(false);
    alert("Deal overview changes saved!");
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

  const handleApproveDeal = () => {
    if (!isDealApproved) {
      setIsDealApproved(true);
      alert("Deal overview approved! You can now enter finance details.");
    } else {
      alert("Deal fully approved and moved to next stage!");
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
            <h2 className="text-gray-900">
              Finance Review - {deal.dealNumber}
            </h2>
            <p className="text-gray-600">
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
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveOverview}
                    className="flex items-center gap-2 gi-bg-dark-green"
                  >
                    <Save className="h-4 w-4" />
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
              <Button variant="outline" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Finance Data
              </Button>
              <Button
                onClick={handleApproveDeal}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4" />
                Final Approval
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Status Badge */}
      {isDealApproved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            <span className="gi-text-medium">
              Deal Overview Approved - Finance fields are now editable
            </span>
          </div>
        </div>
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
                      className="px-3 py-1 rounded-full bg-green-100 text-green-700"
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
                      <div className="text-gray-600">Property Type</div>
                      <div className="text-gray-900">
                        {dealOverview.propertyType || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Developer</div>
                      <div className="text-gray-900">
                        {dealOverview.developer || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Project</div>
                      <div className="text-gray-900">
                        {dealOverview.project || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Unit Type</div>
                      <div className="text-gray-900">
                        {dealOverview.unitType || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Unit Number</div>
                      <div className="text-gray-900">
                        {dealOverview.unitNumber || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Location</div>
                      <div className="text-gray-900">
                        {dealOverview.location || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Buyer Name</div>
                      <div className="text-gray-900">
                        {dealOverview.buyerName || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Buyer Contact</div>
                      <div className="text-gray-900">
                        {dealOverview.buyerContact || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Seller Name</div>
                      <div className="text-gray-900">
                        {dealOverview.sellerName || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Seller Contact</div>
                      <div className="text-gray-900">
                        {dealOverview.sellerContact || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Agent</div>
                      <div className="text-gray-900">
                        {dealOverview.agentName || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Selling Price</div>
                      <div className="text-gray-900">
                        AED {dealOverview.sellingPrice.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Close Date</div>
                      <div className="text-gray-900">
                        {dealOverview.dealCloseDate || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Lead Source</div>
                      <div className="text-gray-900">
                        {dealOverview.leadSource || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Payment Plan</div>
                      <div className="text-gray-900">
                        {dealOverview.paymentPlan || "-"}
                      </div>
                    </div>
                    {dealOverview.notes && (
                      <div className="md:col-span-3">
                        <div className="text-gray-600">Notes</div>
                        <div className="text-gray-900">
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
              {!isEditingOverview && (
                <span
                  className="px-3 py-1 rounded-full bg-orange-100 text-orange-700"
                  style={{ fontSize: "0.875rem" }}
                >
                  Pending Approval
                </span>
              )}
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
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
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
                    onChange={(e) =>
                      handleOverviewChange("agentName", e.target.value)
                    }
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
                  <div className="text-gray-600">Property Type</div>
                  <div className="text-gray-900">
                    {dealOverview.propertyType || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Developer</div>
                  <div className="text-gray-900">
                    {dealOverview.developer || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Project</div>
                  <div className="text-gray-900">
                    {dealOverview.project || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Unit Type</div>
                  <div className="text-gray-900">
                    {dealOverview.unitType || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Unit Number</div>
                  <div className="text-gray-900">
                    {dealOverview.unitNumber || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Location</div>
                  <div className="text-gray-900">
                    {dealOverview.location || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Buyer Name</div>
                  <div className="text-gray-900">
                    {dealOverview.buyerName || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Buyer Contact</div>
                  <div className="text-gray-900">
                    {dealOverview.buyerContact || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Seller Name</div>
                  <div className="text-gray-900">
                    {dealOverview.sellerName || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Seller Contact</div>
                  <div className="text-gray-900">
                    {dealOverview.sellerContact || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Agent</div>
                  <div className="text-gray-900">
                    {dealOverview.agentName || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Selling Price</div>
                  <div className="text-gray-900">
                    AED {dealOverview.sellingPrice.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Close Date</div>
                  <div className="text-gray-900">
                    {dealOverview.dealCloseDate || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Lead Source</div>
                  <div className="text-gray-900">
                    {dealOverview.leadSource || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Payment Plan</div>
                  <div className="text-gray-900">
                    {dealOverview.paymentPlan || "-"}
                  </div>
                </div>
                {dealOverview.notes && (
                  <div className="md:col-span-3">
                    <div className="text-gray-600">Notes</div>
                    <div className="text-gray-900">{dealOverview.notes}</div>
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
                        parseFloat(e.target.value)
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
                        parseFloat(e.target.value)
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
                        parseFloat(e.target.value)
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
                        parseFloat(e.target.value)
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
                        parseFloat(e.target.value)
                      )
                    }
                    className="bg-blue-50"
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
                        parseFloat(e.target.value)
                      )
                    }
                    className="bg-green-50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

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
                        parseFloat(e.target.value)
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
                        parseFloat(e.target.value)
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
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
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
                        parseFloat(e.target.value)
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
                        parseFloat(e.target.value)
                      )
                    }
                    className="bg-orange-50"
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
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
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
    </div>
  );
}
