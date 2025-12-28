"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Users, Building2 } from "lucide-react";
import type { TopPerformanceResponse } from "@/lib/finance";

interface TopPerformanceProps {
  topPerformance: TopPerformanceResponse | null;
}

export function TopPerformance({ topPerformance }: TopPerformanceProps) {
  const topDevelopers =
    topPerformance?.top_developers.map((d) => ({
      name: d.name,
      revenue: d.total_revenue,
    })) || [];

  const topAgents =
    topPerformance?.top_agents.map((a) => ({
      name: a.name,
      revenue: a.total_revenue,
    })) || [];

  const topManagers =
    topPerformance?.top_managers.map((m) => ({
      name: m.name,
      revenue: m.total_revenue,
    })) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Top Developers */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <CardTitle>Top Developers by Revenue</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {topDevelopers.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No data available
            </div>
          ) : (
            <div className="space-y-3">
              {topDevelopers.map((dev, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-linear-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="text-sm text-gray-900 dark:text-white font-medium">
                      {dev.name}
                    </div>
                  </div>
                  <div className="text-sm text-gray-900 dark:text-white font-semibold">
                    AED {dev.revenue}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Agents */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <CardTitle>Top Agents by Revenue</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {topAgents.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No data available
            </div>
          ) : (
            <div className="space-y-3">
              {topAgents.map((agent, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-linear-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="text-sm text-gray-900 dark:text-white font-medium">
                      {agent.name}
                    </div>
                  </div>
                  <div className="text-sm text-gray-900 dark:text-white font-semibold">
                    AED {agent.revenue}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Managers */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <CardTitle>Top Managers by Revenue</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {topManagers.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No data available
            </div>
          ) : (
            <div className="space-y-3">
              {topManagers.map((manager, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-linear-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="text-sm text-gray-900 dark:text-white font-medium">
                      {manager.name}
                    </div>
                  </div>
                  <div className="text-sm text-gray-900 dark:text-white font-semibold">
                    AED {manager.revenue}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
