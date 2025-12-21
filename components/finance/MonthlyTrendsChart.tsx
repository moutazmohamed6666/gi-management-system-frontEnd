"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart3 } from "lucide-react";
import type { FinanceMetricsResponse } from "@/lib/finance";

interface MonthlyTrendsChartProps {
  financeMetrics: FinanceMetricsResponse | null;
}

export function MonthlyTrendsChart({
  financeMetrics,
}: MonthlyTrendsChartProps) {
  const monthlyTrends = financeMetrics?.monthly_breakdown
    ? Object.entries(financeMetrics.monthly_breakdown).map(
        ([month, received]) => ({
          month,
          received,
          expected:
            financeMetrics.expected_commission.total /
            Object.keys(financeMetrics.monthly_breakdown).length,
        })
      )
    : [];

  const hasData =
    monthlyTrends.length > 0 &&
    monthlyTrends.some((item) => item.received > 0 || item.expected > 0);

  if (monthlyTrends.length === 0 || !hasData) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Received vs Expected</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
            <BarChart3 className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium mb-1">No Data Available</p>
            <p className="text-sm text-center">
              No commission data available for the selected period
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>Received vs Expected</CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-gray-400"></div>
              <span className="text-gray-600 dark:text-gray-400">Expected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-gray-600 dark:text-gray-400">Received</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyTrends}>
            <defs>
              <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
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
              tickFormatter={(value) => `${value / 1000}K`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value: number) => [
                `AED ${value.toLocaleString()}`,
                "",
              ]}
            />
            <Line
              type="monotone"
              dataKey="expected"
              stroke="#94a3b8"
              strokeWidth={2}
              name="Expected"
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="received"
              stroke="#22c55e"
              strokeWidth={3}
              name="Received"
              fill="url(#colorReceived)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
