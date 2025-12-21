import { TrendingUp } from "lucide-react";
import type { CEOMetricsResponse } from "@/lib/finance";

interface CEOHeaderProps {
  ceoMetrics: CEOMetricsResponse | null;
}

export function CEOHeader({ ceoMetrics }: CEOHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl gi-bg-dark-green p-8 text-white shadow-xl">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl -ml-24 -mb-24"></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/80 mb-2">Executive Overview</p>
            <h2 className="text-white mb-1">Business Intelligence</h2>
            <p className="text-white/70">Real-time performance metrics</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
            <p className="text-white/80 text-sm">
              {ceoMetrics?.executive_overview?.period || "This Quarter"}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <TrendingUp className="h-5 w-5 text-white" />
              <span className="text-white">
                {ceoMetrics?.executive_overview?.quarter_trend || "+32%"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

