"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { ReportType } from "@/lib/reports";

interface ReportsDataTableProps {
  reportType: ReportType;
  chartData: unknown[];
}

export function ReportsDataTable({
  reportType,
  chartData,
}: ReportsDataTableProps) {
  const getReportTypeLabel = (type: ReportType) => {
    switch (type) {
      case "monthly_revenue":
        return "Monthly Revenue";
      case "commission_summary":
        return "Commission Summary";
      case "deal_pipeline":
        return "Deal Pipeline";
      case "agent_performance":
        return "Agent Performance";
      default:
        return "Report";
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle>{getReportTypeLabel(reportType)} Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {chartData.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {reportType === "monthly_revenue" && (
                    <>
                      <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100 font-medium rounded-tl-lg">
                        Month
                      </th>
                      <th className="text-right py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                        Deals
                      </th>
                      <th className="text-right py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                        Collected
                      </th>
                      <th className="text-right py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                        Pending
                      </th>
                      <th className="text-right py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                        Total Comm.
                      </th>
                      <th className="text-right py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                        Gross Revenue
                      </th>
                      <th className="text-right py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                        Agent Comm.
                      </th>
                      <th className="text-right py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                        Manager Comm.
                      </th>
                      <th className="text-right py-3 px-4 text-gray-900 dark:text-gray-100 font-medium rounded-tr-lg">
                        Net Revenue
                      </th>
                    </>
                  )}
                  {reportType === "agent_performance" && (
                    <>
                      <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100 font-medium rounded-tl-lg">
                        Agent
                      </th>
                      <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                        Deals
                      </th>
                      <th className="text-right py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                        Commission
                      </th>
                      <th className="text-right py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                        Paid
                      </th>
                      <th className="text-right py-3 px-4 text-gray-900 dark:text-gray-100 font-medium rounded-tr-lg">
                        Payment %
                      </th>
                    </>
                  )}
                  {reportType === "commission_summary" && (
                    <>
                      <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100 font-medium rounded-tl-lg">
                        Category
                      </th>
                      <th className="text-right py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                        Expected
                      </th>
                      <th className="text-right py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                        Collected
                      </th>
                      <th className="text-right py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                        Transferred
                      </th>
                      <th className="text-right py-3 px-4 text-gray-900 dark:text-gray-100 font-medium rounded-tr-lg">
                        Pending
                      </th>
                    </>
                  )}
                  {reportType === "deal_pipeline" && (
                    <>
                      <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100 font-medium rounded-tl-lg">
                        Stage
                      </th>
                      <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                        Count
                      </th>
                      <th className="text-right py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                        Value
                      </th>
                      <th className="text-right py-3 px-4 text-gray-900 dark:text-gray-100 font-medium rounded-tr-lg">
                        Percentage
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {chartData.map((row, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    {reportType === "monthly_revenue" && (
                      <>
                        <td className="py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                          {(row as { month: string })?.month}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-900 dark:text-gray-100">
                          {(row as { dealClosed: number })?.dealClosed}
                        </td>
                        <td className="py-3 px-4 text-right text-green-600 dark:text-green-400 font-medium">
                          AED{" "}
                          {(
                            row as { commissionCollected: number }
                          )?.commissionCollected?.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-orange-600 dark:text-orange-400 font-medium">
                          AED{" "}
                          {(
                            row as { pendingCommission: number }
                          )?.pendingCommission?.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-purple-600 dark:text-purple-400 font-medium">
                          AED{" "}
                          {(
                            row as { totalCommission: number }
                          )?.totalCommission?.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-900 dark:text-gray-100 font-medium">
                          AED{" "}
                          {(
                            row as { grossRevenue: number }
                          )?.grossRevenue?.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-blue-600 dark:text-blue-400">
                          AED{" "}
                          {(
                            row as { agentCommission: number }
                          )?.agentCommission?.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-pink-600 dark:text-pink-400">
                          AED{" "}
                          {(
                            row as { managerCommission: number }
                          )?.managerCommission?.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-teal-600 dark:text-teal-400 font-medium">
                          AED{" "}
                          {(
                            row as { netRevenue: number }
                          )?.netRevenue?.toLocaleString()}
                        </td>
                      </>
                    )}
                    {reportType === "agent_performance" && (
                      <>
                        <td className="py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                          {(row as { agent_name: string })?.agent_name}
                        </td>
                        <td className="py-3 px-4 text-gray-900 dark:text-gray-100">
                          {(row as { deals_count: number })?.deals_count}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-900 dark:text-gray-100">
                          AED{" "}
                          {(
                            row as { total_commission: number }
                          )?.total_commission?.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-green-600 dark:text-green-400 font-medium">
                          AED{" "}
                          {(
                            row as { paid_commission: number }
                          )?.paid_commission?.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-900 dark:text-gray-100">
                          <div className="flex items-center justify-end gap-2">
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-[60px]">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{
                                  width: `${
                                    (
                                      row as {
                                        payment_percentage: number;
                                      }
                                    )?.payment_percentage || 0
                                  }%`,
                                }}
                              ></div>
                            </div>
                            <span>
                              {(
                                row as { payment_percentage: number }
                              )?.payment_percentage?.toFixed(1)}
                              %
                            </span>
                          </div>
                        </td>
                      </>
                    )}
                    {reportType === "commission_summary" && (
                      <>
                        <td className="py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                          {(row as { category: string })?.category}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-900 dark:text-gray-100">
                          AED{" "}
                          {(
                            row as { expected: number }
                          )?.expected?.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-green-600 dark:text-green-400 font-medium">
                          AED{" "}
                          {(
                            row as { collected: number }
                          )?.collected?.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-blue-600 dark:text-blue-400">
                          AED{" "}
                          {(
                            row as { transferred: number }
                          )?.transferred?.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-orange-600 dark:text-orange-400 font-medium">
                          AED{" "}
                          {(
                            row as { pending: number }
                          )?.pending?.toLocaleString()}
                        </td>
                      </>
                    )}
                    {reportType === "deal_pipeline" && (
                      <>
                        <td className="py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                          {(row as { stage: string })?.stage}
                        </td>
                        <td className="py-3 px-4 text-gray-900 dark:text-gray-100">
                          {(row as { count: number })?.count}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-900 dark:text-gray-100">
                          AED{" "}
                          {(row as { value: number })?.value?.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-900 dark:text-gray-100">
                          {(row as { percentage: number })?.percentage?.toFixed(
                            1
                          )}
                          %
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              No data available for selected filters
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
