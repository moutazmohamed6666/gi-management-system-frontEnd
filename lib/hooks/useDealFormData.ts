"use client";

import { useForm, useWatch, Control } from "react-hook-form";

export type UserRole = "agent" | "finance" | "ceo" | "admin";

// Additional agent type
export type AdditionalAgent = {
  type: "internal" | "external";
  agentId?: string; // For internal agents
  agencyName?: string; // For external agents
  commissionValue: string;
  commissionTypeId: string;
};

// Form data type for react-hook-form
export type DealFormData = {
  // Deal Information
  bookingDate: string;
  cfExpiry: string;
  closeDate: string;
  dealTypeId: string;
  statusId: string;
  purchaseStatusId: string;
  downpayment: string; // New field in API

  // Property Details
  developerId: string;
  projectId: string;
  propertyName: string;
  propertyTypeId: string;
  unitNumber: string;
  unitTypeId: string;
  size: string;
  bedroomId: string; // Changed from bedroomsId to bedroomId (singular)

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
  additionalAgents: AdditionalAgent[];

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
  downpayment: "",

  // Property Details
  developerId: "",
  projectId: "",
  propertyName: "",
  propertyTypeId: "",
  unitNumber: "",
  unitTypeId: "",
  size: "",
  bedroomId: "",

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
  additionalAgents: [],

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
    additionalAgents: useWatch({
      control: form.control,
      name: "additionalAgents",
    }),
    salesValue: useWatch({ control: form.control, name: "salesValue" }),
    bookingDate: useWatch({ control: form.control, name: "bookingDate" }),
  };

  return {
    form,
    watchedFields,
  };
}
