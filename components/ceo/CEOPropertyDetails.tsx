"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { Deal } from "@/lib/deals";

interface CEOPropertyDetailsProps {
  deal: Deal;
}

export function CEOPropertyDetails({ deal }: CEOPropertyDetailsProps) {
  // Extract property and unit details from new API structure
  const propertyName = deal.property?.name || deal.propertyName || "-";
  const propertyType = deal.property?.type?.name || "-";
  const unitNumber = deal.unit?.number || deal.unitNumber || "-";
  const unitType = deal.unit?.type?.name || "-";
  const unitSize = deal.unit?.size || deal.size || null;
  const bedroom = deal.unit?.bedroom?.name || "-";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              {propertyName}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Property Type
            </div>
            <div className="text-base text-gray-900 dark:text-white font-medium">
              {propertyType}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Unit Number
            </div>
            <div className="text-base text-gray-900 dark:text-white font-medium">
              {unitNumber}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Unit Type
            </div>
            <div className="text-base text-gray-900 dark:text-white font-medium">
              {unitType}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Size
            </div>
            <div className="text-base text-gray-900 dark:text-white font-medium">
              {unitSize ? `${unitSize} sqft` : "-"}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Bedrooms
            </div>
            <div className="text-base text-gray-900 dark:text-white font-medium">
              {bedroom}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

