"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Banknote, DollarSign, ArrowDownLeft, Send, Clock } from "lucide-react";
import type { CollectionItem, TransferItem } from "@/lib/deals";

interface CommissionCollectionSummaryProps {
  // Commission amounts
  expectedCommissions?: number; // Total expected commission
  collectedCommissions?: number; // Total collected amount
  transferredCommissions?: number; // Total transferred amount
  // Collection and transfer history from deal
  collections?: CollectionItem[];
  transfers?: TransferItem[];
  // Control whether to show detailed history tables
  showCollectionHistory?: boolean;
  showTransferHistory?: boolean;
  // Compact mode for inline display
  compact?: boolean;
}

export function CommissionCollectionSummary({
  expectedCommissions = 0,
  collectedCommissions = 0,
  transferredCommissions = 0,
  collections = [],
  transfers = [],
  showCollectionHistory = false,
  showTransferHistory = false,
  compact = false,
}: CommissionCollectionSummaryProps) {
  const formatCurrency = (value: number) => {
    return `AED ${value.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Calculate remaining
  const remainingToCollect = Math.max(0, expectedCommissions - collectedCommissions);

  // Compact inline display
  if (compact) {
    return (
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-gray-600 dark:text-gray-400">Expected:</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            {formatCurrency(expectedCommissions)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ArrowDownLeft className="h-4 w-4 text-green-600 dark:text-green-400" />
          <span className="text-gray-600 dark:text-gray-400">Collected:</span>
          <span className="font-semibold text-green-600 dark:text-green-400">
            {formatCurrency(collectedCommissions)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Send className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          <span className="text-gray-600 dark:text-gray-400">Transferred:</span>
          <span className="font-semibold text-purple-600 dark:text-purple-400">
            {formatCurrency(transferredCommissions)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <Card className="border-2 border-emerald-200 dark:border-emerald-800">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Banknote className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          Commission Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Expected Commission */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-gray-800 rounded-lg border-2 border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Total Expected
              </span>
            </div>
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(expectedCommissions)}
            </div>
          </div>

          {/* Commission Collected */}
          <div className="p-4 bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-gray-800 rounded-lg border-2 border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <ArrowDownLeft className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Total Collected
              </span>
            </div>
            <div className="text-xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(collectedCommissions)}
            </div>
          </div>

          {/* Commission Transferred */}
          <div className="p-4 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-gray-800 rounded-lg border-2 border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <Send className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Total Transferred
              </span>
            </div>
            <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
              {formatCurrency(transferredCommissions)}
            </div>
          </div>

          {/* Remaining */}
          <div className="p-4 bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-gray-800 rounded-lg border-2 border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Remaining
              </span>
            </div>
            <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
              {formatCurrency(remainingToCollect)}
            </div>
          </div>
        </div>

        {/* Collection History Table */}
        {showCollectionHistory && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <ArrowDownLeft className="h-4 w-4" />
              Collection History
            </h4>
            {collections.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No collections recorded yet
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="text-left py-2 px-3 font-medium">Date</th>
                      <th className="text-left py-2 px-3 font-medium">Source</th>
                      <th className="text-left py-2 px-3 font-medium">Method</th>
                      <th className="text-right py-2 px-3 font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {collections.map((collection) => (
                      <tr key={collection.id} className="border-t border-gray-100 dark:border-gray-700">
                        <td className="py-2 px-3">{formatDate(collection.collectionDate)}</td>
                        <td className="py-2 px-3">{collection.source?.name || "-"}</td>
                        <td className="py-2 px-3">{collection.collectionType?.name || "-"}</td>
                        <td className="py-2 px-3 text-right font-medium text-green-600 dark:text-green-400">
                          {formatCurrency(collection.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Transfer History Table */}
        {showTransferHistory && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Send className="h-4 w-4" />
              Transfer History
            </h4>
            {transfers.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No transfers recorded yet
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="text-left py-2 px-3 font-medium">Date</th>
                      <th className="text-left py-2 px-3 font-medium">Recipient</th>
                      <th className="text-left py-2 px-3 font-medium">Type</th>
                      <th className="text-left py-2 px-3 font-medium">Status</th>
                      <th className="text-right py-2 px-3 font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transfers.map((transfer) => (
                      <tr key={transfer.id} className="border-t border-gray-100 dark:border-gray-700">
                        <td className="py-2 px-3">{formatDate(transfer.initiatedAt)}</td>
                        <td className="py-2 px-3">{transfer.toUser?.name || transfer.toAccount || "-"}</td>
                        <td className="py-2 px-3">{transfer.transferType?.name || "-"}</td>
                        <td className="py-2 px-3">
                          <Badge
                            variant={transfer.status?.name === "Completed" ? "default" : "outline"}
                            className={transfer.status?.name === "Completed" ? "bg-green-600" : ""}
                          >
                            {transfer.status?.name || "Pending"}
                          </Badge>
                        </td>
                        <td className="py-2 px-3 text-right font-medium text-purple-600 dark:text-purple-400">
                          {formatCurrency(transfer.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
