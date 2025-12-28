import type { DealApiResponse } from "./types";

interface DealAgentCommissionCellProps {
  deal: DealApiResponse;
}

export function DealAgentCommissionCell({
  deal,
}: DealAgentCommissionCellProps) {
  const mainAgent = deal.agentCommissions?.mainAgent;
  const additionalAgents = deal.agentCommissions?.additionalAgents || [];
  const totalExpected = deal.agentCommissions?.totalExpected;
  const totalPaid = deal.agentCommissions?.totalPaid || 0;

  return (
    <div className="space-y-1">
      {/* Main Agent Commission */}
      {mainAgent && (
        <div className="text-xs sm:text-sm">
          <div className="text-gray-900 dark:text-gray-100 font-medium">
            Main: AED {Number(mainAgent.expectedAmount || 0).toLocaleString()}
          </div>
          {mainAgent.status?.name && (
            <span
              className={`text-white inline-block px-2 py-0.5 rounded text-xs mt-1 ${
                mainAgent.status.name === "Paid"
                  ? "bg-green-600 dark:bg-green-500"
                  : mainAgent.status.name === "Partially Paid"
                  ? "bg-orange-600 dark:bg-orange-500"
                  : "bg-gray-600 dark:bg-gray-500"
              }`}
            >
              {mainAgent.status.name}
            </span>
          )}
        </div>
      )}

      {/* Additional Agents */}
      {additionalAgents.length > 0 && (
        <div className="text-xs text-gray-600 dark:text-gray-400">
          +{additionalAgents.length} additional agent
          {additionalAgents.length > 1 ? "s" : ""}
          {additionalAgents.map((addAgent, idx) => (
            <div key={idx} className="ml-2">
              • {addAgent.agent?.name || "External"}: AED{" "}
              {Number(addAgent.commissionValue).toLocaleString()}
              {addAgent.isInternal !== undefined && (
                <span className="ml-1 text-xs">
                  ({addAgent.isInternal ? "Internal" : "External"})
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Total Summary */}
      {totalExpected !== undefined && (
        <div className="text-xs text-gray-700 dark:text-gray-300 font-semibold pt-1 border-t border-gray-200 dark:border-gray-700">
          Total: AED {Number(totalExpected).toLocaleString()}
          {totalPaid > 0 &&
            ` (Paid: AED ${Number(totalPaid).toLocaleString()})`}
        </div>
      )}
    </div>
  );
}

