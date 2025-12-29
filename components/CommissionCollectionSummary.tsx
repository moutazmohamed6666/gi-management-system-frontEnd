"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Loader2, Banknote, Send, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { commissionsApi, type DealCollection, type DealTransfer } from "@/lib/commissions";

interface CommissionCollectionSummaryProps {
  dealId: string;
  // Optional: Pass deal data for calculating totals without additional API calls
  collectedCommissions?: number; // From deal.collected_commissions
  transferredCommissions?: number; // From deal.agentCommissions?.totalPaid
  // Control whether to show detailed history tables
  showCollectionHistory?: boolean;
  showTransferHistory?: boolean;
  // Compact mode for inline display
  compact?: boolean;
}

export function CommissionCollectionSummary({
  dealId,
  collectedCommissions,
  transferredCommissions,
  showCollectionHistory = false,
  showTransferHistory = false,
  compact = false,
}: CommissionCollectionSummaryProps) {
  const [collections, setCollections] = useState<DealCollection[]>([]);
  const [transfers, setTransfers] = useState<DealTransfer[]>([]);
  const [isLoadingCollections, setIsLoadingCollections] = useState(showCollectionHistory);
  const [isLoadingTransfers, setIsLoadingTransfers] = useState(showTransferHistory);
  const [totalCollected, setTotalCollected] = useState(collectedCommissions ?? 0);
  const [totalTransferred, setTotalTransferred] = useState(transferredCommissions ?? 0);

  // Fetch collection history if needed
  useEffect(() => {
    if (showCollectionHistory && dealId) {
      const fetchCollections = async () => {
        setIsLoadingCollections(true);
        try {
          const data = await commissionsApi.getDealCollections(dealId);
          setCollections(data);
          // Calculate total from collections if not provided
          if (collectedCommissions === undefined) {
            const total = data.reduce((sum, c) => sum + parseFloat(c.amount || "0"), 0);
            setTotalCollected(total);
          }
        } catch (err) {
          console.error("Error fetching collections:", err);
        } finally {
          setIsLoadingCollections(false);
        }
      };
      fetchCollections();
    }
  }, [dealId, showCollectionHistory, collectedCommissions]);

  // Fetch transfer history if needed
  useEffect(() => {
    if (showTransferHistory && dealId) {
      const fetchTransfers = async () => {
        setIsLoadingTransfers(true);
        try {
          const data = await commissionsApi.getDealTransfers(dealId);
          setTransfers(data);
          // Calculate total from transfers if not provided
          if (transferredCommissions === undefined) {
            const total = data.reduce((sum, t) => sum + parseFloat(t.amount || "0"), 0);
            setTotalTransferred(total);
          }
        } catch (err) {
          console.error("Error fetching transfers:", err);
        } finally {
          setIsLoadingTransfers(false);
        }
      };
      fetchTransfers();
    }
  }, [dealId, showTransferHistory, transferredCommissions]);

  // Update totals when props change
  useEffect(() => {
    if (collectedCommissions !== undefined) {
      setTotalCollected(collectedCommissions);
    }
  }, [collectedCommissions]);

  useEffect(() => {
    if (transferredCommissions !== undefined) {
      setTotalTransferred(transferredCommissions);
    }
  }, [transferredCommissions]);

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

  // Compact inline display
  if (compact) {
    return (
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <ArrowDownLeft className="h-4 w-4 text-green-600 dark:text-green-400" />
          <span className="text-gray-600 dark:text-gray-400">Collected:</span>
          <span className="font-semibold text-green-600 dark:text-green-400">
            {formatCurrency(totalCollected)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpRight className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          <span className="text-gray-600 dark:text-gray-400">Transferred:</span>
          <span className="font-semibold text-purple-600 dark:text-purple-400">
            {formatCurrency(totalTransferred)}
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
          Commission Collection & Transfer Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Commission Collected */}
          <div className="p-4 bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-gray-800 rounded-lg border-2 border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ArrowDownLeft className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Commission Collected
                </span>
              </div>
              <Badge variant="default" className="bg-green-600">
                Received
              </Badge>
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(totalCollected)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              From developer/buyer/seller
            </p>
          </div>

          {/* Commission Transferred */}
          <div className="p-4 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-gray-800 rounded-lg border-2 border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Send className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Commission Transferred
                </span>
              </div>
              <Badge variant="outline" className="border-purple-600 text-purple-600">
                Paid Out
              </Badge>
            </div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {formatCurrency(totalTransferred)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              To agents/managers
            </p>
          </div>
        </div>

        {/* Collection History Table */}
        {showCollectionHistory && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <ArrowDownLeft className="h-4 w-4" />
              Collection History
            </h4>
            {isLoadingCollections ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">Loading collections...</span>
              </div>
            ) : collections.length === 0 ? (
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
                          {formatCurrency(parseFloat(collection.amount))}
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
              <ArrowUpRight className="h-4 w-4" />
              Transfer History
            </h4>
            {isLoadingTransfers ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">Loading transfers...</span>
              </div>
            ) : transfers.length === 0 ? (
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
                        <td className="py-2 px-3">{formatDate(transfer.transferDate)}</td>
                        <td className="py-2 px-3">{transfer.recipient?.name || transfer.recipientName || "-"}</td>
                        <td className="py-2 px-3">{transfer.transferType?.name || "-"}</td>
                        <td className="py-2 px-3">
                          <Badge
                            variant={transfer.status === "completed" ? "default" : "outline"}
                            className={transfer.status === "completed" ? "bg-green-600" : ""}
                          >
                            {transfer.status}
                          </Badge>
                        </td>
                        <td className="py-2 px-3 text-right font-medium text-purple-600 dark:text-purple-400">
                          {formatCurrency(parseFloat(transfer.amount))}
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

