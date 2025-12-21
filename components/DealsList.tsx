"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import type { Deal } from "@/lib/deals";
import { dealsApi } from "@/lib/deals";
import { Button } from "./ui/button";
import {
  Plus,
  Search,
  Eye,
  Edit2,
  X,
  Loader2,
  DollarSign,
  MoreVertical,
  Send,
  AlertCircle,
} from "lucide-react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { toast } from "sonner";
import { CollectCommissionModal } from "./CollectCommissionModal";
import { TransferCommissionModal } from "./TransferCommissionModal";
import { useFilters } from "@/lib/useFilters";

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

  const {
    agents,
    developers,
    projects,
    statuses,
    isLoading: filtersLoading,
  } = useFilters();

  const filteredProjects = useMemo(() => {
    if (developerFilter === "all") return projects;
    type ProjectOption = { developerId?: string };
    const byDev = projects.filter((p) => {
      const devId = (p as unknown as ProjectOption).developerId;
      return devId === developerFilter;
    });
    return byDev.length > 0 ? byDev : projects;
  }, [projects, developerFilter]);

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
        const userId = sessionStorage.getItem("userId");
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

        // For agents, always filter by their user ID
        if (role === "agent") {
          if (userId) params.agent_id = userId;
        } else if (agentFilter !== "all") {
          params.agent_id = agentFilter;
        }

        if (developerFilter !== "all") params.developer_id = developerFilter;
        if (projectFilter !== "all") params.project_id = projectFilter;
        if (statusIdFilter !== "all") params.status_id = statusIdFilter;

        const response = await dealsApi.getDeals(params);
        setDeals(Array.isArray(response.data) ? response.data : []);
        setTotal(typeof response.total === "number" ? response.total : 0);
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

  const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages && deals.length === pageSize;

  const getStatusName = (statusId?: string): string => {
    if (!statusId) return "Unknown";
    const status = statuses.find((s) => s.id === statusId);
    return status?.name || statusId;
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("closed") || statusLower.includes("paid")) {
      return "bg-green-600";
    }
    if (
      statusLower.includes("transferred") ||
      statusLower.includes("received") ||
      statusLower.includes("approved")
    ) {
      return "bg-blue-600";
    }
    if (statusLower.includes("finance") || statusLower.includes("partially")) {
      return "bg-orange-600";
    }
    if (statusLower.includes("submitted")) {
      return "bg-yellow-600";
    }
    return "bg-gray-600";
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
      const userId = sessionStorage.getItem("userId");
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

      // Apply filters based on role
      if (role === "agent") {
        if (userId) params.agent_id = userId;
      } else if (agentFilter !== "all") {
        params.agent_id = agentFilter;
      }

      if (developerFilter !== "all") params.developer_id = developerFilter;
      if (projectFilter !== "all") params.project_id = projectFilter;
      if (statusIdFilter !== "all") params.status_id = statusIdFilter;

      const response = await dealsApi.getDeals(params);
      setDeals(Array.isArray(response.data) ? response.data : []);
      setTotal(typeof response.total === "number" ? response.total : 0);

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

  const handleCollectSuccess = (_collection: unknown) => {
    // Close modal
    handleCollectModalClose();

    // Show success toast
    toast.success("Commission Collected", {
      description: "Commission collected successfully.",
      duration: 4000,
    });

    // Refresh deals list
    const userId = sessionStorage.getItem("userId");
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

    if (role === "agent") {
      if (userId) params.agent_id = userId;
    } else if (agentFilter !== "all") {
      params.agent_id = agentFilter;
    }

    if (developerFilter !== "all") params.developer_id = developerFilter;
    if (projectFilter !== "all") params.project_id = projectFilter;
    if (statusIdFilter !== "all") params.status_id = statusIdFilter;

    dealsApi
      .getDeals(params)
      .then((response) => {
        setDeals(Array.isArray(response.data) ? response.data : []);
        setTotal(typeof response.total === "number" ? response.total : 0);
      })
      .catch(() => {
        // Silently fail - user can manually refresh if needed
      });
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

  const handleTransferSuccess = (_transfer: unknown) => {
    // Close modal
    handleTransferModalClose();

    // Show success toast
    toast.success("Commission Transferred", {
      description: "Commission transferred successfully.",
      duration: 4000,
    });

    // Refresh deals list
    const userId = sessionStorage.getItem("userId");
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

    if (role === "agent") {
      if (userId) params.agent_id = userId;
    } else if (agentFilter !== "all") {
      params.agent_id = agentFilter;
    }

    if (developerFilter !== "all") params.developer_id = developerFilter;
    if (projectFilter !== "all") params.project_id = projectFilter;
    if (statusIdFilter !== "all") params.status_id = statusIdFilter;

    dealsApi
      .getDeals(params)
      .then((response) => {
        setDeals(Array.isArray(response.data) ? response.data : []);
        setTotal(typeof response.total === "number" ? response.total : 0);
      })
      .catch(() => {
        // Silently fail - user can manually refresh if needed
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Deals Management</h2>
          <p className="text-gray-600">View and manage all real estate deals</p>
        </div>
        {(role === "agent" || role === "admin") && (
          <Button
            onClick={onNewDeal}
            className="flex items-center gap-2 gi-bg-dark-green"
          >
            <Plus className="h-4 w-4" />
            New Deal
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by ID, buyer, project, or developer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {role !== "agent" && (
              <Select
                value={agentFilter}
                onValueChange={setAgentFilter}
                disabled={filtersLoading}
              >
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="All Agents" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agents</SelectItem>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select
              value={developerFilter}
              onValueChange={(v) => {
                setDeveloperFilter(v);
                setProjectFilter("all");
              }}
              disabled={filtersLoading}
            >
              <SelectTrigger className="w-full md:w-[220px]">
                <SelectValue placeholder="All Developers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Developers</SelectItem>
                {developers.map((dev) => (
                  <SelectItem key={dev.id} value={dev.id}>
                    {dev.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={projectFilter}
              onValueChange={setProjectFilter}
              disabled={filtersLoading}
            >
              <SelectTrigger className="w-full md:w-[240px]">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {filteredProjects.length === 0 ? (
                  <SelectItem value="__no_projects__" disabled>
                    No projects available
                  </SelectItem>
                ) : (
                  filteredProjects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            <Select
              value={statusIdFilter}
              onValueChange={setStatusIdFilter}
              disabled={filtersLoading}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Deal Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Deal Statuses</SelectItem>
                {statuses.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Deals Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle>{deals.length} Deals Found</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-3 text-gray-600 dark:text-gray-400">
                Loading deals...
              </span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <span className="ml-3 text-red-600 dark:text-red-400">
                {error}
              </span>
            </div>
          ) : deals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                No deals found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100 rounded-tl-lg">
                      Deal ID
                    </th>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">
                      Property
                    </th>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">
                      Buyer
                    </th>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">
                      Agent
                    </th>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">
                      Price
                    </th>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">
                      Commission
                    </th>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100 rounded-tr-lg">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {deals.map((deal) => (
                    <tr
                      key={deal.id}
                      className={`border-t border-gray-100 dark:border-gray-700 transition-colors ${
                        editingDealId === deal.id
                          ? "bg-blue-50 dark:bg-blue-900/20"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="text-gray-900 dark:text-gray-100 font-medium">
                          {deal.dealNumber}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-gray-900 dark:text-gray-100">
                          {deal.project?.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {deal.developer?.name || "N/A"}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-gray-900 dark:text-gray-100">
                          {deal.buyer?.name || "N/A"}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-gray-900 dark:text-gray-100">
                          {deal.agent?.name || "N/A"}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-gray-900 dark:text-gray-100">
                          AED {deal.dealValue.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-gray-900 dark:text-gray-100">
                          {deal.commission?.total
                            ? `AED ${deal.commission.total.toLocaleString()}`
                            : "-"}
                        </div>
                        {deal.commission?.status && (
                          <div
                            className={`text-white inline-block px-2 py-0.5 rounded text-xs mt-1 ${
                              deal.commission.status === "Paid"
                                ? "bg-green-600 dark:bg-green-500"
                                : deal.commission.status === "Partially Paid"
                                ? "bg-orange-600 dark:bg-orange-500"
                                : "bg-gray-600 dark:bg-gray-500"
                            }`}
                          >
                            {deal.commission.status}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editingDealId === deal.id ? (
                          <div className="flex items-center gap-2">
                            {isUpdating ? (
                              <div className="flex items-center gap-2 text-blue-600">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-sm">Updating...</span>
                              </div>
                            ) : (
                              <Select
                                value={editingStatus}
                                onValueChange={handleStatusChange}
                                disabled={filtersLoading}
                              >
                                <SelectTrigger className="w-[180px] h-8 text-sm">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  {statuses.length === 0 ? (
                                    <SelectItem value="" disabled>
                                      Loading statuses...
                                    </SelectItem>
                                  ) : (
                                    statuses.map((status) => (
                                      <SelectItem
                                        key={status.id}
                                        value={status.id}
                                      >
                                        {status.name}
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        ) : (
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-white text-sm ${getStatusColor(
                              getStatusName(deal.statusId)
                            )}`}
                          >
                            {getStatusName(deal.statusId)}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {/* Finance role: Show Edit Status inline when editing */}
                          {role === "finance" &&
                            editingDealId === deal.id &&
                            !isUpdating && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCancelEdit}
                                className="flex items-center gap-1 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
                              >
                                <X className="h-4 w-4" />
                                Cancel
                              </Button>
                            )}

                          {/* Finance role: Show three-dot menu when not editing */}
                          {role === "finance" &&
                            editingDealId !== deal.id &&
                            !isUpdating && (
                              <Popover
                                open={openPopoverId === deal.id}
                                onOpenChange={(isOpen) =>
                                  setOpenPopoverId(isOpen ? deal.id : null)
                                }
                              >
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  >
                                    <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-56 p-2"
                                  align="end"
                                >
                                  <div className="flex flex-col gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditClick(deal)}
                                      className="justify-start hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                                    >
                                      <Edit2 className="h-4 w-4 mr-2" />
                                      Edit Status
                                    </Button>
                                    {/* Finance: show all commission actions regardless of current status (TEMP) */}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleCollectCommissionClick(deal)
                                      }
                                      className="justify-start hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/20 dark:hover:text-green-400"
                                    >
                                      <DollarSign className="h-4 w-4 mr-2" />
                                      Collect Commission
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleTransferCommissionClick(deal)
                                      }
                                      className="justify-start hover:bg-purple-100 hover:text-purple-600 dark:hover:bg-purple-900/20 dark:hover:text-purple-400"
                                    >
                                      <Send className="h-4 w-4 mr-2" />
                                      Transfer Commission
                                    </Button>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            )}

                          {/* View button for all roles */}
                          {editingDealId !== deal.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onViewDeal(deal.id)}
                              className="flex items-center gap-1 hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/20 dark:hover:text-green-400"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-6">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {total > 0 ? (
                <>
                  Showing{" "}
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {(page - 1) * pageSize + Math.min(deals.length, 1)}
                  </span>
                  {" - "}
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {(page - 1) * pageSize + deals.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {total}
                  </span>
                </>
              ) : (
                "Showing 0 results"
              )}
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={String(pageSize)}
                onValueChange={(v) => setPageSize(Number(v))}
                disabled={isLoading}
              >
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 / page</SelectItem>
                  <SelectItem value="20">20 / page</SelectItem>
                  <SelectItem value="50">50 / page</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!canPrev || isLoading}
              >
                Prev
              </Button>
              <div className="text-sm text-gray-700 dark:text-gray-300 px-2">
                Page <span className="font-medium">{page}</span> /{" "}
                <span className="font-medium">{totalPages}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={!canNext || isLoading}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

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
