"use client";

import { useForm, useWatch, Control } from "react-hook-form";

export type UserRole = "agent" | "finance" | "ceo" | "admin";

// Form data type for react-hook-form
export type DealFormData = {
  // Deal Information
  bookingDate: string;
  cfExpiry: string;
  closeDate: string;
  dealTypeId: string;
  statusId: string;
  purchaseStatusId: string;

  // Property Details
  developerId: string;
  projectId: string;
  propertyName: string;
  propertyTypeId: string;
  unitNumber: string;
  unitTypeId: string;
  size: string;
  bedroomsId: string;
  purchaseValue: string;

  // Seller Information
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string;
  sellerNationalityId: string;
  sellerSourceId: string;

  // Buyer Information
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  buyerNationalityId: string;
  buyerSourceId: string;

  // Commission Details
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

const defaultFormValues: DealFormData = {
  // Deal Information
  bookingDate: "",
  cfExpiry: "",
  closeDate: "",
  dealTypeId: "",
  statusId: "",
  purchaseStatusId: "",

  // Property Details
  developerId: "",
  projectId: "",
  propertyName: "",
  propertyTypeId: "",
  unitNumber: "",
  unitTypeId: "",
  size: "",
  bedroomsId: "",
  purchaseValue: "",

  // Seller Information
  sellerName: "",
  sellerPhone: "",
  sellerEmail: "",
  sellerNationalityId: "",
  sellerSourceId: "",

  // Buyer Information
  buyerName: "",
  buyerPhone: "",
  buyerEmail: "",
  buyerNationalityId: "",
  buyerSourceId: "",

  // Commission Details
  salesValue: "",
  commRate: "",
  agentCommissionTypeId: "",
  totalCommissionTypeId: "",
  totalCommissionValue: "",
  hasAdditionalAgent: false,
  additionalAgentType: "external",
  additionalAgentId: "",
  agencyName: "",
  agencyComm: "",
  agencyCommissionTypeId: "",

  notes: "",
};

export function useDealFormData() {
  const form = useForm<DealFormData>({
    mode: "onChange",
    defaultValues: defaultFormValues,
  });

  // Watch fields for conditional rendering and filtering
  const watchedFields = {
    developerId: useWatch({ control: form.control, name: "developerId" }),
    hasAdditionalAgent: useWatch({
      control: form.control,
      name: "hasAdditionalAgent",
    }),
    additionalAgentType: useWatch({
      control: form.control,
      name: "additionalAgentType",
    }),
    salesValue: useWatch({ control: form.control, name: "salesValue" }),
    bookingDate: useWatch({ control: form.control, name: "bookingDate" }),
    agencyComm: useWatch({ control: form.control, name: "agencyComm" }),
  };

  return {
    form,
    watchedFields,
  };
}

