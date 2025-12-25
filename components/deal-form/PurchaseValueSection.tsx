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
  downpayment: string;
  developerId: string;
  projectId: string;
  propertyName: string;
  propertyTypeId: string;
  unitNumber: string;
  unitTypeId: string;
  size: string;
  bedroomId: string;
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

interface DownpaymentSectionProps {
  register: UseFormRegister<DealFormData>;
  setValue: UseFormSetValue<DealFormData>;
}

export function DownpaymentSection({
  register,
  setValue,
}: DownpaymentSectionProps) {
  return (
    <div>
      <Label htmlFor="downpayment">Downpayment (AED)</Label>
      <Input
        id="downpayment"
        type="text"
        {...register("downpayment", {
          onChange: (e) => {
            const numericValue = e.target.value.replace(/[^0-9]/g, "");
            setValue("downpayment", numericValue, {
              shouldValidate: true,
            });
          },
        })}
        placeholder="Enter downpayment amount"
        className="mt-1"
      />
    </div>
  );
}
