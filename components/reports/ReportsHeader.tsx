"use client";

import { Button } from "../ui/button";
import { Download, FileText, Loader2, RefreshCw } from "lucide-react";
import type { ExportFormat } from "@/lib/reports";

interface ReportsHeaderProps {
  isLoading: boolean;
  isExporting: ExportFormat | null;
  onRefresh: () => void;
  onExport: (format: ExportFormat) => void;
}

export function ReportsHeader({
  isLoading,
  isExporting,
  onRefresh,
  onExport,
}: ReportsHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl gi-bg-dark-green p-4 sm:p-6 lg:p-8 text-white shadow-xl">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl -ml-24 -mb-24"></div>

      <div className="relative z-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          {/* Title section */}
          <div className="min-w-0">
            <p className="text-white/80 text-sm sm:text-base mb-1 sm:mb-2">Business Intelligence</p>
            <h2 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold mb-1">Reports & Analytics</h2>
            <p className="text-white/70 text-sm sm:text-base">
              Generate comprehensive business reports
            </p>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 shrink-0">
            <Button
              variant="outline"
              onClick={onRefresh}
              disabled={isLoading}
              size="sm"
              className="flex items-center gap-1.5 sm:gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm lg:size-default"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => onExport("excel")}
              disabled={isExporting !== null}
              size="sm"
              className="flex items-center gap-1.5 sm:gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm disabled:opacity-50 lg:size-default"
            >
              {isExporting === "excel" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">
                {isExporting === "excel" ? "Exporting..." : "Export Excel"}
              </span>
              <span className="sm:hidden">Excel</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => onExport("pdf")}
              disabled={isExporting !== null}
              size="sm"
              className="flex items-center gap-1.5 sm:gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm disabled:opacity-50 lg:size-default"
            >
              {isExporting === "pdf" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">
                {isExporting === "pdf" ? "Exporting..." : "Export PDF"}
              </span>
              <span className="sm:hidden">PDF</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

