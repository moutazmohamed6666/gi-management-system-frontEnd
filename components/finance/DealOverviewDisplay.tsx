"use client";

import type { DealOverview } from "./DealOverviewForm";

interface DealOverviewDisplayProps {
  dealOverview: DealOverview;
}

export function DealOverviewDisplay({
  dealOverview,
}: DealOverviewDisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <div className="text-gray-600 dark:text-gray-400">Property Type</div>
        <div className="text-gray-900 dark:text-white">
          {dealOverview.propertyType || "-"}
        </div>
      </div>
      <div>
        <div className="text-gray-600 dark:text-gray-400">Developer</div>
        <div className="text-gray-900 dark:text-white">
          {dealOverview.developer || "-"}
        </div>
      </div>
      <div>
        <div className="text-gray-600 dark:text-gray-400">Project</div>
        <div className="text-gray-900 dark:text-white">
          {dealOverview.project || "-"}
        </div>
      </div>
      <div>
        <div className="text-gray-600 dark:text-gray-400">Unit Type</div>
        <div className="text-gray-900 dark:text-white">
          {dealOverview.unitType || "-"}
        </div>
      </div>
      <div>
        <div className="text-gray-600 dark:text-gray-400">Unit Number</div>
        <div className="text-gray-900 dark:text-white">
          {dealOverview.unitNumber || "-"}
        </div>
      </div>
      <div>
        <div className="text-gray-600 dark:text-gray-400">Location</div>
        <div className="text-gray-900 dark:text-white">
          {dealOverview.location || "-"}
        </div>
      </div>
      <div>
        <div className="text-gray-600 dark:text-gray-400">Buyer Name</div>
        <div className="text-gray-900 dark:text-white">
          {dealOverview.buyerName || "-"}
        </div>
      </div>
      <div>
        <div className="text-gray-600 dark:text-gray-400">Buyer Contact</div>
        <div className="text-gray-900 dark:text-white">
          {dealOverview.buyerContact || "-"}
        </div>
      </div>
      <div>
        <div className="text-gray-600 dark:text-gray-400">Seller Name</div>
        <div className="text-gray-900 dark:text-white">
          {dealOverview.sellerName || "-"}
        </div>
      </div>
      <div>
        <div className="text-gray-600 dark:text-gray-400">Seller Contact</div>
        <div className="text-gray-900 dark:text-white">
          {dealOverview.sellerContact || "-"}
        </div>
      </div>
      <div>
        <div className="text-gray-600 dark:text-gray-400">Agent</div>
        <div className="text-gray-900 dark:text-white">
          {dealOverview.agentName || "-"}
        </div>
      </div>
      <div>
        <div className="text-gray-600 dark:text-gray-400">Selling Price</div>
        <div className="text-gray-900 dark:text-white">
          AED {dealOverview.sellingPrice.toLocaleString()}
        </div>
      </div>
      <div>
        <div className="text-gray-600 dark:text-gray-400">Close Date</div>
        <div className="text-gray-900 dark:text-white">
          {dealOverview.dealCloseDate || "-"}
        </div>
      </div>
      <div>
        <div className="text-gray-600 dark:text-gray-400">Lead Source</div>
        <div className="text-gray-900 dark:text-white">
          {dealOverview.leadSource || "-"}
        </div>
      </div>
      <div>
        <div className="text-gray-600 dark:text-gray-400">Payment Plan</div>
        <div className="text-gray-900 dark:text-white">
          {dealOverview.paymentPlan || "-"}
        </div>
      </div>
      {dealOverview.notes && (
        <div className="md:col-span-3">
          <div className="text-gray-600 dark:text-gray-400">Notes</div>
          <div className="text-gray-900 dark:text-white">
            {dealOverview.notes}
          </div>
        </div>
      )}
    </div>
  );
}

