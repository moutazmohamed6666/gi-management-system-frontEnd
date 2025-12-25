"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DollarSign, TrendingUp } from "lucide-react";

interface SummaryMetrics {
  totalCommission: number;
  grossRevenue: number;
  netRevenue: number;
}

interface ReportsSummaryCardsProps {
  metrics: SummaryMetrics;
}

export function ReportsSummaryCards({ metrics }: ReportsSummaryCardsProps) {
  const formatCurrency = (value: number) => {
    return value >= 1000
      ? `${(value / 1000).toFixed(0)}K`
      : value.toLocaleString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Commission Card */}
      <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-5 pt-4">
          <CardTitle className="text-base font-medium text-gray-600 dark:text-gray-400">
            Total Commission
          </CardTitle>
          <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-5 pb-4">
          <div className="text-3xl text-gray-900 dark:text-white font-bold">
            AED {formatCurrency(metrics.totalCommission)}
          </div>
        </CardContent>
      </Card>

      {/* Gross Revenue Card */}
      <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-5 pt-4">
          <CardTitle className="text-base font-medium text-gray-600 dark:text-gray-400">
            Gross Revenue
          </CardTitle>
          <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-5 pb-4">
          <div className="text-3xl text-gray-900 dark:text-white font-bold">
            AED {formatCurrency(metrics.grossRevenue)}
          </div>
        </CardContent>
      </Card>

      {/* Net Revenue Card */}
      <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-teal-50 to-white dark:from-teal-900/20 dark:to-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-5 pt-4">
          <CardTitle className="text-base font-medium text-gray-600 dark:text-gray-400">
            Net Revenue
          </CardTitle>
          <div className="h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-5 pb-4">
          <div className="text-3xl text-gray-900 dark:text-white font-bold">
            AED {formatCurrency(metrics.netRevenue)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

