"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { AnalyticsResponse } from "@/lib/reports";

interface ReportsCommissionOverviewProps {
  analyticsData: AnalyticsResponse | null;
}

export function ReportsCommissionOverview({
  analyticsData,
}: ReportsCommissionOverviewProps) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Commission Overview</CardTitle>
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span>Collected</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-orange-500"></div>
              <span>Pending </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Commission Progress */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-base font-medium text-gray-700 dark:text-gray-300">
                Collection Progress
              </span>
              <span className="text-base text-gray-900 dark:text-white font-semibold">
                {analyticsData?.summary?.collection_rate
                  ? `${analyticsData.summary.collection_rate.toFixed(1)}%`
                  : "0%"}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className="bg-green-500 h-4 rounded-full transition-all duration-500"
                style={{
                  width: `${analyticsData?.summary?.collection_rate || 0}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Collected
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                AED{" "}
                {(
                  analyticsData?.summary?.total_collected || 0
                ).toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pending Agent Commissions
              </p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                AED{" "}
                {(analyticsData?.summary?.total_pending || 0).toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Transferred
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                AED{" "}
                {(
                  analyticsData?.summary?.total_transferred || 0
                ).toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Expected Collection
              </p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                AED{" "}
                {(analyticsData?.summary?.total_expected || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
