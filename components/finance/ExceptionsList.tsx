"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AlertTriangle, FileText, XCircle, Clock } from "lucide-react";
import type { ExceptionsSummaryResponse } from "@/lib/finance";
import type { ComponentType } from "react";

interface ExceptionsListProps {
  exceptions: ExceptionsSummaryResponse;
}

export function ExceptionsList({ exceptions }: ExceptionsListProps) {
  const exceptionIcons: Record<
    string,
    ComponentType<{ className?: string }>
  > = {
    "Missing Buyer Data": AlertTriangle,
    "Missing Seller Data": AlertTriangle,
    "Missing Payment Receipts": FileText,
    "Invalid Commission Rule": XCircle,
    "Manual Override Pending": Clock,
  };

  const exceptionColors: Record<string, string> = {
    "Missing Buyer Data": "text-red-600",
    "Missing Seller Data": "text-red-600",
    "Missing Payment Receipts": "text-orange-600",
    "Invalid Commission Rule": "text-red-600",
    "Manual Override Pending": "text-amber-600",
  };

  const exceptionsDisplay = exceptions
    .map((ex) => ({
      type: ex.label,
      count: ex.count,
      icon: exceptionIcons[ex.type] || AlertTriangle,
      color: exceptionColors[ex.type] || "text-red-600",
    }))
    .filter((ex) => ex.count > 0);

  const totalIssues = exceptionsDisplay.reduce((sum, ex) => sum + ex.count, 0);

  if (exceptionsDisplay.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Exceptions Requiring Action</CardTitle>
            <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium">
              0 issues
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No exceptions found
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>Exceptions Requiring Action</CardTitle>
          <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-medium">
            {totalIssues} issues
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {exceptionsDisplay.map((exception, index) => {
            const Icon = exception.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl p-4 bg-linear-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <Icon className={`h-5 w-5 ${exception.color}`} />
                    </div>
                    <div>
                      <div className="text-gray-900 dark:text-white font-medium">
                        {exception.type}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Requires immediate attention
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-semibold">
                    {exception.count}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
