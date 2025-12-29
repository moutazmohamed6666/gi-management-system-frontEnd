"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { BarChart3 } from "lucide-react";
import { useIsMobile } from "../ui/use-mobile";

interface StatusDataItem {
  name: string;
  value: number;
  color: string;
  [key: string]: unknown;
}

interface DealStatusBreakdownProps {
  statusData: StatusDataItem[];
  hasStatusData: boolean;
}

export function DealStatusBreakdown({
  statusData,
  hasStatusData,
}: DealStatusBreakdownProps) {
  const isMobile = useIsMobile();

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle>Deal Status Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasStatusData ? (
          <div className="flex flex-col items-center justify-center h-[200px] sm:h-[280px] text-gray-500 dark:text-gray-400">
            <BarChart3 className="h-10 w-10 sm:h-12 sm:w-12 mb-4 opacity-50" />
            <p className="text-base sm:text-lg font-medium mb-1">
              No Data Available
            </p>
            <p className="text-xs sm:text-sm text-center">
              No deal status data available for the selected period
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={isMobile ? 180 : 260}>
                <PieChart>
                  <defs>
                    <filter id="shadow" height="130%">
                      <feDropShadow
                        dx="0"
                        dy="2"
                        stdDeviation="3"
                        floodOpacity="0.3"
                      />
                    </filter>
                  </defs>
                  <Pie
                    data={statusData.filter((item) => item.value > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ percent }) =>
                      `${((percent ?? 0) * 100).toFixed(2)}%`
                    }
                    outerRadius={isMobile ? 55 : 85}
                    fill="#8884d8"
                    dataKey="value"
                    style={{ filter: "url(#shadow)" }}
                  >
                    {statusData
                      .filter((item) => item.value > 0)
                      .map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    formatter={(value: number, name: string) => [value, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 mt-4">
              {statusData
                .filter((item) => item.value > 0)
                .map((item, index) => (
                  <div
                    key={index}
                    className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                  >
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1">
                      <div
                        className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                        {item.name}
                      </span>
                    </div>
                    <div className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {item.value}
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
