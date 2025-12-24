"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import type { Deal } from "@/lib/deals";
import { dealsApi } from "@/lib/deals";
import { filtersApi } from "@/lib/filters";
import { Button } from "./ui/button";
import { Eye, CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

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
      status?: {
        id: string;
        name: string;
      };
    };
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
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load deals";
      setError(errorMessage);
      toast.error("Error loading deals", {
        description: errorMessage || "Failed to fetch deals. Please try again.",
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
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Could not approve deal. Please try again.";
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
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Could not reject deal. Please try again.";
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
          <CardTitle>
            {allDeals.length} {allDeals.length === 1 ? "Deal" : "Deals"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-3 text-gray-600 dark:text-gray-400">
                Loading deals...
              </span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <span className="ml-3 text-red-600 dark:text-red-400">
                {error}
              </span>
            </div>
          ) : allDeals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                No deals found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100 rounded-tl-lg">
                      Deal ID
                    </th>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">
                      Property
                    </th>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">
                      Buyer
                    </th>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">
                      Agent
                    </th>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">
                      Price
                    </th>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">
                      Commission
                    </th>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100 rounded-tr-lg">
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
                        <div className="text-gray-900 dark:text-gray-100 font-medium">
                          {deal.dealNumber}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-gray-900 dark:text-gray-100">
                          {deal.project?.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {deal.developer?.name || "N/A"}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-gray-900 dark:text-gray-100">
                          {deal.buyer?.name ||
                            deal.buyerSellerDetails?.find(
                              (d) => d.isBuyer === true
                            )?.name ||
                            "N/A"}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-gray-900 dark:text-gray-100">
                          {deal.agent?.name || "N/A"}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-gray-900 dark:text-gray-100">
                          AED {Number(deal.dealValue).toLocaleString()}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-gray-900 dark:text-gray-100">
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
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-white text-sm ${getStatusColor(
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
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewDeal(deal.id)}
                            className="flex items-center gap-1 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                          >
                            <Eye className="h-4 w-4" />
                            View
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
                                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                                      >
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Approving...
                                      </Button>
                                    ) : (
                                      <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => handleApprove(deal.id)}
                                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white"
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                        Approve
                                      </Button>
                                    )}
                                    {rejectingDealId === deal.id ? (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        disabled
                                        className="flex items-center gap-1 border-red-600 text-red-600"
                                      >
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Rejecting...
                                      </Button>
                                    ) : (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleReject(deal.id)}
                                        className="flex items-center gap-1 border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                      >
                                        <XCircle className="h-4 w-4" />
                                        Reject
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
