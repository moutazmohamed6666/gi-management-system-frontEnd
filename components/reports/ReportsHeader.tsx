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
    <div className="relative overflow-hidden rounded-2xl gi-bg-dark-green p-8 text-white shadow-xl">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl -ml-24 -mb-24"></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/80 mb-2">Business Intelligence</p>
            <h2 className="text-white mb-1">Reports & Analytics</h2>
            <p className="text-white/70">
              Generate comprehensive business reports
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={() => onExport("excel")}
              disabled={isExporting !== null}
              className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm disabled:opacity-50"
            >
              {isExporting === "excel" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isExporting === "excel" ? "Exporting..." : "Export Excel"}
            </Button>
            <Button
              variant="outline"
              onClick={() => onExport("pdf")}
              disabled={isExporting !== null}
              className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm disabled:opacity-50"
            >
              {isExporting === "pdf" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              {isExporting === "pdf" ? "Exporting..." : "Export PDF"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

