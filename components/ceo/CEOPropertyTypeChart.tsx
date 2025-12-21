import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart3 } from "lucide-react";

interface PropertyTypeData {
  name: string;
  value: number;
  color: string;
  [key: string]: any;
}

interface CEOPropertyTypeChartProps {
  propertyTypes: PropertyTypeData[];
}

export function CEOPropertyTypeChart({
  propertyTypes,
}: CEOPropertyTypeChartProps) {
  const hasData = propertyTypes.some((item) => item.value > 0);
  const dataWithValues = propertyTypes.filter((item) => item.value > 0);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle>Property Type Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
            <BarChart3 className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium mb-1">No Data Available</p>
            <p className="text-sm text-center">
              No property type data available for the selected period
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <defs>
                    <filter id="shadowCEO" height="130%">
                      <feDropShadow
                        dx="0"
                        dy="2"
                        stdDeviation="3"
                        floodOpacity="0.3"
                      />
                    </filter>
                  </defs>
                  <Pie
                    data={dataWithValues}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) =>
                      `${name}: ${value} (${((percent ?? 0) * 100).toFixed(
                        0
                      )}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    style={{ filter: "url(#shadowCEO)" }}
                  >
                    {dataWithValues.map((entry, index) => (
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
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-6">
              {propertyTypes.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600">{item.name}</div>
                  <div className="text-xl text-gray-900">{item.value}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

