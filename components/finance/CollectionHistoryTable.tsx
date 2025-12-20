"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { DealCollection } from "@/lib/commissions";

interface CollectionHistoryTableProps {
  collections: DealCollection[];
}

export function CollectionHistoryTable({
  collections,
}: CollectionHistoryTableProps) {
  if (collections.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Collection History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">
                  Source
                </th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">
                  Method
                </th>
                <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">
                  Amount
                </th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">
                  Reference
                </th>
              </tr>
            </thead>
            <tbody>
              {collections.map((collection) => (
                <tr
                  key={collection.id}
                  className="border-b dark:border-gray-700"
                >
                  <td className="py-3 px-4 text-gray-900 dark:text-white">
                    {new Date(collection.receivedDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-gray-900 dark:text-white capitalize">
                    {collection.sourceType}
                  </td>
                  <td className="py-3 px-4 text-gray-900 dark:text-white">
                    {collection.paymentMethod.replace("-", " ")}
                  </td>
                  <td className="py-3 px-4 text-right text-green-600 dark:text-green-400 font-medium">
                    AED {parseFloat(collection.amount).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {collection.reference || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

