"use client";

import { useState, useEffect } from "react";
import type { Deal } from "@/lib/deals";
import { dealsApi } from "@/lib/deals";
import { toast } from "sonner";
import { CollectCommissionModal } from "./CollectCommissionModal";
import { TransferCommissionModal } from "./TransferCommissionModal";
import { useFilters } from "@/lib/useFilters";
import { DealsListHeader } from "./deals-list/DealsListHeader";
import { DealsFilters } from "./deals-list/DealsFilters";
import { DealsTable } from "./deals-list/DealsTable";

interface DealsListProps {
  role: string;
  onViewDeal: (dealId: string) => void;
  onNewDeal: () => void;
}

export function DealsList({ role, onViewDeal, onNewDeal }: DealsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusIdFilter, setStatusIdFilter] = useState<string>("all");
  const [agentFilter, setAgentFilter] = useState<string>("all");
  const [developerFilter, setDeveloperFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [editingDealId, setEditingDealId] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const [selectedDealForCollection, setSelectedDealForCollection] =
    useState<Deal | null>(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedDealForTransfer, setSelectedDealForTransfer] =
    useState<Deal | null>(null);
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { statuses } = useFilters();

  // Reset to first page on filter changes
  useEffect(() => {
    setPage(1);
  }, [
    searchTerm,
    statusIdFilter,
    agentFilter,
    developerFilter,
    projectFilter,
    pageSize,
  ]);

  // Fetch deals from API
  useEffect(() => {
    const fetchDeals = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // For agents, use the dedicated agent deals endpoint
        if (role === "agent") {
          const params: {
            search?: string;
            status_id?: string;
            developer_id?: string;
            project_id?: string;
            page: number;
            page_size: number;
          } = {
            search: searchTerm || undefined,
            page,
            page_size: pageSize,
          };

          if (statusIdFilter !== "all") params.status_id = statusIdFilter;
          if (developerFilter !== "all") params.developer_id = developerFilter;
          if (projectFilter !== "all") params.project_id = projectFilter;

          const response = await dealsApi.getAgentDeals(params);
          setDeals(Array.isArray(response.data) ? response.data : []);
          setTotal(typeof response.total === "number" ? response.total : 0);
        } else {
          // For other roles, use the standard deals endpoint with filters
          const params: {
            search?: string;
            agent_id?: string;
            developer_id?: string;
            project_id?: string;
            status_id?: string;
            page: number;
            page_size: number;
          } = {
            search: searchTerm || undefined,
            page,
            page_size: pageSize,
          };

          if (agentFilter !== "all") {
            params.agent_id = agentFilter;
          }

          if (developerFilter !== "all") params.developer_id = developerFilter;
          if (projectFilter !== "all") params.project_id = projectFilter;
          if (statusIdFilter !== "all") params.status_id = statusIdFilter;

          const response = await dealsApi.getDeals(params);
          setDeals(Array.isArray(response.data) ? response.data : []);
          setTotal(typeof response.total === "number" ? response.total : 0);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load deals";
        setError(errorMessage);
        toast.error("Error loading deals", {
          description:
            errorMessage || "Failed to fetch deals. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(
      () => {
        fetchDeals();
      },
      searchTerm ? 500 : 0
    );

    return () => clearTimeout(timeoutId);
  }, [
    searchTerm,
    role,
    page,
    pageSize,
    agentFilter,
    developerFilter,
    projectFilter,
    statusIdFilter,
  ]);

  // Helper function to refresh deals list
  const refreshDeals = async () => {
    try {
      if (role === "agent") {
        const params: {
          search?: string;
          status_id?: string;
          developer_id?: string;
          project_id?: string;
          page: number;
          page_size: number;
        } = {
          search: searchTerm || undefined,
          page,
          page_size: pageSize,
        };

        if (statusIdFilter !== "all") params.status_id = statusIdFilter;
        if (developerFilter !== "all") params.developer_id = developerFilter;
        if (projectFilter !== "all") params.project_id = projectFilter;

        const response = await dealsApi.getAgentDeals(params);
        setDeals(Array.isArray(response.data) ? response.data : []);
        setTotal(typeof response.total === "number" ? response.total : 0);
      } else {
        const params: {
          search?: string;
          agent_id?: string;
          developer_id?: string;
          project_id?: string;
          status_id?: string;
          page: number;
          page_size: number;
        } = {
          search: searchTerm || undefined,
          page,
          page_size: pageSize,
        };

        if (agentFilter !== "all") {
          params.agent_id = agentFilter;
        }

        if (developerFilter !== "all") params.developer_id = developerFilter;
        if (projectFilter !== "all") params.project_id = projectFilter;
        if (statusIdFilter !== "all") params.status_id = statusIdFilter;

        const response = await dealsApi.getDeals(params);
        setDeals(Array.isArray(response.data) ? response.data : []);
        setTotal(typeof response.total === "number" ? response.total : 0);
      }
    } catch (err) {
      // Silently fail - user can manually refresh if needed
      console.error("Failed to refresh deals:", err);
    }
  };

  const handleEditClick = (deal: Deal) => {
    setOpenPopoverId(null); // Close popover
    setEditingDealId(deal.id);
    // Use statusId from deal, or find matching status from filters
    setEditingStatus(deal.statusId || "");
  };

  const handleCancelEdit = () => {
    setEditingDealId(null);
    setEditingStatus("");
  };

  const handleStatusChange = async (newStatusId: string) => {
    if (newStatusId === editingStatus || !editingDealId) {
      // No change, just exit edit mode
      handleCancelEdit();
      return;
    }

    // Show loader
    setIsUpdating(true);

    try {
      // Call API to update deal status
      await dealsApi.updateDealStatus(editingDealId, newStatusId);

      // Find the status name for the toast message
      const statusName =
        statuses.find((s) => s.id === newStatusId)?.name || "Unknown";

      // Refresh deals list to get updated data
      await refreshDeals();

      setIsUpdating(false);
      setEditingDealId(null);
      setEditingStatus("");

      // Show success toast
      toast.success("Status Updated", {
        description: `Deal status changed to "${statusName}" successfully.`,
        duration: 3000,
      });
    } catch (err) {
      setIsUpdating(false);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Could not update deal status. Please try again.";
      toast.error("Failed to update status", {
        description: errorMessage,
      });
    }
  };

  const handleCollectCommissionClick = (deal: Deal) => {
    setOpenPopoverId(null); // Close popover
    setSelectedDealForCollection(deal);
    setIsCollectModalOpen(true);
  };

  const handleCollectModalClose = () => {
    setIsCollectModalOpen(false);
    setSelectedDealForCollection(null);
  };

  const handleCollectSuccess = () => {
    // Close modal
    handleCollectModalClose();

    // Show success toast
    toast.success("Commission Collected", {
      description: "Commission collected successfully.",
      duration: 4000,
    });

    // Refresh deals list
    refreshDeals();
  };

  const handleTransferCommissionClick = (deal: Deal) => {
    setOpenPopoverId(null); // Close popover
    setSelectedDealForTransfer(deal);
    setIsTransferModalOpen(true);
  };

  const handleTransferModalClose = () => {
    setIsTransferModalOpen(false);
    setSelectedDealForTransfer(null);
  };

  const handleTransferSuccess = () => {
    // Close modal
    handleTransferModalClose();

    // Show success toast
    toast.success("Commission Transferred", {
      description: "Commission transferred successfully.",
      duration: 4000,
    });

    // Refresh deals list
    refreshDeals();
  };

  return (
    <div className="space-y-6">
      <DealsListHeader role={role} onNewDeal={onNewDeal} />

      <DealsFilters
        role={role}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        agentFilter={agentFilter}
        onAgentFilterChange={setAgentFilter}
        developerFilter={developerFilter}
        onDeveloperFilterChange={setDeveloperFilter}
        projectFilter={projectFilter}
        onProjectFilterChange={setProjectFilter}
        statusIdFilter={statusIdFilter}
        onStatusIdFilterChange={setStatusIdFilter}
      />

      <DealsTable
        deals={deals}
        role={role}
        total={total}
        page={page}
        pageSize={pageSize}
        isLoading={isLoading}
        error={error}
        editingDealId={editingDealId}
        editingStatus={editingStatus}
        isUpdating={isUpdating}
        openPopoverId={openPopoverId}
        onEditClick={handleEditClick}
        onCancelEdit={handleCancelEdit}
        onStatusChange={handleStatusChange}
        onViewDeal={onViewDeal}
        onCollectCommissionClick={handleCollectCommissionClick}
        onTransferCommissionClick={handleTransferCommissionClick}
        onOpenPopoverChange={setOpenPopoverId}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      {/* Collect Commission Modal */}
      {isCollectModalOpen && selectedDealForCollection && (
        <CollectCommissionModal
          deal={selectedDealForCollection}
          isOpen={isCollectModalOpen}
          onClose={handleCollectModalClose}
          onSuccess={handleCollectSuccess}
        />
      )}

      {/* Transfer Commission Modal */}
      {isTransferModalOpen && selectedDealForTransfer && (
        <TransferCommissionModal
          deal={selectedDealForTransfer}
          isOpen={isTransferModalOpen}
          onClose={handleTransferModalClose}
          onSuccess={handleTransferSuccess}
        />
      )}
    </div>
  );
}
