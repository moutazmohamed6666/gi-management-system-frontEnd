"use client";

import { Target } from "lucide-react";

interface CollectionDealsMetrics {
  commissionCollected: number;
  pendingCommission: number;
  dealClosed: number;
}

interface ReportsCollectionDealsProps {
  metrics: CollectionDealsMetrics;
}

export function ReportsCollectionDeals({
  metrics,
}: ReportsCollectionDealsProps) {
  const formatCurrency = (value: number) => {
    return value >= 1000
      ? `${(value / 1000).toFixed(0)}K`
      : value.toLocaleString();
  };

  return (
    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
          <Target className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Collection & Deals
        </p>
      </div>
      <div className="space-y-2.5 ml-15">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Collected
          </span>
          <span className="text-base font-bold text-gray-900 dark:text-white">
            AED {formatCurrency(metrics.commissionCollected)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Pending
          </span>
          <span className="text-base font-bold text-orange-600 dark:text-orange-400">
            AED {formatCurrency(metrics.pendingCommission)}
          </span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-emerald-200 dark:border-emerald-800">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Deals Closed
          </span>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {metrics.dealClosed}
          </span>
        </div>
      </div>
    </div>
  );
}

