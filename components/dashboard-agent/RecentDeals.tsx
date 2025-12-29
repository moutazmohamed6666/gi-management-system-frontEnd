"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Home } from "lucide-react";
import type { Deal } from "@/lib/deals";

interface RecentDealsProps {
  agentDeals: Deal[];
  totalDeals: number;
  isLoading: boolean;
  getCommissionPaid: (deal: Deal) => number;
  getCommissionTotal: (deal: Deal) => number;
}

export function RecentDeals({
  agentDeals,
  totalDeals,
  isLoading,
  getCommissionPaid,
  getCommissionTotal,
}: RecentDealsProps) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>Recent Deals</CardTitle>
          <span className="text-sm text-gray-600">
            {totalDeals} total deals
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              Loading deals...
            </div>
          ) : agentDeals.length === 0 ? (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              No deals found
            </div>
          ) : (
            agentDeals.slice(0, 5).map((deal) => (
              <div
                key={deal.id}
                className="group relative overflow-hidden rounded-xl p-4 bg-linear-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-md dark:hover:shadow-xl dark:hover:shadow-black/20 transition-all duration-300"
              >
                {/* Decorative accent */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-1.5"
                  style={{ backgroundColor: "var(--gi-dark-green)" }}
                ></div>

                <div className="flex items-center justify-between pl-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                        <Home className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                      </div>
                      <div>
                        <div className="text-gray-900 dark:text-gray-100 font-medium">
                          {deal.project?.name || "N/A"} - Unit{" "}
                          {deal.unitNumber || "N/A"}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {deal.buyerSellerDetails?.find((d) => d.isBuyer)
                            ?.name || "N/A"}{" "}
                          • {deal.developer?.name || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <div className="text-lg text-gray-900 dark:text-gray-100 font-semibold">
                      AED{" "}
                      {typeof deal.dealValue === "string"
                        ? parseFloat(deal.dealValue)
                        : deal.dealValue || 0}
                    </div>
                    {(() => {
                      const paidAmount = getCommissionPaid(deal);
                      const totalAmount = getCommissionTotal(deal);
                      const status =
                        paidAmount >= totalAmount && totalAmount > 0
                          ? "Paid"
                          : paidAmount > 0
                          ? "Partially Paid"
                          : "Pending";
                      const statusColor =
                        status === "Paid"
                          ? "bg-linear-to-r from-green-600 to-green-500 dark:from-green-500 dark:to-green-400"
                          : status === "Partially Paid"
                          ? "bg-linear-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400"
                          : "bg-linear-to-r from-orange-600 to-orange-500 dark:from-orange-500 dark:to-orange-400";
                      return (
                        <div
                          className={`inline-flex px-3 py-1 rounded-full text-sm text-white ${statusColor}`}
                        >
                          {status}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

