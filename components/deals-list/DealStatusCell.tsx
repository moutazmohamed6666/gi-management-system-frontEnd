import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { getStatusName, getStatusColor } from "./utils";
import type { Deal } from "@/lib/deals";
import type { DealApiResponse } from "./types";

interface DealStatusCellProps {
  deal: Deal;
  statuses: Array<{ id: string; name: string }>;
  isEditing: boolean;
  editingStatus: string;
  isUpdating: boolean;
  filtersLoading: boolean;
  onStatusChange: (newStatusId: string) => void;
}

export function DealStatusCell({
  deal,
  statuses,
  isEditing,
  editingStatus,
  isUpdating,
  filtersLoading,
  onStatusChange,
}: DealStatusCellProps) {
  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        {isUpdating ? (
          <div className="flex items-center gap-2 text-blue-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Updating...</span>
          </div>
        ) : (
          <Select
            value={editingStatus}
            onValueChange={onStatusChange}
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
                  <SelectItem key={status.id} value={status.id}>
                    {status.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        )}
      </div>
    );
  }

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-white text-sm ${getStatusColor(
        getStatusName(deal, statuses)
      )}`}
    >
      {getStatusName(deal, statuses)}
    </span>
  );
}

