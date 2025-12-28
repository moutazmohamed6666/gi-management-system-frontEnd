import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import type { Deal } from "@/lib/deals";

// Type for API response structure
type DealApiResponse = Deal & {
  status?: {
    id: string;
    name: string;
  };
  totalCommission?: {
    value: number | null;
    commissionValue: number | null;
    type?: {
      id: string;
      name: string;
    } | null;
  };
  agentCommissions?: {
    mainAgent?: {
      id: string;
      agent?: {
        id: string;
        name: string;
        email: string;
      };
      commissionType?: {
        id: string;
        name: string;
      };
      commissionValue?: number;
      expectedAmount?: number;
      paidAmount?: number;
      status?: {
        id: string;
        name: string;
      };
      currency?: string;
      dueDate?: string | null;
      paidDate?: string | null;
    };
    additionalAgents?: Array<{
      id: string;
      agent?: {
        id?: string;
        name: string;
        email?: string;
        isInternal?: boolean;
      };
      commissionType?: {
        id: string;
        name: string;
      };
      commissionValue: number;
      isInternal: boolean;
    }>;
    totalExpected?: number;
    totalPaid?: number;
  };
};

interface CEOMobileCardProps {
  deal: DealApiResponse;
  onViewDeal: (dealId: string) => void;
  onApprove: (dealId: string) => void;
  onReject: (dealId: string) => void;
  approvingDealId: string | null;
  rejectingDealId: string | null;
  ceoApprovedStatusId: string | null;
  ceoRejectedStatusId: string | null;
  openPopoverId: string | null;
  onOpenPopoverChange: (dealId: string | null) => void;
}

export function CEOMobileCard({
  deal,
  onViewDeal,
  onApprove,
  onReject,
  approvingDealId,
  rejectingDealId,
  ceoApprovedStatusId,
  ceoRejectedStatusId,
  openPopoverId,
  onOpenPopoverChange,
}: CEOMobileCardProps) {
  const dealApi = deal as DealApiResponse;

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("select") ||
      target.closest("[role='button']") ||
      target.closest(".popover-content") ||
      target.closest("[data-radix-popper-content-wrapper]")
    ) {
      return;
    }
    onViewDeal(deal.id);
  };

  const getStatusColor = (deal: DealApiResponse) => {
    const statusName = deal.status?.name || deal.statusId || "";
    const commissionStatus = deal.agentCommissions?.mainAgent?.status?.name;
    const status = statusName || commissionStatus || "Pending";

    switch (status) {
      case "Finance Review":
        return "bg-orange-600";
      case "Approved":
      case "CEO Approved":
        return "bg-blue-600";
      case "Submitted":
        return "bg-yellow-600";
      case "Pending":
      case "Expected":
        return "bg-gray-600";
      default:
        return "bg-gray-600";
    }
  };

  const statusName =
    dealApi.status?.name || deal.statusId || "";
  const statusId = dealApi.status?.id || deal.statusId || "";
  const isAlreadyApproved =
    (ceoApprovedStatusId && statusId === ceoApprovedStatusId) ||
    statusName.toLowerCase() === "ceo approved" ||
    statusName.toLowerCase() === "ceo approve";
  const isAlreadyRejected =
    (ceoRejectedStatusId && statusId === ceoRejectedStatusId) ||
    statusName.toLowerCase() === "ceo rejected" ||
    statusName.toLowerCase() === "ceo reject";

  const commissionValue =
    dealApi.totalCommission?.commissionValue ??
    dealApi.totalCommission?.value ??
    deal.commission?.total;

  const mainAgent = dealApi.agentCommissions?.mainAgent;
  const additionalAgents = dealApi.agentCommissions?.additionalAgents || [];
  const totalExpected = dealApi.agentCommissions?.totalExpected;
  const totalPaid = dealApi.agentCommissions?.totalPaid || 0;

  return (
    <Card
      onClick={handleCardClick}
      className="p-4 border transition-colors cursor-pointer hover:shadow-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
    >
      <div className="space-y-3">
        {/* Header: Deal ID and Status */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Deal ID
            </div>
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {deal.dealNumber}
            </div>
          </div>
          <div className="flex-shrink-0">
            <span
              className={`inline-block px-3 py-1 rounded-full text-white text-xs ${getStatusColor(
                dealApi
              )}`}
            >
              {dealApi.status?.name ||
                dealApi.agentCommissions?.mainAgent?.status?.name ||
                deal.statusId ||
                "Pending"}
            </span>
          </div>
        </div>

        {/* Property Info */}
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Property
          </div>
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {deal.project?.name || "N/A"}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {deal.developer?.name || "N/A"}
          </div>
        </div>

        {/* Buyer and Seller - Side by side */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Buyer
            </div>
            <div className="text-sm text-gray-900 dark:text-gray-100">
              {deal.buyer?.name ||
                deal.buyerSellerDetails?.find((d) => d.isBuyer === true)?.name ||
                "N/A"}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Seller
            </div>
            <div className="text-sm text-gray-900 dark:text-gray-100">
              {deal.seller?.name ||
                deal.buyerSellerDetails?.find((d) => d.isBuyer === false)
                  ?.name ||
                "N/A"}
            </div>
          </div>
        </div>

        {/* Agent */}
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Agent
          </div>
          <div className="text-sm text-gray-900 dark:text-gray-100">
            {deal.agent?.name || "N/A"}
          </div>
        </div>

        {/* Price */}
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Price
          </div>
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            AED {Number(deal.dealValue).toLocaleString()}
          </div>
        </div>

        {/* Commission Info */}
        <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Total Commission
            </div>
            <div className="text-sm text-gray-900 dark:text-gray-100">
              {commissionValue
                ? `AED ${Number(commissionValue).toLocaleString()}`
                : "-"}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Agent Commission
            </div>
            <div className="space-y-1">
              {mainAgent && (
                <div className="text-xs sm:text-sm">
                  <div className="text-gray-900 dark:text-gray-100 font-medium">
                    Main: AED{" "}
                    {Number(mainAgent.expectedAmount || 0).toLocaleString()}
                  </div>
                  {mainAgent.status?.name && (
                    <span
                      className={`text-white inline-block px-2 py-0.5 rounded text-xs mt-1 ${
                        mainAgent.status.name === "Paid"
                          ? "bg-green-600 dark:bg-green-500"
                          : mainAgent.status.name === "Partially Paid"
                          ? "bg-orange-600 dark:bg-orange-500"
                          : "bg-gray-600 dark:bg-gray-500"
                      }`}
                    >
                      {mainAgent.status.name}
                    </span>
                  )}
                </div>
              )}

              {additionalAgents.length > 0 && (
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  +{additionalAgents.length} additional agent
                  {additionalAgents.length > 1 ? "s" : ""}
                </div>
              )}

              {totalExpected !== undefined && (
                <div className="text-xs text-gray-700 dark:text-gray-300 font-semibold pt-1 border-t border-gray-200 dark:border-gray-700">
                  Total: AED {Number(totalExpected).toLocaleString()}
                  {totalPaid > 0 &&
                    ` (Paid: AED ${Number(totalPaid).toLocaleString()})`}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div
          className="pt-2 border-t border-gray-200 dark:border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2">
            {!isAlreadyApproved && !isAlreadyRejected && (
              <>
                {approvingDealId === deal.id ? (
                  <Button
                    variant="default"
                    size="sm"
                    disabled
                    className="flex-1 flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-xs sm:text-sm h-8"
                  >
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    Approving...
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onApprove(deal.id)}
                    className="flex-1 flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm h-8"
                  >
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    Approve
                  </Button>
                )}
                {rejectingDealId === deal.id ? (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="flex-1 flex items-center justify-center gap-1 border-red-600 text-red-600 text-xs sm:text-sm h-8"
                  >
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    Rejecting...
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onReject(deal.id)}
                    className="flex-1 flex items-center justify-center gap-1 border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs sm:text-sm h-8"
                  >
                    <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    Reject
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

