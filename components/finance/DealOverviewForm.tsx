"use client";

import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

export interface DealOverview {
  propertyType: string;
  developer: string;
  project: string;
  unitType: string;
  unitNumber: string;
  location: string;
  buyerName: string;
  buyerContact: string;
  sellerName: string;
  sellerContact: string;
  agentName: string;
  sellingPrice: number;
  dealCloseDate: string;
  leadSource: string;
  paymentPlan: string;
  notes: string;
}

interface DealOverviewFormProps {
  dealOverview: DealOverview;
  onChange: (field: string, value: string | number) => void;
}

export function DealOverviewForm({
  dealOverview,
  onChange,
}: DealOverviewFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="propertyType">Property Type</Label>
        <select
          id="propertyType"
          value={dealOverview.propertyType}
          onChange={(e) => onChange("propertyType", e.target.value)}
          className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
        >
          <option value="">Select type</option>
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="Townhouse">Townhouse</option>
          <option value="Penthouse">Penthouse</option>
        </select>
      </div>
      <div>
        <Label htmlFor="developer">Developer</Label>
        <Input
          id="developer"
          value={dealOverview.developer}
          onChange={(e) => onChange("developer", e.target.value)}
          disabled
          className="bg-gray-50 dark:bg-gray-800"
        />
      </div>
      <div>
        <Label htmlFor="project">Project</Label>
        <Input
          id="project"
          value={dealOverview.project}
          onChange={(e) => onChange("project", e.target.value)}
          disabled
          className="bg-gray-50 dark:bg-gray-800"
        />
      </div>
      <div>
        <Label htmlFor="unitType">Unit Type</Label>
        <Input
          id="unitType"
          value={dealOverview.unitType}
          onChange={(e) => onChange("unitType", e.target.value)}
          placeholder="e.g., 2BR, 3BR, Studio"
        />
      </div>
      <div>
        <Label htmlFor="unitNumber">Unit Number</Label>
        <Input
          id="unitNumber"
          value={dealOverview.unitNumber}
          onChange={(e) => onChange("unitNumber", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={dealOverview.location}
          onChange={(e) => onChange("location", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="buyerName">Buyer Name</Label>
        <Input
          id="buyerName"
          value={dealOverview.buyerName}
          onChange={(e) => onChange("buyerName", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="buyerContact">Buyer Contact</Label>
        <Input
          id="buyerContact"
          value={dealOverview.buyerContact}
          onChange={(e) => onChange("buyerContact", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="sellerName">Seller Name</Label>
        <Input
          id="sellerName"
          value={dealOverview.sellerName}
          onChange={(e) => onChange("sellerName", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="sellerContact">Seller Contact</Label>
        <Input
          id="sellerContact"
          value={dealOverview.sellerContact}
          onChange={(e) => onChange("sellerContact", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="agentName">Agent Name</Label>
        <Input
          id="agentName"
          value={dealOverview.agentName}
          disabled
          className="bg-gray-50 dark:bg-gray-800"
        />
      </div>
      <div>
        <Label htmlFor="sellingPrice">Selling Price (AED)</Label>
        <Input
          id="sellingPrice"
          type="number"
          value={dealOverview.sellingPrice}
          onChange={(e) => onChange("sellingPrice", parseFloat(e.target.value))}
        />
      </div>
      <div>
        <Label htmlFor="dealCloseDate">Deal Close Date</Label>
        <Input
          id="dealCloseDate"
          type="date"
          value={dealOverview.dealCloseDate}
          onChange={(e) => onChange("dealCloseDate", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="leadSource">Lead Source</Label>
        <Input
          id="leadSource"
          value={dealOverview.leadSource}
          onChange={(e) => onChange("leadSource", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="paymentPlan">Payment Plan</Label>
        <Input
          id="paymentPlan"
          value={dealOverview.paymentPlan}
          onChange={(e) => onChange("paymentPlan", e.target.value)}
        />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={dealOverview.notes}
          onChange={(e) => onChange("notes", e.target.value)}
          placeholder="Enter deal notes..."
          rows={3}
        />
      </div>
    </div>
  );
}

