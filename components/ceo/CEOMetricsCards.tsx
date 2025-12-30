import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  Users,
  Building2,
  DollarSign,
  Target,
  Award,
  ArrowUpRight,
} from "lucide-react";
import type { CEOMetricsResponse } from "@/lib/finance";

interface CEOMetricsCardsProps {
  ceoMetrics: CEOMetricsResponse | null;
  totalPipeline: number;
  closedDeals: number;
  totalRevenue: number;
  avgDealSize: number;
  activeAgents: number;
  activeDevelopers: number;
}

export function CEOMetricsCards({
  ceoMetrics,
  totalPipeline,
  closedDeals,
  totalRevenue,
  avgDealSize,
  activeAgents,
  activeDevelopers,
}: CEOMetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
      {/* Total Pipeline */}
      <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-linear-to-br from-blue-50 to-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm text-gray-700">
            Total Pipeline
          </CardTitle>
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl text-gray-900">
              {ceoMetrics?.total_pipeline?.currency || "AED"}{" "}
              {totalPipeline.toLocaleString()}
            </div>
            {ceoMetrics?.total_pipeline?.trend !== undefined && (
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <ArrowUpRight className="h-4 w-4" />
                <span>{ceoMetrics.total_pipeline.trend}%</span>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {ceoMetrics?.total_pipeline?.label || "Active deals"}
          </p>
        </CardContent>
      </Card>

      {/* Closed Deals */}
      <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-linear-to-br from-green-50 to-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm text-gray-700">Closed Deals</CardTitle>
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
            <Target className="h-5 w-5 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl text-gray-900">{closedDeals}</div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {ceoMetrics?.closed_deals?.period || "This quarter"}
          </p>
        </CardContent>
      </Card>

      {/* Total Revenue */}
      <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-linear-to-br from-emerald-50 to-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm text-gray-700">Total Revenue</CardTitle>
          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-emerald-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl text-gray-900">
              {ceoMetrics?.total_revenue?.currency || "AED"}{" "}
              {totalRevenue.toLocaleString()}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {ceoMetrics?.total_revenue?.label || "Commission earned"}
          </p>
        </CardContent>
      </Card>

      {/* Avg Deal Size */}
      <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-linear-to-br from-purple-50 to-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm text-gray-700">Avg Deal Size</CardTitle>
          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
            <Award className="h-5 w-5 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl text-gray-900">
              {ceoMetrics?.avg_deal_size?.currency || "AED"}{" "}
              {avgDealSize.toLocaleString()}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {ceoMetrics?.avg_deal_size?.label || "Per transaction"}
          </p>
        </CardContent>
      </Card>

      {/* Active Agents */}
      <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-linear-to-br from-cyan-50 to-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm text-gray-700">Active Agents</CardTitle>
          <div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center">
            <Users className="h-5 w-5 text-cyan-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl text-gray-900">{activeAgents}</div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {ceoMetrics?.active_agents?.label || "Producing"}
          </p>
        </CardContent>
      </Card>

      {/* Developers */}
      <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-linear-to-br from-orange-50 to-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm text-gray-700">Developers</CardTitle>
          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-orange-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl text-gray-900">{activeDevelopers}</div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {ceoMetrics?.developers?.label || "Active partnerships"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
