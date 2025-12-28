"use client";

import { Users } from "lucide-react";

interface CommissionBreakdownMetrics {
  agentCommission: number;
  externalAgentCommissions: number;
  managerCommission: number;
}

interface ReportsCommissionBreakdownProps {
  metrics: CommissionBreakdownMetrics;
}

export function ReportsCommissionBreakdown({
  metrics,
}: ReportsCommissionBreakdownProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString();
  };

  return (
    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
          <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Commission Breakdown
        </p>
      </div>
      <div className="space-y-2.5 ml-15">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Agent
          </span>
          <span className="text-base font-bold text-gray-900 dark:text-white">
            AED {formatCurrency(metrics.agentCommission)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            External
          </span>
          <span className="text-base font-bold text-cyan-600 dark:text-cyan-400">
            AED {formatCurrency(metrics.externalAgentCommissions)}
          </span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-indigo-200 dark:border-indigo-800">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Manager
          </span>
          <span className="text-base font-bold text-pink-600 dark:text-pink-400">
            AED {formatCurrency(metrics.managerCommission)}
          </span>
        </div>
      </div>
    </div>
  );
}

