"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  DollarSign,
  CheckCircle2,
  TrendingUp,
  Clock,
  Send,
  AlertCircle,
} from "lucide-react";
import type { KPIsResponse, FinanceMetricsResponse } from "@/lib/finance";

interface FinanceKPICardsProps {
  kpis: KPIsResponse | null;
  financeMetrics: FinanceMetricsResponse | null;
}

export function FinanceKPICards({
  kpis,
  financeMetrics,
}: FinanceKPICardsProps) {
  const totalExpectedCommission = kpis?.total_expected_commission || 0;
  const totalPaidCommission = kpis?.total_paid_commission || 0;
  const pendingCommissionAmount = kpis?.pending_commission_amount || 0;
  const pendingTransfers = kpis?.pending_transfers.count || 0;
  const overdueApprovals = kpis?.overdue_approvals || 0;
  const collectedCommissions = kpis?.collected_commissions || 0;
  const monthLabel = financeMetrics?.received.month_label || "";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
      {/* Received This Month */}
      <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-linear-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm text-gray-700 dark:text-gray-300">
            Received {monthLabel && `(${monthLabel})`}
          </CardTitle>
          <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl text-gray-900 dark:text-white">
              AED {collectedCommissions}
            </div>
            {financeMetrics?.collection_rate.trend === "up" && (
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp className="h-4 w-4" />
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {monthLabel ? `This ${monthLabel}` : "This month"}
          </p>
        </CardContent>
      </Card>

      {/* Total Expected Commission */}
      <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-linear-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm text-gray-700 dark:text-gray-300">
            Expected Commission
          </CardTitle>
          <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl text-gray-900 dark:text-white">
              AED {totalExpectedCommission}
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Total expected
          </p>
        </CardContent>
      </Card>

      {/* Total Paid Commission */}
      <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-linear-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm text-gray-700 dark:text-gray-300">
            Paid Commission
          </CardTitle>
          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl text-gray-900 dark:text-white">
              AED {totalPaidCommission}
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Already paid
          </p>
        </CardContent>
      </Card>

      {/* Pending Commission Amount */}
      <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-linear-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm text-gray-700 dark:text-gray-300">
            Pending Commission
          </CardTitle>
          <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
            <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl text-gray-900 dark:text-white">
              AED {pendingCommissionAmount}
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Outstanding
          </p>
        </CardContent>
      </Card>

      {/* Pending Transfers */}
      <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-linear-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm text-gray-700 dark:text-gray-300">
            Pending Transfers
          </CardTitle>
          <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
            <Send className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl text-gray-900 dark:text-white">
              {pendingTransfers}
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Awaiting transfer
          </p>
        </CardContent>
      </Card>

      {/* Overdue Approvals */}
      <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-linear-to-br from-red-50 to-white dark:from-red-900/20 dark:to-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm text-gray-700 dark:text-gray-300">
            Overdue Approvals
          </CardTitle>
          <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl text-gray-900 dark:text-white">
              {overdueApprovals}
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Urgent action
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
