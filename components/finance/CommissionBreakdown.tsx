"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { KPIsResponse } from "@/lib/finance";

interface CommissionBreakdownProps {
  kpis: KPIsResponse | null;
}

export function CommissionBreakdown({ kpis }: CommissionBreakdownProps) {
  const commissionBreakdown = kpis
    ? {
        agent: kpis.commission_breakdown.AGENT.paid,
        manager: kpis.commission_breakdown.MANAGER.paid,
        company: kpis.commission_breakdown.COMPANY.paid,
      }
    : {
        agent: 0,
        manager: 0,
        company: 0,
      };

  const total =
    commissionBreakdown.agent +
    commissionBreakdown.manager +
    commissionBreakdown.company;
  const agentPercentage =
    total > 0 ? ((commissionBreakdown.agent / total) * 100).toFixed(1) : "0";
  const managerPercentage =
    total > 0 ? ((commissionBreakdown.manager / total) * 100).toFixed(1) : "0";
  const companyPercentage =
    total > 0 ? ((commissionBreakdown.company / total) * 100).toFixed(1) : "0";

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle>Commission Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-linear-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-800 rounded-lg border border-green-100 dark:border-green-900/30">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Agent Commission
            </div>
            <div className="text-2xl text-gray-900 dark:text-white font-semibold">
              AED {commissionBreakdown.agent}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {agentPercentage}% of total
            </div>
          </div>
          <div className="text-center p-4 bg-linear-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 rounded-lg border border-blue-100 dark:border-blue-900/30">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Manager Commission
            </div>
            <div className="text-2xl text-gray-900 dark:text-white font-semibold">
              AED {commissionBreakdown.manager}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {managerPercentage}% of total
            </div>
          </div>
          <div className="text-center p-4 bg-linear-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800 rounded-lg border border-purple-100 dark:border-purple-900/30">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Company Retention
            </div>
            <div className="text-2xl text-gray-900 dark:text-white font-semibold">
              AED {commissionBreakdown.company}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {companyPercentage}% of total
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
