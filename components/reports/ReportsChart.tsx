"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { ReportType } from "@/lib/reports";

// Chart color palette
const CHART_COLORS = [
  "var(--gi-dark-green)",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#10b981",
];

interface ReportsChartProps {
  reportType: ReportType;
  chartData: unknown[];
}

export function ReportsChart({ reportType, chartData }: ReportsChartProps) {
  const getReportTypeLabel = (type: ReportType) => {
    switch (type) {
      case "monthly_revenue":
        return "Monthly Revenue";
      case "commission_summary":
        return "Commission Summary";
      case "deal_pipeline":
        return "Deal Pipeline";
      case "agent_performance":
        return "Agent Performance";
      default:
        return "Report";
    }
  };

  // Check if chartData has any non-zero values
  type ChartDataItem = {
    revenue?: number;
    count?: number;
    value?: number;
    commission?: number;
    commissionCollected?: number;
    pendingCommission?: number;
    grossRevenue?: number;
    totalCommission?: number;
    netRevenue?: number;
    [key: string]: unknown;
  };
  const typedChartData = chartData as ChartDataItem[];
  const hasData =
    typedChartData.length > 0 &&
    (reportType === "monthly_revenue"
      ? typedChartData.some(
          (item) =>
            (item.totalCommission || 0) > 0 ||
            (item.grossRevenue || 0) > 0 ||
            (item.netRevenue || 0) > 0
        )
      : reportType === "deal_pipeline"
      ? typedChartData.some((item) => (item.count || 0) > 0)
      : typedChartData.some((item) => {
          const value =
            item.value ||
            item.commission ||
            item.revenue ||
            item.count ||
            0;
          return value > 0;
        }));

  if (!hasData) {
    return (
      <Card className="border-0 shadow-lg lg:col-span-2">
        <CardHeader className="pb-4">
          <CardTitle>{getReportTypeLabel(reportType)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
            <BarChart3 className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium mb-1">No Data Available</p>
            <p className="text-sm text-center">
              No data available for the selected period and filters
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg lg:col-span-2">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>{getReportTypeLabel(reportType)}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            {reportType === "monthly_revenue" ? (
              <>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                  <span>Total Commission</span>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: "var(--gi-dark-green)" }}
                  ></div>
                  <span>Gross Revenue</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-teal-500"></div>
                  <span>Net Revenue</span>
                </div>
              </>
            ) : (
              <>
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: "var(--gi-dark-green)" }}
                ></div>
                <span>Data</span>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {reportType === "monthly_revenue" ? (
            <LineChart data={chartData}>
              <defs>
                <linearGradient
                  id="colorTotalCommission"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#8b5cf6"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="#8b5cf6"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient
                  id="colorGrossRevenue"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--gi-dark-green)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--gi-dark-green)"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient
                  id="colorNetRevenue"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#14b8a6"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="#14b8a6"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
              />
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
                ]}
              />
              <Line
                type="monotone"
                dataKey="totalCommission"
                stroke="#8b5cf6"
                strokeWidth={3}
                fill="url(#colorTotalCommission)"
                name="Total Commission"
                dot={{ fill: "#8b5cf6", r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="grossRevenue"
                stroke="var(--gi-dark-green)"
                strokeWidth={3}
                fill="url(#colorGrossRevenue)"
                name="Gross Revenue"
                dot={{ fill: "var(--gi-dark-green)", r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="netRevenue"
                stroke="#14b8a6"
                strokeWidth={3}
                fill="url(#colorNetRevenue)"
                name="Net Revenue"
                dot={{ fill: "#14b8a6", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          ) : reportType === "deal_pipeline" ? (
            <PieChart>
              <Pie
                data={
                  chartData as Array<{
                    stage: string;
                    count: number;
                    value: number;
                    percentage: number;
                  }>
                }
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="count"
                nameKey="stage"
                label={({ name, percent }) =>
                  `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [value, name]}
              />
            </PieChart>
          ) : (
            <BarChart data={chartData}>
              <defs>
                <linearGradient
                  id="colorBarReport"
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
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey={
                  reportType === "agent_performance"
                    ? "agent_name"
                    : "category"
                }
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                tickFormatter={(value) =>
                  value >= 1000 ? `${value / 1000}K` : value
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value: number) => [
                  value >= 1000
                    ? `AED ${value.toLocaleString()}`
                    : value,
                  reportType === "agent_performance"
                    ? "Commission"
                    : "Amount",
                ]}
              />
              <Bar
                dataKey={
                  reportType === "agent_performance"
                    ? "total_commission"
                    : reportType === "commission_summary"
                    ? "collected"
                    : "value"
                }
                fill="url(#colorBarReport)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

