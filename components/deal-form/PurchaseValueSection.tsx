"use client";

import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type DealFormData = {
  bookingDate: string;
  cfExpiry: string;
  closeDate: string;
  dealTypeId: string;
  statusId: string;
  purchaseStatusId: string;
  developerId: string;
  projectId: string;
  propertyName: string;
  propertyTypeId: string;
  unitNumber: string;
  unitTypeId: string;
  size: string;
  bedroomsId: string;
  purchaseValue: string;
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string;
  sellerNationalityId: string;
  sellerSourceId: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  buyerNationalityId: string;
  buyerSourceId: string;
  salesValue: string;
  commRate: string;
  agentCommissionTypeId: string;
  totalCommissionTypeId: string;
  totalCommissionValue: string;
  hasAdditionalAgent: boolean;
  additionalAgentType: "internal" | "external";
  additionalAgentId: string;
  agencyName: string;
  agencyComm: string;
  agencyCommissionTypeId: string;
  notes: string;
};

interface PurchaseValueSectionProps {
  register: UseFormRegister<DealFormData>;
  setValue: UseFormSetValue<DealFormData>;
}

export function PurchaseValueSection({
  register,
  setValue,
}: PurchaseValueSectionProps) {
  return (
    <div>
      <Label htmlFor="purchaseValue">Purchase Value (AED)</Label>
      <Input
        id="purchaseValue"
        type="text"
        {...register("purchaseValue", {
          onChange: (e) => {
            const numericValue = e.target.value.replace(/[^0-9]/g, "");
            setValue("purchaseValue", numericValue, {
              shouldValidate: true,
            });
          },
        })}
        placeholder="Enter purchase value"
        className="mt-1"
      />
    </div>
  );
}

