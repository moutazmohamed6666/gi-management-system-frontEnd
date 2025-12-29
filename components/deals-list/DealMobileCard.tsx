import { Card } from "../ui/card";
import type { Deal } from "@/lib/deals";
import type { DealApiResponse } from "./types";
import { formatDealValue } from "./utils";
import { DealStatusCell } from "./DealStatusCell";
import { DealTotalCommissionCell } from "./DealTotalCommissionCell";
import { DealAgentCommissionCell } from "./DealAgentCommissionCell";
import { DealActionsCell } from "./DealActionsCell";

interface DealMobileCardProps {
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

export function DealMobileCard({
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
}: DealMobileCardProps) {
  const isEditing = editingDealId === deal.id;
  const dealApi = deal as DealApiResponse;

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("select") ||
      target.closest("[role='button']") ||
      target.closest(".popover-content") ||
      target.closest("[data-radix-popper-content-wrapper]")
    ) {
      return;
    }
    onViewDeal(deal.id);
  };

  return (
    <Card
      onClick={handleCardClick}
      className={`p-3 border transition-colors cursor-pointer hover:shadow-md ${
        isEditing
          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
          : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
      }`}
    >
      <div className="space-y-3">
        {/* Header: Deal ID and Status */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Deal ID
            </div>
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {deal.dealNumber}
            </div>
          </div>
          <div
            className="flex items-center gap-2 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <DealStatusCell
              deal={deal}
              statuses={statuses}
              isEditing={isEditing}
              editingStatus={editingStatus}
              isUpdating={isUpdating}
              filtersLoading={filtersLoading}
              onStatusChange={onStatusChange}
            />
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
              hideViewButton={true}
            />
          </div>
        </div>

        {/* Property Info */}
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Property
          </div>
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {deal.project?.name || "N/A"}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {deal.developer?.name || "N/A"}
          </div>
        </div>

        {/* Buyer and Seller - Side by side */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Buyer
            </div>
            <div className="text-sm text-gray-900 dark:text-gray-100">
              {deal.buyer?.name || "N/A"}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Seller
            </div>
            <div className="text-sm text-gray-900 dark:text-gray-100">
              {deal.seller?.name || "N/A"}
            </div>
          </div>
        </div>

        {/* Agent */}
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Agent
          </div>
          <div className="text-sm text-gray-900 dark:text-gray-100">
            {deal.agent?.name || "N/A"}
          </div>
        </div>

        {/* Price */}
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Price
          </div>
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {formatDealValue(deal)}
          </div>
        </div>

        {/* Commission Info */}
        <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Total Commission
            </div>
            <DealTotalCommissionCell deal={dealApi} />
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Agent Commission
            </div>
            <DealAgentCommissionCell deal={dealApi} />
          </div>
        </div>

        {/* Compliance */}
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Compliance
          </div>
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
              deal.compliance
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {deal.compliance ? "Yes" : "No"}
          </span>
        </div>

        {/* Actions */}
      </div>
    </Card>
  );
}
