"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { mockDeals } from "@/lib/mockData";
import { Button } from "./ui/button";
import { Eye, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CEODealsListProps {
  onViewDeal: (dealId: string) => void;
}

export function CEODealsList({ onViewDeal }: CEODealsListProps) {
  const [approvingDealId, setApprovingDealId] = useState<string | null>(null);
  const [rejectingDealId, setRejectingDealId] = useState<string | null>(null);

  // Filter deals that require CEO action (Finance Review or Approved status)
  const dealsRequiringAction = mockDeals.filter(
    (deal) =>
      deal.status === "Finance Review" ||
      deal.status === "Approved" ||
      deal.status === "Submitted"
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Finance Review":
        return "bg-orange-600";
      case "Approved":
        return "bg-blue-600";
      case "Submitted":
        return "bg-yellow-600";
      default:
        return "bg-gray-600";
    }
  };

  const handleApprove = async (dealId: string) => {
    setApprovingDealId(dealId);

    // Simulate API call
    setTimeout(() => {
      setApprovingDealId(null);
      toast.success("Deal Approved", {
        description: `Deal ${dealId} has been approved and moved to the next stage.`,
        duration: 3000,
      });
    }, 1500);
  };

  const handleReject = async (dealId: string) => {
    setRejectingDealId(dealId);

    // Simulate API call
    setTimeout(() => {
      setRejectingDealId(null);
      toast.error("Deal Rejected", {
        description: `Deal ${dealId} has been rejected and returned for review.`,
        duration: 3000,
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 dark:text-white">
            Deals Requiring Action
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Review and approve deals pending your action
          </p>
        </div>
        <div className="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg border border-orange-200 dark:border-orange-800">
          <p className="text-orange-700 dark:text-orange-300 font-medium">
            {dealsRequiringAction.length} deals pending approval
          </p>
        </div>
      </div>

      {/* Deals Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle>
            {dealsRequiringAction.length} Deals Requiring Action
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dealsRequiringAction.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                No deals currently require your action.
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
                  {dealsRequiringAction.map((deal) => (
                    <tr
                      key={deal.id}
                      className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="text-gray-900 dark:text-gray-100 font-medium">
                          {deal.id}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-gray-900 dark:text-gray-100">
                          {deal.project}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {deal.developer}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-gray-900 dark:text-gray-100">
                          {deal.buyerName}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-gray-900 dark:text-gray-100">
                          {deal.agentName}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-gray-900 dark:text-gray-100">
                          AED {deal.sellingPrice.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-gray-900 dark:text-gray-100">
                          {deal.agentCommission
                            ? `AED ${deal.agentCommission.toLocaleString()}`
                            : "-"}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-white text-sm ${getStatusColor(
                            deal.status
                          )}`}
                        >
                          {deal.status}
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
