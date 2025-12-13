"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { mockDeals } from "@/lib/mockData";
import { Button } from "./ui/button";
import { Plus, Search, Filter, Eye, Edit2, Check, X, Loader2, DollarSign, MoreVertical, Send } from "lucide-react";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { toast } from "sonner";
import { CollectCommissionModal } from "./CollectCommissionModal";
import { TransferCommissionModal } from "./TransferCommissionModal";

interface DealsListProps {
  role: string;
  onViewDeal: (dealId: string) => void;
  onNewDeal: () => void;
}

export function DealsList({ role, onViewDeal, onNewDeal }: DealsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingDealId, setEditingDealId] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const [selectedDealForCollection, setSelectedDealForCollection] = useState<any>(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedDealForTransfer, setSelectedDealForTransfer] = useState<any>(null);
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  // Filter deals based on role
  let deals = mockDeals;
  if (role === "agent") {
    deals = mockDeals.filter(d => d.agentName === "Sarah Johnson");
  }

  // Apply search and filters
  const filteredDeals = deals.filter(deal => {
    const matchesSearch = 
      deal.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.developer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || deal.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Closed":
        return "bg-green-600";
      case "Commission Transferred":
      case "Commission Received":
      case "Approved":
        return "bg-blue-600";
      case "Finance Review":
        return "bg-orange-600";
      case "Submitted":
        return "bg-yellow-600";
      default:
        return "bg-gray-600";
    }
  };

  const handleEditClick = (deal: any) => {
    setOpenPopoverId(null); // Close popover
    setEditingDealId(deal.id);
    setEditingStatus(deal.status);
  };

  const handleCancelEdit = () => {
    setEditingDealId(null);
    setEditingStatus("");
  };

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === editingStatus) {
      // No change, just exit edit mode
      handleCancelEdit();
      return;
    }

    // Show loader
    setIsUpdating(true);

    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false);
      setEditingDealId(null);
      setEditingStatus("");
      
      // Show success toast
      toast.success("Status Updated", {
        description: `Deal status changed to "${newStatus}" successfully.`,
        duration: 3000,
      });
    }, 1500);
  };

  const handleCollectCommissionClick = (deal: any) => {
    setOpenPopoverId(null); // Close popover
    setSelectedDealForCollection(deal);
    setIsCollectModalOpen(true);
  };

  const handleCollectModalClose = () => {
    setIsCollectModalOpen(false);
    setSelectedDealForCollection(null);
  };

  const handleConfirmCollection = (paymentMethod: string, amount: string) => {
    // Close modal
    handleCollectModalClose();
    
    // Show success toast
    toast.success("Commission Collected", {
      description: `Successfully collected AED ${parseFloat(amount).toLocaleString()} via ${paymentMethod.replace('-', ' ')}.`,
      duration: 4000,
    });
  };

  const handleTransferCommissionClick = (deal: any) => {
    setOpenPopoverId(null); // Close popover
    setSelectedDealForTransfer(deal);
    setIsTransferModalOpen(true);
  };

  const handleTransferModalClose = () => {
    setIsTransferModalOpen(false);
    setSelectedDealForTransfer(null);
  };

  const handleConfirmTransfer = (recipientType: string, recipientName: string, amount: string) => {
    // Close modal
    handleTransferModalClose();
    
    // Show success toast
    toast.success("Commission Transferred", {
      description: `Successfully transferred AED ${parseFloat(amount).toLocaleString()} to ${recipientName} (${recipientType}).`,
      duration: 4000,
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
          <Button onClick={onNewDeal} className="flex items-center gap-2 gi-bg-dark-green">
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Submitted">Submitted</SelectItem>
                <SelectItem value="Finance Review">Finance Review</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Commission Received">Commission Received</SelectItem>
                <SelectItem value="Commission Transferred">Commission Transferred</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Deals Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle>{filteredDeals.length} Deals Found</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100 rounded-tl-lg">Deal ID</th>
                  <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">Property</th>
                  <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">Buyer</th>
                  <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">Agent</th>
                  <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">Price</th>
                  <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">Commission</th>
                  <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">Status</th>
                  <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100 rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeals.map((deal) => (
                  <tr 
                    key={deal.id} 
                    className={`border-t border-gray-100 dark:border-gray-700 transition-colors ${
                      editingDealId === deal.id ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="text-gray-900 dark:text-gray-100 font-medium">{deal.id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-900 dark:text-gray-100">{deal.project}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{deal.developer}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-900 dark:text-gray-100">{deal.buyerName}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-900 dark:text-gray-100">{deal.agentName}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-900 dark:text-gray-100">AED {deal.sellingPrice.toLocaleString()}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-900 dark:text-gray-100">
                        {deal.agentCommission ? `AED ${deal.agentCommission.toLocaleString()}` : "-"}
                      </div>
                      {deal.commissionStatus && (
                        <div className={`text-white inline-block px-2 py-0.5 rounded text-xs mt-1 ${
                          deal.commissionStatus === "Paid" ? "bg-green-600 dark:bg-green-500" :
                          deal.commissionStatus === "Partially Paid" ? "bg-orange-600 dark:bg-orange-500" :
                          "bg-gray-600 dark:bg-gray-500"
                        }`}>
                          {deal.commissionStatus}
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
                            >
                              <SelectTrigger className="w-[180px] h-8 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Draft">Draft</SelectItem>
                                <SelectItem value="Submitted">Submitted</SelectItem>
                                <SelectItem value="Finance Review">Finance Review</SelectItem>
                                <SelectItem value="Approved">Approved</SelectItem>
                                <SelectItem value="Commission Received">Commission Received</SelectItem>
                                <SelectItem value="Commission Transferred">Commission Transferred</SelectItem>
                                <SelectItem value="Closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      ) : (
                        <span className={`inline-block px-3 py-1 rounded-full text-white text-sm ${getStatusColor(deal.status)}`}>
                          {deal.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {/* Finance role: Show Edit Status inline when editing */}
                        {role === "finance" && editingDealId === deal.id && !isUpdating && (
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
                        {role === "finance" && editingDealId !== deal.id && !isUpdating && (
                          <Popover 
                            open={openPopoverId === deal.id} 
                            onOpenChange={(isOpen) => setOpenPopoverId(isOpen ? deal.id : null)}
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
                            <PopoverContent className="w-56 p-2" align="end">
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
                                {deal.commissionStatus === "Partially Paid" && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleCollectCommissionClick(deal)}
                                    className="justify-start hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/20 dark:hover:text-green-400"
                                  >
                                    <DollarSign className="h-4 w-4 mr-2" />
                                    Collect Commission
                                  </Button>
                                )}
                                {(deal.status === "Commission Received" || deal.status === "Approved") && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleTransferCommissionClick(deal)}
                                    className="justify-start hover:bg-purple-100 hover:text-purple-600 dark:hover:bg-purple-900/20 dark:hover:text-purple-400"
                                  >
                                    <Send className="h-4 w-4 mr-2" />
                                    Transfer Commission
                                  </Button>
                                )}
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
        </CardContent>
      </Card>

      {/* Collect Commission Modal */}
      {isCollectModalOpen && selectedDealForCollection && (
        <CollectCommissionModal
          deal={selectedDealForCollection}
          isOpen={isCollectModalOpen}
          onClose={handleCollectModalClose}
          onConfirm={handleConfirmCollection}
        />
      )}

      {/* Transfer Commission Modal */}
      {isTransferModalOpen && selectedDealForTransfer && (
        <TransferCommissionModal
          deal={selectedDealForTransfer}
          isOpen={isTransferModalOpen}
          onClose={handleTransferModalClose}
          onConfirm={handleConfirmTransfer}
        />
      )}
    </div>
  );
}

