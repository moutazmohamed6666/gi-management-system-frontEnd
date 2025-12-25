"use client";

import { Button } from "../ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ReportsErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function ReportsErrorState({
  error,
  onRetry,
}: ReportsErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-red-50 dark:bg-red-900/20 rounded-lg">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
      <Button onClick={onRetry} variant="outline">
        <RefreshCw className="h-4 w-4 mr-2" />
        Try Again
      </Button>
    </div>
  );
}

