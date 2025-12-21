"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { Deal } from "@/lib/deals";

interface CEOPropertyDetailsProps {
  deal: Deal;
}

export function CEOPropertyDetails({ deal }: CEOPropertyDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Developer
            </div>
            <div className="text-base text-gray-900 dark:text-white font-medium">
              {deal.developer?.name || "-"}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Project
            </div>
            <div className="text-base text-gray-900 dark:text-white font-medium">
              {deal.project?.name || "-"}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Property Name
            </div>
            <div className="text-base text-gray-900 dark:text-white font-medium">
              {deal.propertyName || "-"}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Unit Number
            </div>
            <div className="text-base text-gray-900 dark:text-white font-medium">
              {deal.unitNumber || "-"}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Size
            </div>
            <div className="text-base text-gray-900 dark:text-white font-medium">
              {deal.size ? `${deal.size} sqft` : "-"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

