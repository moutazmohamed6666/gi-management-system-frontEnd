"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart3 } from "lucide-react";
import type { AgentMonthlyPerformanceResponse } from "@/lib/finance";

interface MonthlyPerformanceChartProps {
  monthlyPerformance: AgentMonthlyPerformanceResponse | null;
  hasMonthlyData: boolean;
}

export function MonthlyPerformanceChart({
  monthlyPerformance,
  hasMonthlyData,
}: MonthlyPerformanceChartProps) {
  // Transform monthly performance data for chart
  const monthlyData = monthlyPerformance?.data
    ? monthlyPerformance.data.map((item) => {
        // Format month from "2025-12" to "Dec" or "Dec 2025"
        let monthLabel = item.month;
        try {
          const [year, month] = item.month.split("-");
          const date = new Date(parseInt(year), parseInt(month) - 1);
          monthLabel = date.toLocaleString("en-US", { month: "short" });
        } catch {
          // If parsing fails, use the original value
        }

        return {
          month: monthLabel,
          deals: 0, // Not provided in API response
          commission: item.totalCommission || 0,
        };
      })
    : [];

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>Monthly Performance</CardTitle>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: "var(--gi-dark-green)" }}
            ></div>
            <span>Commission</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!hasMonthlyData ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
            <BarChart3 className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium mb-1">No Data Available</p>
            <p className="text-sm text-center">
              No commission data available for the selected period
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <defs>
                <linearGradient
                  id="colorCommission"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--gi-dark-green)"
                    stopOpacity={0.9}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--gi-dark-green)"
                    stopOpacity={0.6}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value: number) => [
                  `${monthlyPerformance?.currency || "AED"} ${value.toLocaleString()}`,
                  "Commission",
                ]}
              />
              <Bar
                dataKey="commission"
                fill="url(#colorCommission)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

