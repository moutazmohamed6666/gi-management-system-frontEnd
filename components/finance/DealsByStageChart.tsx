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
  Cell,
} from "recharts";
import type { DealsByStageResponse } from "@/lib/finance";

interface DealsByStageChartProps {
  dealsByStage: DealsByStageResponse;
}

export function DealsByStageChart({ dealsByStage }: DealsByStageChartProps) {
  const stageColors: Record<string, string> = {
    Draft: "#94a3b8",
    Submitted: "#fbbf24",
    "Finance Review": "#fb923c",
    "Finance Approved": "#60a5fa",
    "Commission Received": "#34d399",
    Transferred: "#a78bfa",
    Closed: "#22c55e",
  };

  const chartData = dealsByStage.map((stage) => ({
    name: stage.stage,
    value: stage.count,
    color: stageColors[stage.stage] || "#94a3b8",
  }));

  if (chartData.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle>Deals by Stage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
            Coming soon
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle>Deals by Stage</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 11 }}
              width={130}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value: number) => [`${value} deals`, ""]}
            />
            <Bar dataKey="value" radius={[0, 8, 8, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
