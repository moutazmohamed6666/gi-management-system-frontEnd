import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface AgentPerformanceData {
  id: string;
  name: string;
  commission: number;
  revenue: number;
}

interface CEOAgentLeaderboardProps {
  agentPerformance: AgentPerformanceData[];
}

export function CEOAgentLeaderboard({
  agentPerformance,
}: CEOAgentLeaderboardProps) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <CardTitle>Agent Leaderboard</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {agentPerformance.map((agent, index) => (
            <div
              key={agent.id || agent.name}
              className="group relative overflow-hidden rounded-xl p-4 bg-linear-to-br from-gray-50 to-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index === 0
                        ? "bg-linear-to-br from-yellow-400 to-yellow-500"
                        : "bg-linear-to-br from-gray-400 to-gray-500"
                    } text-white shadow-lg`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-gray-900 font-medium">
                      {agent.name}
                    </div>
                    <div className="text-sm text-gray-600">Top performer</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg text-gray-900 font-semibold">
                    AED {(agent.commission / 1000).toFixed(0)}K
                  </div>
                  <div className="text-sm text-gray-600">Commission</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

