"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import type { Deal } from "@/lib/deals";
import { DealRow } from "./DealRow";
import { DealsPagination } from "./DealsPagination";
import { useFilters } from "@/lib/useFilters";
import { DealMobileCard } from "./DealMobileCard";
import { useIsMobileOrTablet } from "@/lib/useIsMobileOrTablet";

interface DealsTableProps {
  deals: Deal[];
  role: string;
  total: number;
  page: number;
  pageSize: number;
  isLoading: boolean;
  error: string | null;
  editingDealId: string | null;
  editingStatus: string;
  isUpdating: boolean;
  openPopoverId: string | null;
  onEditClick: (deal: Deal) => void;
  onCancelEdit: () => void;
  onStatusChange: (newStatusId: string) => void;
  onViewDeal: (dealId: string) => void;
  onCollectCommissionClick: (deal: Deal) => void;
  onTransferCommissionClick: (deal: Deal) => void;
  onOpenPopoverChange: (dealId: string | null) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function DealsTable({
  deals,
  role,
  total,
  page,
  pageSize,
  isLoading,
  error,
  editingDealId,
  editingStatus,
  isUpdating,
  openPopoverId,
  onEditClick,
  onCancelEdit,
  onStatusChange,
  onViewDeal,
  onCollectCommissionClick,
  onTransferCommissionClick,
  onOpenPopoverChange,
  onPageChange,
  onPageSizeChange,
}: DealsTableProps) {
  const { statuses, isLoading: filtersLoading } = useFilters();
  const isMobileView = useIsMobileOrTablet();

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-base sm:text-lg">
          {deals.length} Deals Found
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-gray-400" />
            <span className="ml-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Loading deals...
            </span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
            <span className="ml-3 text-sm sm:text-base text-red-600 dark:text-red-400">
              {error}
            </span>
          </div>
        ) : deals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              No deals found.
            </p>
          </div>
        ) : (
          <>
            {isMobileView ? (
              <div className="space-y-3">
                {deals.map((deal) => (
                  <DealMobileCard
                    key={deal.id}
                    deal={deal}
                    role={role}
                    statuses={statuses}
                    editingDealId={editingDealId}
                    editingStatus={editingStatus}
                    isUpdating={isUpdating}
                    filtersLoading={filtersLoading}
                    openPopoverId={openPopoverId}
                    onEditClick={onEditClick}
                    onCancelEdit={onCancelEdit}
                    onStatusChange={onStatusChange}
                    onViewDeal={onViewDeal}
                    onCollectCommissionClick={onCollectCommissionClick}
                    onTransferCommissionClick={onTransferCommissionClick}
                    onOpenPopoverChange={onOpenPopoverChange}
                  />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100 rounded-tl-lg">
                        Deal ID
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Booking Date
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Property
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Buyer
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Seller
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Agent
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Price
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Commission
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Agent Commission
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Compliance
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100 rounded-tr-lg">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {deals.map((deal) => (
                      <DealRow
                        key={deal.id}
                        deal={deal}
                        role={role}
                        statuses={statuses}
                        editingDealId={editingDealId}
                        editingStatus={editingStatus}
                        isUpdating={isUpdating}
                        filtersLoading={filtersLoading}
                        openPopoverId={openPopoverId}
                        onEditClick={onEditClick}
                        onCancelEdit={onCancelEdit}
                        onStatusChange={onStatusChange}
                        onViewDeal={onViewDeal}
                        onCollectCommissionClick={onCollectCommissionClick}
                        onTransferCommissionClick={onTransferCommissionClick}
                        onOpenPopoverChange={onOpenPopoverChange}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <DealsPagination
              total={total}
              page={page}
              pageSize={pageSize}
              dealsLength={deals.length}
              isLoading={isLoading}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
