"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import type { Deal, Commission } from "@/lib/deals";
import { TrendingUp, User, Building2 } from "lucide-react";

interface CEOCommissionDetailsProps {
  deal: Deal;
  commissions: Commission[];
}

export function CEOCommissionDetails({
  deal,
  commissions,
}: CEOCommissionDetailsProps) {
  const formatCurrency = (value: string | number | undefined | null) => {
    if (!value && value !== 0) return "-";
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(numValue)) return "-";
    return `AED ${numValue.toLocaleString()}`;
  };

  // Calculate deal commission (total commission value)
  // Support both old and new API structure
  const dealCommission =
    deal.totalCommission?.commissionValue ||
    deal.totalCommission?.value ||
    parseFloat(deal.totalCommissionValue || "0") ||
    0;

  // Calculate agent commission from new agentCommissions structure or old commissions array
  let agentCommission = 0;
  let agentCommissionPaid = 0;

  if (deal.agentCommissions) {
    // New API structure
    agentCommission = deal.agentCommissions.totalExpected || 0;
    agentCommissionPaid = deal.agentCommissions.totalPaid || 0;
  } else if (commissions && commissions.length > 0) {
    // Old API structure - sum all commissions
    agentCommission = commissions.reduce(
      (sum, c) => sum + parseFloat(c.expectedAmount || "0"),
      0
    );
    agentCommissionPaid = commissions.reduce(
      (sum, c) => sum + parseFloat(c.paidAmount || "0"),
      0
    );
  }

  // Calculate paid amounts for deal commission
  // Use collectedCommissions.totalCollected from API response for deal commission
  const dealCommissionPaid = deal.collectedCommissions?.totalCollected || 0;

  // Calculate remaining amounts
  const dealCommissionRemaining = dealCommission - dealCommissionPaid;
  const agentCommissionRemaining = agentCommission - agentCommissionPaid;

  // Determine commission status
  const getCommissionStatus = (paid: number, total: number) => {
    if (total === 0)
      return { label: "No Commission", variant: "secondary" as const };
    if (paid === 0)
      return { label: "Pending", variant: "destructive" as const };
    if (paid >= total) return { label: "Paid", variant: "default" as const };
    return { label: "Partially Paid", variant: "outline" as const };
  };

  const dealStatus = getCommissionStatus(dealCommissionPaid, dealCommission);
  const agentStatus = getCommissionStatus(agentCommissionPaid, agentCommission);

  return (
    <Card className="border-2 border-blue-200 dark:border-blue-800">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
        <CardTitle className="flex items-center gap-2 text-xl">
          <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Commission Details
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Deal Commission Card */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-gray-800 rounded-lg border-2 border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Deal Commission
                </span>
              </div>
              <Badge variant={dealStatus.variant}>{dealStatus.label}</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Total Commission
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(dealCommission)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Collected Amount
                </span>
                <span className="text-base font-semibold text-green-600 dark:text-green-400">
                  {formatCurrency(dealCommissionPaid)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Remaining
                </span>
                <span className="text-base font-bold text-orange-600 dark:text-orange-400">
                  {formatCurrency(dealCommissionRemaining)}
                </span>
              </div>
            </div>
          </div>

          {/* Agent Commission Card */}
          <div className="p-4 bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-gray-800 rounded-lg border-2 border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Agent Commission
                </span>
              </div>
              <Badge variant={agentStatus.variant}>{agentStatus.label}</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Total Commission
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(agentCommission)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Paid Amount
                </span>
                <span className="text-base font-semibold text-green-600 dark:text-green-400">
                  {formatCurrency(agentCommissionPaid)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Remaining
                </span>
                <span className="text-base font-bold text-orange-600 dark:text-orange-400">
                  {formatCurrency(agentCommissionRemaining)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Commission Breakdown - Hidden as requested */}
        {/* {commissions && commissions.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Commission Breakdown
            </div>
            <div className="space-y-3">
              {commissions.map((commission) => (
                <div
                  key={commission.id}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Commission #{commission.id.slice(0, 8)}
                        </span>
                        {commission.isOverride && (
                          <Badge variant="outline" className="text-xs">
                            Override
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">
                            Expected:{" "}
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(commission.expectedAmount)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">
                            Paid:{" "}
                          </span>
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            {formatCurrency(commission.paidAmount)}
                          </span>
                        </div>
                      </div>
                      {commission.overrideReason && (
                        <div className="mt-2 text-xs text-orange-600 dark:text-orange-400">
                          Override Reason: {commission.overrideReason}
                        </div>
                      )}
                    </div>
                    <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                      {commission.paidDate ? (
                        <div>
                          <div className="font-medium">Paid</div>
                          <div>{formatDate(commission.paidDate)}</div>
                        </div>
                      ) : commission.dueDate ? (
                        <div>
                          <div className="font-medium">Due</div>
                          <div>{formatDate(commission.dueDate)}</div>
                        </div>
                      ) : (
                        <div className="text-gray-400">Pending</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )} */}
      </CardContent>
    </Card>
  );
}
