import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import {
  Eye,
  Edit2,
  X,
  MoreVertical,
  DollarSign,
  Send,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import type { Deal } from "@/lib/deals";

interface DealActionsCellProps {
  deal: Deal;
  role: string;
  isEditing: boolean;
  isUpdating: boolean;
  openPopoverId: string | null;
  onOpenPopoverChange: (isOpen: boolean) => void;
  onEditClick: () => void;
  onCancelEdit: () => void;
  onViewDeal: (dealId: string) => void;
  onCollectCommissionClick: () => void;
  onTransferCommissionClick: () => void;
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
}: DealActionsCellProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      {/* Finance role: Show Edit Status inline when editing */}
      {role === "finance" && isEditing && !isUpdating && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancelEdit}
          className="flex items-center gap-1 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
        >
          <X className="h-4 w-4" />
          Cancel
        </Button>
      )}

      {/* Finance role: Show three-dot menu when not editing */}
      {role === "finance" && !isEditing && !isUpdating && (
        <Popover
          open={openPopoverId === deal.id}
          onOpenChange={onOpenPopoverChange}
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
                onClick={onEditClick}
                className="justify-start hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Status
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewDeal(deal.id)}
                className="justify-start hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/20 dark:hover:text-green-400"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onOpenPopoverChange(false);
                  router.push(`/deals/${deal.id}`);
                }}
                className="justify-start hover:bg-amber-100 hover:text-amber-600 dark:hover:bg-amber-900/20 dark:hover:text-amber-400"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Deal
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCollectCommissionClick}
                className="justify-start hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/20 dark:hover:text-green-400"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Collect Commission
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onTransferCommissionClick}
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
      {!isEditing && (
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
  );
}

