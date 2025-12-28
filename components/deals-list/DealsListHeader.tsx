import { Button } from "../ui/button";
import { Plus } from "lucide-react";

interface DealsListHeaderProps {
  role: string;
  onNewDeal: () => void;
}

export function DealsListHeader({ role, onNewDeal }: DealsListHeaderProps) {
  return (
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
  );
}

