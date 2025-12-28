"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DollarSign, TrendingUp, FileCheck } from "lucide-react";

interface SummaryMetrics {
  totalCommission: number;
  grossRevenue: number;
  netRevenue: number;
  dealsClosed: number;
}

interface ReportsSummaryCardsProps {
  metrics: SummaryMetrics;
}

export function ReportsSummaryCards({ metrics }: ReportsSummaryCardsProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString();
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Deals Closed Card */}
      <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 px-3 sm:px-5 pt-3 sm:pt-4">
          <CardTitle className="text-xs sm:text-sm lg:text-base font-medium text-gray-600 dark:text-gray-400 truncate pr-2">
            Deals Closed
          </CardTitle>
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
            <FileCheck className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-3 sm:px-5 pb-3 sm:pb-4">
          <div className="text-xl sm:text-2xl lg:text-3xl text-gray-900 dark:text-white font-bold truncate">
            {metrics.dealsClosed}
          </div>
        </CardContent>
      </Card>

      {/* Total Commission Card */}
      <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 px-3 sm:px-5 pt-3 sm:pt-4">
          <CardTitle className="text-xs sm:text-sm lg:text-base font-medium text-gray-600 dark:text-gray-400 truncate pr-2">
            Total Commission
          </CardTitle>
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-3 sm:px-5 pb-3 sm:pb-4">
          <div className="text-xl sm:text-2xl lg:text-3xl text-gray-900 dark:text-white font-bold truncate">
            <span className="text-sm sm:text-base lg:text-xl font-semibold">AED</span>{" "}
            {formatCurrency(metrics.totalCommission)}
          </div>
        </CardContent>
      </Card>

      {/* Gross Revenue Card */}
      <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-800 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 px-3 sm:px-5 pt-3 sm:pt-4">
          <CardTitle className="text-xs sm:text-sm lg:text-base font-medium text-gray-600 dark:text-gray-400 truncate pr-2">
            Gross Revenue
          </CardTitle>
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-3 sm:px-5 pb-3 sm:pb-4">
          <div className="text-xl sm:text-2xl lg:text-3xl text-gray-900 dark:text-white font-bold truncate">
            <span className="text-sm sm:text-base lg:text-xl font-semibold">AED</span>{" "}
            {formatCurrency(metrics.grossRevenue)}
          </div>
        </CardContent>
      </Card>

      {/* Net Revenue Card */}
      <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-teal-50 to-white dark:from-teal-900/20 dark:to-gray-800 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 px-3 sm:px-5 pt-3 sm:pt-4">
          <CardTitle className="text-xs sm:text-sm lg:text-base font-medium text-gray-600 dark:text-gray-400 truncate pr-2">
            Net Revenue
          </CardTitle>
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600 dark:text-teal-400" />
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-3 sm:px-5 pb-3 sm:pb-4">
          <div className="text-xl sm:text-2xl lg:text-3xl text-gray-900 dark:text-white font-bold truncate">
            <span className="text-sm sm:text-base lg:text-xl font-semibold">AED</span>{" "}
            {formatCurrency(metrics.netRevenue)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

