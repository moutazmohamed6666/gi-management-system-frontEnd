import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DeveloperPerformanceData {
  id: string;
  name: string;
  value: number;
  commission: number;
}

interface CEOTopDevelopersTableProps {
  developerPerformance: DeveloperPerformanceData[];
}

export function CEOTopDevelopersTable({
  developerPerformance,
}: CEOTopDevelopersTableProps) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle>Top Developers by Value</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {developerPerformance.slice(0, 5).map((dev) => (
            <div
              key={dev.id || dev.name}
              className="group relative overflow-hidden rounded-xl p-4 bg-linear-to-br from-gray-50 to-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300"
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-1.5"
                style={{ backgroundColor: "var(--gi-dark-green)" }}
              ></div>
              <div className="flex items-center justify-between pl-3">
                <div>
                  <div className="text-gray-900 font-medium">{dev.name}</div>
                  <div className="text-sm text-gray-600">Top performer</div>
                </div>
                <div className="text-right">
                  <div className="text-lg text-gray-900 font-semibold">
                    AED {(dev.value / 1000000).toFixed(2)}M
                  </div>
                  <div className="text-sm text-gray-600">Total value</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

