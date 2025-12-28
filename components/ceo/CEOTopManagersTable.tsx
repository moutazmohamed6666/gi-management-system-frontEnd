import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, BarChart3 } from "lucide-react";

interface ManagerPerformanceData {
  id: string;
  name: string;
  commission: number;
  revenue: number;
}

interface CEOTopManagersTableProps {
  managerPerformance: ManagerPerformanceData[];
}

export function CEOTopManagersTable({
  managerPerformance,
}: CEOTopManagersTableProps) {
  const hasData =
    managerPerformance.length > 0 &&
    managerPerformance.some((item) => item.commission > 0);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-purple-500" />
          <CardTitle>Top Managers by Revenue</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex flex-col items-center justify-center h-[200px] text-gray-500 dark:text-gray-400">
            <BarChart3 className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium mb-1">No Data Available</p>
            <p className="text-sm text-center">
              No manager performance data available
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {managerPerformance.map((manager, index) => (
              <div
                key={manager.id || manager.name}
                className="group relative overflow-hidden rounded-xl p-4 bg-linear-to-br from-gray-50 to-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        index === 0
                          ? "bg-linear-to-br from-purple-400 to-purple-500"
                          : "bg-linear-to-br from-gray-400 to-gray-500"
                      } text-white shadow-lg`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-gray-900 font-medium">
                        {manager.name}
                      </div>
                      <div className="text-sm text-gray-600">Top performer</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg text-gray-900 font-semibold">
                      AED {manager.commission}
                    </div>
                    <div className="text-sm text-gray-600">Revenue</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
