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

interface AgentPerformanceData {
  id: string;
  name: string;
  commission: number;
  revenue: number;
}

interface CEOTopAgentsChartProps {
  agentPerformance: AgentPerformanceData[];
}

export function CEOTopAgentsChart({
  agentPerformance,
}: CEOTopAgentsChartProps) {
  const hasData =
    agentPerformance.length > 0 &&
    agentPerformance.some((item) => item.commission > 0);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle>Top Agents by Commission</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
            <BarChart3 className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium mb-1">No Data Available</p>
            <p className="text-sm text-center">
              No agent performance data available for the selected period
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={agentPerformance} layout="vertical">
              <defs>
                <linearGradient
                  id="colorAgents"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
                  <stop
                    offset="95%"
                    stopColor="#3b82f6"
                    stopOpacity={0.6}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                tickFormatter={(value) => `${value / 1000}K`}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={120}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
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
                  "Commission",
                ]}
              />
              <Bar
                dataKey="commission"
                fill="url(#colorAgents)"
                radius={[0, 8, 8, 0]}
                name="Commission (AED)"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

