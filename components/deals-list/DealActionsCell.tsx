"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Eye, Edit2, X, MoreVertical, DollarSign, Send } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import type { Deal } from "@/lib/deals";

// Custom hook for mobile/tablet detection (< 1024px = lg breakpoint)
const TABLET_BREAKPOINT = 1024;

function useIsMobileOrTablet() {
  const [isMobileOrTablet, setIsMobileOrTablet] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${TABLET_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobileOrTablet(window.innerWidth < TABLET_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobileOrTablet(window.innerWidth < TABLET_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobileOrTablet;
}

interface DealActionsCellProps {
  deal: Deal;
  role: string;
  isEditing: boolean;
  isUpdating: boolean;
  openPopoverId: string | null;
  onOpenPopoverChange: (dealId: string | null) => void;
  onEditClick: () => void;
  onCancelEdit: () => void;
  onViewDeal: (dealId: string) => void;
  onCollectCommissionClick: () => void;
  onTransferCommissionClick: () => void;
  hideViewButton?: boolean;
}

export function DealActionsCell({
  deal,
  role,
  isEditing,
  isUpdating,
  openPopoverId,
  onOpenPopoverChange,
  onEditClick,
  onCancelEdit,
  onViewDeal,
  onCollectCommissionClick,
  onTransferCommissionClick,
  hideViewButton = false,
}: DealActionsCellProps) {
  const router = useRouter();
  const isMobileOrTablet = useIsMobileOrTablet();
  const isOpen = openPopoverId === deal.id;

  const handleOpenChange = (open: boolean) => {
    onOpenPopoverChange(open ? deal.id : null);
  };

  const handleClose = () => {
    onOpenPopoverChange(null);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Finance role: Show Edit Status inline when editing */}
      {role === "finance" && isEditing && !isUpdating && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancelEdit}
          className="flex items-center gap-1 text-xs sm:text-sm hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
        >
          <X className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Cancel</span>
        </Button>
      )}

      {/* Finance role: Show action menu when not editing */}
      {role === "finance" && !isEditing && !isUpdating && (
        <>
          {isMobileOrTablet ? (
            // Mobile & Tablet: Bottom Sheet Drawer
            <Drawer open={isOpen} onOpenChange={handleOpenChange}>
              <DrawerTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 touch-manipulation"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader className="border-b border-gray-200 dark:border-gray-700">
                  <DrawerTitle>Deal Actions</DrawerTitle>
                </DrawerHeader>
                <div className="p-4 pb-8 flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => {
                      handleClose();
                      onEditClick();
                    }}
                    className="justify-start h-12 text-base hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                  >
                    <Edit2 className="h-5 w-5 mr-3" />
                    Edit Status
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => {
                      handleClose();
                      onViewDeal(deal.id);
                    }}
                    className="justify-start h-12 text-base hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/20 dark:hover:text-green-400"
                  >
                    <Eye className="h-5 w-5 mr-3" />
                    View Details
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => {
                      handleClose();
                      router.push(`/deals/${deal.id}`);
                    }}
                    className="justify-start h-12 text-base hover:bg-amber-100 hover:text-amber-600 dark:hover:bg-amber-900/20 dark:hover:text-amber-400"
                  >
                    <Edit2 className="h-5 w-5 mr-3" />
                    Edit Deal
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => {
                      handleClose();
                      onCollectCommissionClick();
                    }}
                    className="justify-start h-12 text-base hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/20 dark:hover:text-green-400"
                  >
                    <DollarSign className="h-5 w-5 mr-3" />
                    Collect Commission
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => {
                      handleClose();
                      onTransferCommissionClick();
                    }}
                    className="justify-start h-12 text-base hover:bg-purple-100 hover:text-purple-600 dark:hover:bg-purple-900/20 dark:hover:text-purple-400"
                  >
                    <Send className="h-5 w-5 mr-3" />
                    Transfer Commission
                  </Button>
                </div>
              </DrawerContent>
            </Drawer>
          ) : (
            // Desktop: Popover
            <Popover open={isOpen} onOpenChange={handleOpenChange}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-56 p-2 z-50"
                align="end"
                sideOffset={5}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onEditClick}
                    className="justify-start text-sm hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Status
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDeal(deal.id)}
                    className="justify-start text-sm hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/20 dark:hover:text-green-400"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleClose();
                      router.push(`/deals/${deal.id}`);
                    }}
                    className="justify-start text-sm hover:bg-amber-100 hover:text-amber-600 dark:hover:bg-amber-900/20 dark:hover:text-amber-400"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Deal
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCollectCommissionClick}
                    className="justify-start text-sm hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/20 dark:hover:text-green-400"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Collect Commission
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onTransferCommissionClick}
                    className="justify-start text-sm hover:bg-purple-100 hover:text-purple-600 dark:hover:bg-purple-900/20 dark:hover:text-purple-400"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Transfer Commission
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </>
      )}

      {/* View button for all roles - hidden on mobile cards */}
      {!isEditing && !hideViewButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDeal(deal.id)}
          className="flex items-center gap-1 text-xs sm:text-sm hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/20 dark:hover:text-green-400"
        >
          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">View</span>
        </Button>
      )}
    </div>
  );
}
