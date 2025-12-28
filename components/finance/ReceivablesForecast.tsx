"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Hourglass } from "lucide-react";
import type { ReceivablesForecastResponse } from "@/lib/finance";

interface ReceivablesForecastProps {
  forecast: ReceivablesForecastResponse | null;
}

export function ReceivablesForecast({ forecast }: ReceivablesForecastProps) {
  const next30Days = forecast?.next_30_days || 0;
  const next60Days = forecast?.next_60_days || 0;
  const next90Days = forecast?.next_90_days || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-linear-to-br from-cyan-50 to-white dark:from-cyan-900/20 dark:to-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm text-gray-700 dark:text-gray-300">
            Expected Next 30 Days
          </CardTitle>
          <div className="h-10 w-10 rounded-full bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center">
            <Hourglass className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl text-gray-900 dark:text-white">
            AED {next30Days}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Expected receivables
          </p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-linear-to-br from-teal-50 to-white dark:from-teal-900/20 dark:to-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm text-gray-700 dark:text-gray-300">
            Expected Next 60 Days
          </CardTitle>
          <div className="h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center">
            <Hourglass className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl text-gray-900 dark:text-white">
            AED {next60Days}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Expected receivables
          </p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-linear-to-br from-sky-50 to-white dark:from-sky-900/20 dark:to-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm text-gray-700 dark:text-gray-300">
            Expected Next 90 Days
          </CardTitle>
          <div className="h-10 w-10 rounded-full bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center">
            <Hourglass className="h-5 w-5 text-sky-600 dark:text-sky-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl text-gray-900 dark:text-white">
            AED {next90Days}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Expected receivables
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
