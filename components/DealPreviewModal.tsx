"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { CheckCircle2, ArrowLeft } from "lucide-react";

interface DealPreviewData {
  // Deal Information
  bookingDate: string;
  cfExpiry: string;
  closeDate?: string;
  dealType: string;
  status: string;
  purchaseStatus: string;
  
  // Property Details
  developer: string;
  project: string;
  propertyName: string;
  propertyType: string;
  unitNumber: string;
  unitType: string;
  size: string;
  bedrooms: string;
  
  // Buyer/Seller
  buyerName: string;
  buyerPhone: string;
  buyerEmail?: string;
  sellerName: string;
  sellerPhone: string;
  sellerEmail?: string;
  
  // Financial
  salesValue: string;
  downpayment?: string;
  
  // Deal Commission
  dealCommissionRate: string;
  dealCommissionType: string;
  totalDealCommission?: string;
  
  // Main Agent Commission
  mainAgentName?: string;
  mainAgentCommissionRate?: string;
  mainAgentCommissionType?: string;
  mainAgentCommissionValue?: string;
  
  // Additional Agent
  hasAdditionalAgent: boolean;
  additionalAgentType?: "internal" | "external";
  additionalAgentName?: string;
  additionalAgentCommissionRate?: string;
  additionalAgentCommissionType?: string;
  additionalAgentCommissionValue?: string;
}

interface DealPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: DealPreviewData;
  isSubmitting?: boolean;
}

export function DealPreviewModal({
  isOpen,
  onClose,
  onConfirm,
  data,
  isSubmitting = false,
}: DealPreviewModalProps) {
  const formatCurrency = (value: string | undefined) => {
    if (!value) return "N/A";
    const num = parseFloat(value);
    return isNaN(num) ? "N/A" : `AED ${num.toLocaleString()}`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Review Deal Details</DialogTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Please review all information before submitting
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Deal Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Deal Information
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Booking Date</p>
                <p className="font-medium text-gray-900 dark:text-white">{formatDate(data.bookingDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">CF Expiry</p>
                <p className="font-medium text-gray-900 dark:text-white">{formatDate(data.cfExpiry)}</p>
              </div>
              {data.closeDate && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Close Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">{formatDate(data.closeDate)}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Deal Type</p>
                <p className="font-medium text-gray-900 dark:text-white">{data.dealType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                <p className="font-medium text-gray-900 dark:text-white">{data.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Purchase Status</p>
                <p className="font-medium text-gray-900 dark:text-white">{data.purchaseStatus || "N/A"}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Property Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Property Details
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Developer</p>
                <p className="font-medium text-gray-900 dark:text-white">{data.developer}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Project</p>
                <p className="font-medium text-gray-900 dark:text-white">{data.project}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Property Name</p>
                <p className="font-medium text-gray-900 dark:text-white">{data.propertyName || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Property Type</p>
                <p className="font-medium text-gray-900 dark:text-white">{data.propertyType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unit Number</p>
                <p className="font-medium text-gray-900 dark:text-white">{data.unitNumber || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unit Type</p>
                <p className="font-medium text-gray-900 dark:text-white">{data.unitType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Size</p>
                <p className="font-medium text-gray-900 dark:text-white">{data.size ? `${data.size} sq.ft` : "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Bedrooms</p>
                <p className="font-medium text-gray-900 dark:text-white">{data.bedrooms || "N/A"}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Buyer & Seller */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Buyer</h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg space-y-2">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">{data.buyerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                  <p className="font-medium text-gray-900 dark:text-white">{data.buyerPhone}</p>
                </div>
                {data.buyerEmail && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white">{data.buyerEmail}</p>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Seller</h3>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg space-y-2">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">{data.sellerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                  <p className="font-medium text-gray-900 dark:text-white">{data.sellerPhone}</p>
                </div>
                {data.sellerEmail && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white">{data.sellerEmail}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Financial Summary */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Financial Summary
            </h3>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Sales Value</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(data.salesValue)}
                </p>
              </div>
              {data.downpayment && (
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Downpayment</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(data.downpayment)}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Deal Commission */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Deal Commission
            </h3>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Commission Type</p>
                <p className="font-medium text-gray-900 dark:text-white">{data.dealCommissionType}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Commission Rate/Value</p>
                <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                  {data.dealCommissionRate || "N/A"}
                </p>
              </div>
              {data.totalDealCommission && (
                <div className="flex justify-between items-center pt-2 border-t border-indigo-200 dark:border-indigo-800">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total Deal Commission</p>
                  <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    {formatCurrency(data.totalDealCommission)}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Agent Commissions */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Agent Commissions
            </h3>
            
            {/* Main Agent */}
            {data.mainAgentName && (
              <div className="mb-4">
                <h4 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Main Agent
                </h4>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Agent Name</p>
                    <p className="font-medium text-gray-900 dark:text-white">{data.mainAgentName}</p>
                  </div>
                  {data.mainAgentCommissionType && (
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Commission Type</p>
                      <p className="font-medium text-gray-900 dark:text-white">{data.mainAgentCommissionType}</p>
                    </div>
                  )}
                  {data.mainAgentCommissionRate && (
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Commission Rate/Value</p>
                      <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                        {data.mainAgentCommissionRate}
                      </p>
                    </div>
                  )}
                  {data.mainAgentCommissionValue && (
                    <div className="flex justify-between items-center pt-2 border-t border-emerald-200 dark:border-emerald-800">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Expected Commission</p>
                      <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(data.mainAgentCommissionValue)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Additional Agent */}
            {data.hasAdditionalAgent && (
              <div>
                <h4 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Additional Agent
                </h4>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                      {data.additionalAgentType || "N/A"}
                    </p>
                  </div>
                  {data.additionalAgentName && (
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Agent Name</p>
                      <p className="font-medium text-gray-900 dark:text-white">{data.additionalAgentName}</p>
                    </div>
                  )}
                  {data.additionalAgentCommissionType && (
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Commission Type</p>
                      <p className="font-medium text-gray-900 dark:text-white">{data.additionalAgentCommissionType}</p>
                    </div>
                  )}
                  {data.additionalAgentCommissionRate && (
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Commission Rate/Value</p>
                      <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                        {data.additionalAgentCommissionRate}
                      </p>
                    </div>
                  )}
                  {data.additionalAgentCommissionValue && (
                    <div className="flex justify-between items-center pt-2 border-t border-purple-200 dark:border-purple-800">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Expected Commission</p>
                      <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {formatCurrency(data.additionalAgentCommissionValue)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Edit
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="gi-bg-dark-green"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Confirm & Submit
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

