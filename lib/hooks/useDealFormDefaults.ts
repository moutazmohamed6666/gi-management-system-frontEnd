"use client";

import { useEffect, useMemo } from "react";
import { UseFormSetValue } from "react-hook-form";
import { DealFormData, UserRole } from "./useDealFormData";
import { FilterOption } from "../filters";

interface UseDealFormDefaultsProps {
  isEditMode: boolean;
  currentRole: UserRole;
  statuses: FilterOption[];
  purchaseStatuses: FilterOption[];
  watchedBookingDate: string;
  setValue: UseFormSetValue<DealFormData>;
}

export function useDealFormDefaults({
  isEditMode,
  currentRole,
  statuses,
  purchaseStatuses,
  watchedBookingDate,
  setValue,
}: UseDealFormDefaultsProps) {
  // Get original commission value from login for override detection
  const originalCommissionValue = useMemo(() => {
    if (!isEditMode && currentRole === "agent") {
      return sessionStorage.getItem("userCommissionValue");
    }
    return null;
  }, [isEditMode, currentRole]);

  // Calculate default status ID based on role
  const defaultStatusId = useMemo(() => {
    if (isEditMode) return "";
    if (statuses.length === 0) return "";

    // For agents and sales admin, always use "submitted" status
    if (currentRole === "agent" || currentRole === "SALES_ADMIN") {
      const submittedStatus =
        statuses.find((s) =>
          String(s.name).toLowerCase().includes("submitted")
        ) ?? statuses.find((s) => String(s.name).toLowerCase().includes("new"));
      return submittedStatus?.id ?? statuses[0]?.id ?? "";
    }

    // For other roles, use "new" status
    const preferred =
      statuses.find((s) => String(s.name).toLowerCase().includes("new")) ??
      statuses[0];
    return preferred?.id ?? "";
  }, [isEditMode, statuses, currentRole]);

  // Set default statusId for agents and sales admin when creating a deal
  useEffect(() => {
    if (
      (currentRole === "agent" || currentRole === "SALES_ADMIN") &&
      !isEditMode &&
      defaultStatusId
    ) {
      setValue("statusId", defaultStatusId, { shouldValidate: false });
    }
  }, [currentRole, isEditMode, defaultStatusId, setValue]);

  // Ensure commission type is always set from login for agents (create mode only)
  useEffect(() => {
    if (currentRole === "agent" && !isEditMode) {
      const loginCommissionType = sessionStorage.getItem("userCommissionType");
      if (loginCommissionType) {
        setValue("agentCommissionTypeId", loginCommissionType, {
          shouldValidate: false,
        });
      }
    }
  }, [currentRole, isEditMode, setValue]);

  // Auto-set purchaseStatusId to "Booking" when bookingDate is set for agents and sales admin
  useEffect(() => {
    if (
      (currentRole === "agent" || currentRole === "SALES_ADMIN") &&
      !isEditMode &&
      watchedBookingDate &&
      purchaseStatuses.length > 0
    ) {
      const bookingStatus = purchaseStatuses.find((status) =>
        status.name.toLowerCase().includes("booking")
      );

      if (bookingStatus && bookingStatus.id) {
        setValue("purchaseStatusId", bookingStatus.id, {
          shouldValidate: false,
          shouldDirty: false,
        });
      }
    }
  }, [currentRole, isEditMode, watchedBookingDate, purchaseStatuses, setValue]);

  // Load defaults from sessionStorage for agents

  return {
    defaultStatusId,
    originalCommissionValue,
  };
}
