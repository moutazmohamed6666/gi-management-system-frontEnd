"use client";

import { Card, CardContent } from "../ui/card";
import { DollarSign, Banknote, Send, Clock } from "lucide-react";
import type { CommissionSummary } from "@/lib/commissions";

interface CommissionSummaryCardsProps {
  summary: CommissionSummary;
}

export function CommissionSummaryCards({
  summary,
}: CommissionSummaryCardsProps) {
  // Only show Total Transferred if we have transfer data from API
  const hasTransferData =
    summary.totalTransferred !== undefined && summary.totalTransferred !== null;

  return (
    <div
      className={`grid grid-cols-1 ${
        hasTransferData ? "md:grid-cols-4" : "md:grid-cols-3"
      } gap-4`}
    >
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
                AED {summary.totalExpected.toLocaleString()}
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
                AED {summary.totalCollected.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {hasTransferData && summary.totalTransferred !== undefined && (
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
                  AED {summary.totalTransferred.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                AED {summary.remainingToCollect.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
