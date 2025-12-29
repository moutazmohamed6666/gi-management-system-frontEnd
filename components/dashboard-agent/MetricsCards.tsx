"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  DollarSign,
  Home,
  Building2,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import type { AgentMetricsResponse, AgentMyPerformanceResponse } from "@/lib/finance";
import type { Deal } from "@/lib/deals";

interface MetricsCardsProps {
  agentMetrics: AgentMetricsResponse;
  commissionPaid: number;
  commissionUnpaid: number;
  developersClosed: number;
}

export function MetricsCards({
  agentMetrics,
  commissionPaid,
  commissionUnpaid,
  developersClosed,
}: MetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Units Sold */}
      <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-linear-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm text-gray-700 dark:text-gray-300">
            Units Sold
          </CardTitle>
          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
            <Home className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl text-gray-900 dark:text-gray-100">
              {agentMetrics.units_sold.value}
            </div>
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
              <ArrowUpRight className="h-4 w-4" />
              <span>
                {agentMetrics.units_sold.trend >= 0 ? "+" : ""}
                {agentMetrics.units_sold.trend}%
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {agentMetrics.units_sold.period}
          </p>
        </CardContent>
      </Card>

      {/* Total Commission */}
      <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-linear-to-br from-green-50 to-white dark:from-green-950/30 dark:to-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm text-gray-700 dark:text-gray-300">
            Total Commission
          </CardTitle>
          <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl text-gray-900 dark:text-gray-100">
              {agentMetrics.total_commission.value}
              {agentMetrics.total_commission.currency}{" "}
            </div>
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
              <ArrowUpRight className="h-4 w-4" />
              <span>
                {agentMetrics.total_commission.trend >= 0 ? "+" : ""}
                {agentMetrics.total_commission.trend}%
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {agentMetrics.total_commission.status}
          </p>
        </CardContent>
      </Card>

      {/* Commission Paid */}
      <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-linear-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm text-gray-700 dark:text-gray-300">
            Paid
          </CardTitle>
          <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl text-gray-900 dark:text-gray-100">
              AED {commissionPaid}
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Received
          </p>
        </CardContent>
      </Card>

      {/* Pending Payment */}
      <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-linear-to-br from-orange-50 to-white dark:from-orange-950/30 dark:to-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm text-gray-700 dark:text-gray-300">
            Pending
          </CardTitle>
          <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
            <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl text-gray-900 dark:text-gray-100">
              AED {`${commissionUnpaid}`}
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Awaiting
          </p>
        </CardContent>
      </Card>

      {/* Developers */}
      <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-linear-to-br from-purple-50 to-white dark:from-purple-950/30 dark:to-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm text-gray-700 dark:text-gray-300">
            Developers
          </CardTitle>
          <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl text-gray-900 dark:text-gray-100">
              {developersClosed}
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Partners
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

