"use client";

import { Loader2 } from "lucide-react";

export function ReportsLoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      <span className="ml-3 text-gray-600 dark:text-gray-400">
        Loading report data...
      </span>
    </div>
  );
}

