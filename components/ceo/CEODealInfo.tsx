"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import type { Deal } from "@/lib/deals";

interface CEODealInfoProps {
  deal: Deal;
}

export function CEODealInfo({ deal }: CEODealInfoProps) {
  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (value: string | number | undefined | null) => {
    if (!value) return "-";
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(numValue)) return "-";
    return `AED ${numValue.toLocaleString()}`;
  };

  // Get deal value from either dealValue or deal.dealValue
  const dealValue = deal.dealValue;
  
  // Get status name from nested status object or fallback to statusId
  const statusName = deal.status?.name || deal.statusId || "-";
  
  // Get purchase status name
  const purchaseStatusName = deal.purchaseStatus?.name || "-";
  
  // Get deal type name
  const dealTypeName = deal.dealType?.name || "-";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Deal Number
            </div>
            <div className="text-base text-gray-900 dark:text-white font-medium">
              {deal.dealNumber || "-"}
            </div>
          </div>
          <div className="md:col-span-2 lg:col-span-1">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-semibold">
              Deal Value
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-4 py-3 rounded-lg border-2 border-blue-200 dark:border-blue-800">
              {formatCurrency(dealValue)}
            </div>
          </div>
          <div className="md:col-span-1 lg:col-span-1">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Number of Deals
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="default"
                className="text-lg px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                {deal.numberOfDeal || 1}
              </Badge>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {deal.numberOfDeal === 1 ? "deal" : "deals"}
              </span>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Status
            </div>
            <div className="text-base text-gray-900 dark:text-white font-medium">
              <Badge variant="outline">{statusName}</Badge>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Purchase Status
            </div>
            <div className="text-base text-gray-900 dark:text-white font-medium">
              <Badge variant="secondary">{purchaseStatusName}</Badge>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Deal Type
            </div>
            <div className="text-base text-gray-900 dark:text-white font-medium">
              {dealTypeName}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Downpayment
            </div>
            <div className="text-base text-gray-900 dark:text-white font-medium">
              {formatCurrency(deal.downpayment)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Close Date
            </div>
            <div className="text-base text-gray-900 dark:text-white font-medium">
              {formatDate(deal.closeDate)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Booking Date
            </div>
            <div className="text-base text-gray-900 dark:text-white font-medium">
              {formatDate(deal.bookingDate)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              CF Expiry
            </div>
            <div className="text-base text-gray-900 dark:text-white font-medium">
              {formatDate(deal.cfExpiry)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Created At
            </div>
            <div className="text-base text-gray-900 dark:text-white font-medium">
              {formatDate(deal.createdAt)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

