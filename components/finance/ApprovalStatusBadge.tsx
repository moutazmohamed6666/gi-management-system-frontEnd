"use client";

import { CheckCircle } from "lucide-react";

export function ApprovalStatusBadge() {
  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
      <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
        <CheckCircle className="h-5 w-5" />
        <span className="font-medium">
          Deal Overview Approved - Finance fields are now editable
        </span>
      </div>
    </div>
  );
}

