import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface DeveloperPerformanceData {
  id: string;
  name: string;
  value: number;
  commission: number;
}

interface CEOTopDevelopersChartProps {
  developerPerformance: DeveloperPerformanceData[];
}

export function CEOTopDevelopersChart({
  developerPerformance,
}: CEOTopDevelopersChartProps) {
  const hasData =
    developerPerformance.length > 0 &&
    developerPerformance.some((item) => item.value > 0);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle>Developer Performance</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
            <BarChart3 className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium mb-1">No Data Available</p>
            <p className="text-sm text-center">
              No developer performance data available for the selected period
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={developerPerformance}>
              <defs>
                <linearGradient
                  id="colorDevelopers"
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
                dataKey="name"
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
                  `AED ${value.toLocaleString()}`,
                  "Revenue",
                ]}
              />
              <Bar
                dataKey="value"
                fill="url(#colorDevelopers)"
                radius={[8, 8, 0, 0]}
                name="Revenue (AED)"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
