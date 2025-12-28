import type { DealApiResponse } from "./types";

interface DealTotalCommissionCellProps {
  deal: DealApiResponse;
}

export function DealTotalCommissionCell({
  deal,
}: DealTotalCommissionCellProps) {
  const totalCommission = deal.totalCommission?.commissionValue ?? null;
  const commissionStatus = deal.totalCommission?.status?.name;
  const collectedAmount = deal.totalCommission?.collectedAmount ?? 0;

  return (
    <div className="space-y-1">
      <div className="text-sm text-gray-900 dark:text-gray-100">
        {totalCommission
          ? `AED ${Number(totalCommission).toLocaleString()}`
          : "-"}
      </div>
      {commissionStatus && (
        <div className="flex flex-col gap-0.5">
          <span
            className={`text-white inline-block px-2 py-0.5 rounded text-xs w-fit ${
              commissionStatus === "Paid"
                ? "bg-green-600 dark:bg-green-500"
                : commissionStatus === "Partially Paid"
                ? "bg-orange-600 dark:bg-orange-500"
                : commissionStatus === "Pending"
                ? "bg-gray-600 dark:bg-gray-500"
                : "bg-blue-600 dark:bg-blue-500"
            }`}
          >
            {commissionStatus}
          </span>
          {collectedAmount > 0 && (
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Collected: AED {Number(collectedAmount).toLocaleString()}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

