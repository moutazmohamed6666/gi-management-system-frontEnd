import type { Deal } from "@/lib/deals";
import type { DealApiResponse } from "./types";
import { formatDealValue, formatDate } from "./utils";
import { DealStatusCell } from "./DealStatusCell";
import { DealTotalCommissionCell } from "./DealTotalCommissionCell";
import { DealAgentCommissionCell } from "./DealAgentCommissionCell";
import { DealActionsCell } from "./DealActionsCell";

interface DealRowProps {
  deal: Deal;
  role: string;
  statuses: Array<{ id: string; name: string }>;
  editingDealId: string | null;
  editingStatus: string;
  isUpdating: boolean;
  filtersLoading: boolean;
  openPopoverId: string | null;
  onEditClick: (deal: Deal) => void;
  onCancelEdit: () => void;
  onStatusChange: (newStatusId: string) => void;
  onViewDeal: (dealId: string) => void;
  onCollectCommissionClick: (deal: Deal) => void;
  onTransferCommissionClick: (deal: Deal) => void;
  onOpenPopoverChange: (dealId: string | null) => void;
}

export function DealRow({
  deal,
  role,
  statuses,
  editingDealId,
  editingStatus,
  isUpdating,
  filtersLoading,
  openPopoverId,
  onEditClick,
  onCancelEdit,
  onStatusChange,
  onViewDeal,
  onCollectCommissionClick,
  onTransferCommissionClick,
  onOpenPopoverChange,
}: DealRowProps) {
  const isEditing = editingDealId === deal.id;
  const dealApi = deal as DealApiResponse;

  return (
    <tr
      className={`border-t border-gray-100 dark:border-gray-700 transition-colors ${
        isEditing
          ? "bg-blue-50 dark:bg-blue-900/20"
          : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
      }`}
    >
      <td className="py-3 px-4">
        <div className="text-sm text-gray-900 dark:text-gray-100 font-medium">
          {deal.dealNumber}
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="text-sm text-gray-900 dark:text-gray-100">
          {formatDate(deal.bookingDate)}
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="text-sm text-gray-900 dark:text-gray-100">
          {deal.project?.name || "N/A"}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          {deal.developer?.name || "N/A"}
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="text-sm text-gray-900 dark:text-gray-100">
          {deal.buyer?.name || "N/A"}
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="text-sm text-gray-900 dark:text-gray-100">
          {deal.seller?.name || "N/A"}
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="text-sm text-gray-900 dark:text-gray-100">
          {deal.agent?.name || "N/A"}
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="text-sm text-gray-900 dark:text-gray-100">
          {formatDealValue(deal)}
        </div>
      </td>
      <td className="py-3 px-4">
        <DealTotalCommissionCell deal={dealApi} />
      </td>
      <td className="py-3 px-4">
        <DealAgentCommissionCell deal={dealApi} />
      </td>
      <td className="py-3 px-4">
        <DealStatusCell
          deal={deal}
          statuses={statuses}
          isEditing={isEditing}
          editingStatus={editingStatus}
          isUpdating={isUpdating}
          filtersLoading={filtersLoading}
          onStatusChange={onStatusChange}
        />
      </td>
      <td className="py-3 px-4">
        <span
          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
            deal.compliance
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          {deal.compliance ? "Yes" : "No"}
        </span>
      </td>
      <td className="py-3 px-4">
        <DealActionsCell
          deal={deal}
          role={role}
          isEditing={isEditing}
          isUpdating={isUpdating}
          openPopoverId={openPopoverId}
          onOpenPopoverChange={onOpenPopoverChange}
          onEditClick={() => onEditClick(deal)}
          onCancelEdit={onCancelEdit}
          onViewDeal={onViewDeal}
          onCollectCommissionClick={() => onCollectCommissionClick(deal)}
          onTransferCommissionClick={() => onTransferCommissionClick(deal)}
        />
      </td>
    </tr>
  );
}
