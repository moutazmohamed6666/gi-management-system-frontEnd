"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { RecentFinanceNotesResponse } from "@/lib/finance";

interface FinanceNotesTableProps {
  financeNotes: RecentFinanceNotesResponse | null;
}

export function FinanceNotesTable({ financeNotes }: FinanceNotesTableProps) {
  const financeNotesDisplay =
    financeNotes?.data.map((note) => ({
      dealId: note.deal_id,
      agent: note.agent,
      note: note.finance_note,
      timestamp: new Date(note.timestamp).toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      addedBy: note.added_by,
    })) || [];

  if (financeNotesDisplay.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Recent Finance Notes</CardTitle>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              0 notes
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No finance notes available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>Recent Finance Notes</CardTitle>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {financeNotesDisplay.length} notes
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100 rounded-tl-lg">
                  Deal ID
                </th>
                <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">
                  Agent
                </th>
                <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">
                  Finance Note
                </th>
                <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">
                  Timestamp
                </th>
                <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100 rounded-tr-lg">
                  Added By
                </th>
              </tr>
            </thead>
            <tbody>
              {financeNotesDisplay.map((note, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="text-gray-900 dark:text-gray-100 font-medium">
                      {note.dealId}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-900 dark:text-gray-100">
                      {note.agent}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-900 dark:text-gray-100">
                      {note.note}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {note.timestamp}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-900 dark:text-gray-100">
                      {note.addedBy}
                    </div>
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
