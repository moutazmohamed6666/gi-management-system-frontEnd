"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { DollarSign, Send, RefreshCw } from "lucide-react";
import type { CommissionSummary } from "@/lib/commissions";

interface CommissionActionsCardProps {
  commissionSummary: CommissionSummary | null;
  onCollect: () => void;
  onTransfer: () => void;
  onRefresh: () => void;
}

export function CommissionActionsCard({
  commissionSummary,
  onCollect,
  onTransfer,
  onRefresh,
}: CommissionActionsCardProps) {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "Partially Paid":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Commission Actions</span>
          <span
            className={`px-3 py-1 rounded-full text-sm ${getStatusBadgeColor(
              commissionSummary?.status || "Pending"
            )}`}
          >
            {commissionSummary?.status || "Pending"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <Button
            onClick={onCollect}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <DollarSign className="h-4 w-4" />
            Collect Commission
          </Button>
          <Button
            onClick={onTransfer}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            Transfer to Agent/Manager
          </Button>
          <Button
            onClick={onRefresh}
            variant="ghost"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

