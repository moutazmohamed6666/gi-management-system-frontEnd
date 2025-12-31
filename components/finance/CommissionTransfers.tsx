"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { CommissionTransfersResponse } from "@/lib/finance";

interface CommissionTransfersProps {
  commissionTransfers: CommissionTransfersResponse | null;
}

export function CommissionTransfers({
  commissionTransfers,
}: CommissionTransfersProps) {
  const transferTracking = commissionTransfers
    ? {
        pendingCount: commissionTransfers.pending_transfers.count,
        pendingAmount: commissionTransfers.pending_transfers.amount,
        completedThisMonth: commissionTransfers.completed_this_month.count,
        completedAmount: commissionTransfers.completed_this_month.amount,
        pendingExternalTransfersAmount:
          commissionTransfers.pending_external_transfers.amount,
        pendingExternalTransfersCount:
          commissionTransfers.pending_external_transfers.count,
      }
    : {
        pendingCount: 0,
        pendingAmount: 0,
        completedThisMonth: 0,
        completedAmount: 0,
        pendingExternalTransfersAmount: 0,
        pendingExternalTransfersCount: 0,
      };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle>Commission Transfers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="group relative overflow-hidden rounded-xl p-4 bg-linear-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-800 border border-orange-100 dark:border-orange-900/30">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
            <div className="pl-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Pending Transfers for Agents
                </div>
                <div className="text-xl text-gray-900 dark:text-white font-semibold">
                  {transferTracking.pendingCount}
                </div>
              </div>
              <div className="text-2xl text-gray-900 dark:text-white font-semibold">
                AED {transferTracking.pendingAmount}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Awaiting processing
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl p-4 bg-linear-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-800 border border-green-100 dark:border-green-900/30">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
            <div className="pl-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Completed This Month
                </div>
                <div className="text-xl text-gray-900 dark:text-white font-semibold">
                  {transferTracking.completedThisMonth}
                </div>
              </div>
              <div className="text-2xl text-gray-900 dark:text-white font-semibold">
                AED {transferTracking.completedAmount}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Successfully transferred
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl p-4 bg-linear-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 border border-blue-100 dark:border-blue-900/30">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
            <div className="pl-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Pending Transfers for External Agents
                </div>
                <div className="text-xl text-gray-900 dark:text-white font-semibold">
                  {transferTracking.pendingExternalTransfersCount}
                </div>
              </div>
              <div className="text-3xl text-gray-900 dark:text-white font-semibold">
                AED {transferTracking.pendingExternalTransfersAmount}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Processing speed
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
