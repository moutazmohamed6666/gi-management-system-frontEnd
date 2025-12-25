"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { Deal } from "@/lib/deals";

interface CEOAgentInfoProps {
  deal: Deal;
}

export function CEOAgentInfo({ deal }: CEOAgentInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Agent Name
            </div>
            <div className="text-base text-gray-900 dark:text-white font-medium">
              {deal.agent?.name || "-"}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Agent Email
            </div>
            <div className="text-base text-gray-900 dark:text-white font-medium">
              {deal.agent?.email || "-"}
            </div>
          </div>
          {deal.manager && (
            <>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Manager Name
                </div>
                <div className="text-base text-gray-900 dark:text-white font-medium">
                  {deal.manager.name || "-"}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Manager Email
                </div>
                <div className="text-base text-gray-900 dark:text-white font-medium">
                  {deal.manager.email || "-"}
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
