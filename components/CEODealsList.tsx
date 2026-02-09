"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import type { Deal } from "@/lib/deals";
import { dealsApi } from "@/lib/deals";
import { filtersApi } from "@/lib/filters";
import { getErrorMessage } from "@/lib/api";
import { Button } from "./ui/button";
import { Eye, CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { CEOMobileCard } from "./ceo/CEOMobileCard";

// Type for API response structure (status as object, not string)
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

interface CEODealsListProps {
  onViewDeal: (dealId: string) => void;
}

export function CEODealsList({ onViewDeal }: CEODealsListProps) {
  const [approvingDealId, setApprovingDealId] = useState<string | null>(null);
  const [rejectingDealId, setRejectingDealId] = useState<string | null>(null);
  const [allDeals, setAllDeals] = useState<DealApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ceoApprovedStatusId, setCeoApprovedStatusId] = useState<string | null>(
    null
  );
  const [ceoRejectedStatusId, setCeoRejectedStatusId] = useState<string | null>(
    null
  );
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  // Fetch statuses to get CEO Approved and CEO Rejected IDs
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const statusList = await filtersApi.getStatuses();

        // Find CEO Approved and CEO Rejected status IDs (case-insensitive)
        const approvedStatus = statusList.find(
          (s) =>
            s.name.toLowerCase() === "ceo approved" ||
            s.name.toLowerCase() === "ceo approve"
        );
        const rejectedStatus = statusList.find(
          (s) =>
            s.name.toLowerCase() === "ceo rejected" ||
            s.name.toLowerCase() === "ceo reject"
        );

        if (approvedStatus) {
          setCeoApprovedStatusId(approvedStatus.id);
        }
        if (rejectedStatus) {
          setCeoRejectedStatusId(rejectedStatus.id);
        }
      } catch (err) {
        console.error("Error fetching statuses:", err);
      }
    };

    fetchStatuses();
  }, []);

  // Fetch all deals function
  const fetchDeals = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch all deals
      const response = await dealsApi.getDeals();
      const deals = Array.isArray(response.data) ? response.data : [];

      // Cast all deals to DealApiResponse type
      const typedDeals = deals.map((deal) => deal as DealApiResponse);

      setAllDeals(typedDeals);
    } catch (err) {
      const errorMessage = getErrorMessage(err, "Failed to load deals");
      setError(errorMessage);
      toast.error("Error loading deals", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all deals on mount
  useEffect(() => {
    fetchDeals();
  }, []);

  const getStatusColor = (deal: DealApiResponse) => {
    // Get status name from status object or fallback to statusId
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

  const handleApprove = async (dealId: string) => {
    if (!ceoApprovedStatusId) {
      toast.error("Status ID not found", {
        description:
          "CEO Approved status ID not available. Please refresh the page.",
      });
      return;
    }

    setApprovingDealId(dealId);

    try {
      // Call API to update deal status to CEO Approved
      await dealsApi.updateDealStatus(dealId, ceoApprovedStatusId);

      // Refetch all deals to get updated data
      await fetchDeals();

      setApprovingDealId(null);
      toast.success("Deal Approved", {
        description: `Deal has been approved and moved to the next stage.`,
        duration: 3000,
      });
    } catch (err) {
      setApprovingDealId(null);
      const errorMessage = getErrorMessage(err, "Could not approve deal. Please try again.");
      toast.error("Failed to approve deal", {
        description: errorMessage,
      });
    }
  };

  const handleReject = async (dealId: string) => {
    if (!ceoRejectedStatusId) {
      toast.error("Status ID not found", {
        description:
          "CEO Rejected status ID not available. Please refresh the page.",
      });
      return;
    }

    setRejectingDealId(dealId);

    try {
      // Call API to update deal status to CEO Rejected
      await dealsApi.updateDealStatus(dealId, ceoRejectedStatusId);

      // Refetch all deals to get updated data
      await fetchDeals();

      setRejectingDealId(null);
      toast.success("Deal Rejected", {
        description: `Deal has been rejected and returned for review.`,
        duration: 3000,
      });
    } catch (err) {
      setRejectingDealId(null);
      const errorMessage = getErrorMessage(err, "Could not reject deal. Please try again.");
      toast.error("Failed to reject deal", {
        description: errorMessage,
      });
    }
  };

  // Calculate deals requiring action for the header badge
  const dealsRequiringAction = allDeals.filter((deal) => {
    const dealApi = deal as DealApiResponse;
    const statusName = dealApi.status?.name || deal.statusId || "";
    const statusId = dealApi.status?.id || deal.statusId || "";

    // Exclude deals that are already CEO Approved or CEO Rejected
    const isAlreadyApproved =
      (ceoApprovedStatusId && statusId === ceoApprovedStatusId) ||
      statusName.toLowerCase() === "ceo approved" ||
      statusName.toLowerCase() === "ceo approve";
    const isAlreadyRejected =
      (ceoRejectedStatusId && statusId === ceoRejectedStatusId) ||
      statusName.toLowerCase() === "ceo rejected" ||
      statusName.toLowerCase() === "ceo reject";

    if (isAlreadyApproved || isAlreadyRejected) {
      return false;
    }

    // Include deals that require CEO action
    return (
      statusName === "Finance Review" ||
      statusName === "Submitted" ||
      statusName === "Approved" ||
      dealApi.agentCommissions?.mainAgent?.status?.name === "Expected" ||
      dealApi.agentCommissions?.mainAgent?.status?.name === "Pending"
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 dark:text-white">All Deals</h2>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage all deals
          </p>
        </div>
        {dealsRequiringAction.length > 0 && (
          <div className="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg border border-orange-200 dark:border-orange-800">
            <p className="text-orange-700 dark:text-orange-300 font-medium">
              {dealsRequiringAction.length} deals pending approval
            </p>
          </div>
        )}
      </div>

      {/* Deals Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-base sm:text-lg">
            {allDeals.length} {allDeals.length === 1 ? "Deal" : "Deals"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-gray-400" />
              <span className="ml-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Loading deals...
              </span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
              <span className="ml-3 text-sm sm:text-base text-red-600 dark:text-red-400">
                {error}
              </span>
            </div>
          ) : allDeals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                No deals found.
              </p>
            </div>
          ) : (
            <>
              {/* Mobile Card View - visible on small screens, hidden on lg+ */}
              <div className="lg:hidden space-y-3">
                {allDeals.map((deal) => (
                  <CEOMobileCard
                    key={deal.id}
                    deal={deal}
                    onViewDeal={onViewDeal}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    approvingDealId={approvingDealId}
                    rejectingDealId={rejectingDealId}
                    ceoApprovedStatusId={ceoApprovedStatusId}
                    ceoRejectedStatusId={ceoRejectedStatusId}
                    openPopoverId={openPopoverId}
                    onOpenPopoverChange={setOpenPopoverId}
                  />
                ))}
              </div>

              {/* Desktop Table View - hidden on small screens, visible on lg+ */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100 rounded-tl-lg">
                        Deal ID
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Property
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Buyer
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Seller
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Agent
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Price
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Commission
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Agent Commission
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Compliance
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100 rounded-tr-lg">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allDeals.map((deal) => (
                      <tr
                        key={deal.id}
                        className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                            {deal.dealNumber}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {deal.project?.name || "N/A"}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {deal.developer?.name || "N/A"}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {deal.buyer?.name ||
                              deal.buyerSellerDetails?.find(
                                (d) => d.isBuyer === true
                              )?.name ||
                              "N/A"}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {deal.seller?.name ||
                              deal.buyerSellerDetails?.find(
                                (d) => d.isBuyer === false
                              )?.name ||
                              "N/A"}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {deal.agent?.name || "N/A"}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            AED {Number(deal.dealValue).toLocaleString()}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {(() => {
                              const dealApi = deal as DealApiResponse;
                              const commissionValue =
                                dealApi.totalCommission?.commissionValue ??
                                dealApi.totalCommission?.value ??
                                deal.commission?.total;
                              return commissionValue
                                ? `AED ${Number(
                                    commissionValue
                                  ).toLocaleString()}`
                                : "-";
                            })()}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {(() => {
                            const dealApi = deal as DealApiResponse;
                            const mainAgent = dealApi.agentCommissions?.mainAgent;
                            const additionalAgents =
                              dealApi.agentCommissions?.additionalAgents || [];
                            const totalExpected =
                              dealApi.agentCommissions?.totalExpected;
                            const totalPaid =
                              dealApi.agentCommissions?.totalPaid || 0;

                            return (
                              <div className="space-y-1">
                                {/* Main Agent Commission */}
                                {mainAgent && (
                                  <div className="text-xs sm:text-sm">
                                    <div className="text-gray-900 dark:text-gray-100 font-medium">
                                      Main: AED{" "}
                                      {Number(
                                        mainAgent.expectedAmount || 0
                                      ).toLocaleString()}
                                    </div>
                                    {mainAgent.status?.name && (
                                      <span
                                        className={`text-white inline-block px-2 py-0.5 rounded text-xs ${
                                          mainAgent.status.name === "Paid"
                                            ? "bg-green-600 dark:bg-green-500"
                                            : mainAgent.status.name ===
                                              "Partially Paid"
                                            ? "bg-orange-600 dark:bg-orange-500"
                                            : "bg-gray-600 dark:bg-gray-500"
                                        }`}
                                      >
                                        {mainAgent.status.name}
                                      </span>
                                    )}
                                  </div>
                                )}

                                {/* Additional Agents */}
                                {additionalAgents.length > 0 && (
                                  <div className="text-xs text-gray-600 dark:text-gray-400">
                                    +{additionalAgents.length} additional agent
                                    {additionalAgents.length > 1 ? "s" : ""}
                                    {additionalAgents.map((addAgent, idx) => (
                                      <div key={idx} className="ml-2">
                                        • {addAgent.agent?.name || "External"}:{" "}
                                        {addAgent.commissionType?.name ===
                                        "Percentage"
                                          ? `${addAgent.commissionValue}%`
                                          : `AED ${Number(
                                              addAgent.commissionValue
                                            ).toLocaleString()}`}
                                        {addAgent.isInternal !== undefined && (
                                          <span className="ml-1 text-xs">
                                            (
                                            {addAgent.isInternal
                                              ? "Internal"
                                              : "External"}
                                            )
                                          </span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Total Summary */}
                                {totalExpected !== undefined && (
                                  <div className="text-xs text-gray-700 dark:text-gray-300 font-semibold pt-1 border-t border-gray-200 dark:border-gray-700">
                                    Total: AED{" "}
                                    {Number(totalExpected).toLocaleString()}
                                    {totalPaid > 0 &&
                                      ` (Paid: AED ${Number(
                                        totalPaid
                                      ).toLocaleString()})`}
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-white text-xs sm:text-sm ${getStatusColor(
                              deal as DealApiResponse
                            )}`}
                          >
                            {(deal as DealApiResponse).status?.name ||
                              (deal as DealApiResponse).agentCommissions
                                ?.mainAgent?.status?.name ||
                              deal.statusId ||
                              "Pending"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              deal.compliance
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                            }`}
                          >
                            {deal.compliance ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onViewDeal(deal.id)}
                              className="flex items-center gap-1 text-xs sm:text-sm hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                            >
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="hidden sm:inline">View</span>
                            </Button>
                            {(() => {
                              const dealApi = deal as DealApiResponse;
                              const statusName =
                                dealApi.status?.name || deal.statusId || "";
                              const statusId =
                                dealApi.status?.id || deal.statusId || "";
                              const isAlreadyApproved =
                                (ceoApprovedStatusId &&
                                  statusId === ceoApprovedStatusId) ||
                                statusName.toLowerCase() === "ceo approved" ||
                                statusName.toLowerCase() === "ceo approve";
                              const isAlreadyRejected =
                                (ceoRejectedStatusId &&
                                  statusId === ceoRejectedStatusId) ||
                                statusName.toLowerCase() === "ceo rejected" ||
                                statusName.toLowerCase() === "ceo reject";

                              return (
                                <>
                                  {!isAlreadyApproved && !isAlreadyRejected && (
                                    <>
                                      {approvingDealId === deal.id ? (
                                        <Button
                                          variant="default"
                                          size="sm"
                                          disabled
                                          className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-xs sm:text-sm h-8 sm:h-9"
                                        >
                                          <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                                          <span className="hidden sm:inline">Approving...</span>
                                        </Button>
                                      ) : (
                                        <Button
                                          variant="default"
                                          size="sm"
                                          onClick={() => handleApprove(deal.id)}
                                          className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm h-8 sm:h-9"
                                        >
                                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                                          <span className="hidden sm:inline">Approve</span>
                                        </Button>
                                      )}
                                      {rejectingDealId === deal.id ? (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          disabled
                                          className="flex items-center gap-1 border-red-600 text-red-600 text-xs sm:text-sm h-8 sm:h-9"
                                        >
                                          <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                                          <span className="hidden sm:inline">Rejecting...</span>
                                        </Button>
                                      ) : (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleReject(deal.id)}
                                          className="flex items-center gap-1 border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs sm:text-sm h-8 sm:h-9"
                                        >
                                          <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                                          <span className="hidden sm:inline">Reject</span>
                                        </Button>
                                      )}
                                    </>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
