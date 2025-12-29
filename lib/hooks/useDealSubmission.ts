"use client";

import { useState } from "react";
import { toast } from "sonner";
import { dealsApi, type CreateDealRequest } from "../deals";
import { DealFormData, UserRole } from "./useDealFormData";
import { FilterOption } from "../filters";

interface UseDealSubmissionProps {
  dealId: string | null;
  currentRole: UserRole;
  defaultStatusId: string;
  originalCommissionValue?: string | null;
  purchaseStatuses: FilterOption[];
  onSave: (createdDealId?: string) => void;
}

export function useDealSubmission({
  dealId,
  currentRole,
  defaultStatusId,
  purchaseStatuses,
  onSave,
}: UseDealSubmissionProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<DealFormData | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(dealId);
  const isReadOnly =
    isEditMode && (currentRole === "agent" || currentRole === "compliance");

  // Form submission handler - shows preview for new deals
  const handleFormSubmit = async (data: DealFormData) => {
    if (isReadOnly) {
      toast.error("Permission denied", {
        description:
          currentRole === "agent"
            ? "Agents can create deals, but cannot edit an existing deal."
            : currentRole === "compliance"
            ? "Compliance users can view deals and upload media, but cannot edit deal data."
            : "This deal is approved and cannot be edited.",
      });
      return;
    }

    // Prevent COMPLIANCE role from creating new deals
    if (!dealId && currentRole === "compliance") {
      toast.error("Permission denied", {
        description:
          "Compliance users can view deals and upload media, but cannot create new deals.",
      });
      return;
    }

    // For new deals, show preview modal first
    if (!dealId) {
      setPendingFormData(data);
      setShowPreview(true);
      return;
    }

    // For editing, proceed directly
    await submitDeal(data);
  };

  // Actual submission logic
  const submitDeal = async (data: DealFormData) => {
    setIsSubmitting(true);
    try {
      const loggedInUserId = sessionStorage.getItem("userId");
      const agentId =
        currentRole === "SALES_ADMIN" ? data.agentId : loggedInUserId;

      if (!agentId) {
        toast.error("Authentication Error", {
          description:
            currentRole === "SALES_ADMIN"
              ? "Please select an agent."
              : "Agent ID not found. Please log in again.",
        });
        return;
      }

      const finalStatusId = data.statusId || defaultStatusId;
      const isAgentCreating =
        (currentRole === "agent" || currentRole === "SALES_ADMIN") && !dealId;

      // Prepare base payload
      const basePayload = {
        dealValue: parseFloat(data.salesValue) || 0,
        developerId: data.developerId,
        projectId: data.projectId,
        agentId: agentId,
        bookingDate: new Date(data.bookingDate).toISOString(),
        cfExpiry: data.cfExpiry
          ? new Date(data.cfExpiry).toISOString()
          : new Date().toISOString(),
        dealTypeId: data.dealTypeId,
        statusId: finalStatusId,
        areaId: data.areaId || undefined,
        teamId: data.teamId || undefined,
        propertyName: data.propertyName || "",
        propertyTypeId: data.propertyTypeId,
        unitNumber: data.unitNumber,
        unitTypeId: data.unitTypeId,
        bedroomId: data.bedroomId || undefined,
        size: parseFloat(data.size) || 0,
        downpayment: data.downpayment
          ? parseFloat(data.downpayment)
          : undefined,
        buyer: {
          name: data.buyerName,
          phone: data.buyerPhone,
          email: data.buyerEmail || undefined,
          nationalityId: data.buyerNationalityId,
          sourceId: data.buyerSourceId,
        },
        seller: {
          name: data.sellerName,
          phone: data.sellerPhone,
          email: data.sellerEmail || undefined,
          nationalityId: data.sellerNationalityId,
          sourceId: data.sellerSourceId,
        },
        agentCommissionTypeId: (() => {
          if (currentRole === "agent") {
            // If agentCommissionTypeId is set in form data (e.g., override type), use it
            // Otherwise, fall back to the user's default commission type from sessionStorage
            const loginCommissionType =
              sessionStorage.getItem("userCommissionType");
            const finalTypeId =
              data.agentCommissionTypeId || loginCommissionType || undefined;
            console.log("Agent commission type ID being sent:", {
              formData: data.agentCommissionTypeId,
              sessionStorage: loginCommissionType,
              final: finalTypeId,
            });
            return finalTypeId;
          }
          return data.agentCommissionTypeId || undefined;
        })(),
        agentCommissionValue: data.commRate
          ? parseFloat(data.commRate)
          : undefined,
        totalCommissionTypeId: data.totalCommissionTypeId || undefined,
        totalCommissionValue: data.totalCommissionValue
          ? parseFloat(data.totalCommissionValue)
          : undefined,
        purchaseStatusId: (() => {
          if (
            (currentRole === "agent" || currentRole === "SALES_ADMIN") &&
            !dealId &&
            data.bookingDate &&
            !data.purchaseStatusId
          ) {
            const bookingStatus = purchaseStatuses.find((status) =>
              status.name.toLowerCase().includes("booking")
            );
            return bookingStatus?.id || undefined;
          }
          return data.purchaseStatusId || undefined;
        })(),
        additionalAgents:
          data.additionalAgents && data.additionalAgents.length > 0
            ? data.additionalAgents.map((agent) =>
                agent.type === "internal"
                  ? {
                      agentId: agent.agentId || "",
                      commissionTypeId: agent.commissionTypeId || "",
                      commissionValue: agent.commissionValue
                        ? parseFloat(agent.commissionValue)
                        : 0,
                      isInternal: true,
                    }
                  : {
                      externalAgentName: agent.agencyName || "",
                      commissionTypeId: agent.commissionTypeId || "",
                      commissionValue: agent.commissionValue
                        ? parseFloat(agent.commissionValue)
                        : 0,
                      isInternal: false,
                    }
              )
            : undefined,
        topup: data.topup ? parseFloat(data.topup) : undefined,
      };

      const payload: CreateDealRequest = isAgentCreating
        ? ({
            ...basePayload,
            closeDate: new Date().toISOString(),
          } as CreateDealRequest)
        : {
            ...basePayload,
            closeDate: data.closeDate
              ? new Date(data.closeDate).toISOString()
              : new Date().toISOString(),
          };

      if (dealId) {
        await dealsApi.updateDeal(dealId, payload);
        toast.success("Deal Updated", {
          description: "Deal has been updated successfully!",
        });
        onSave();
      } else {
        let payloadToSend: CreateDealRequest;
        if (isAgentCreating) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { closeDate, ...rest } = payload;
          payloadToSend = rest as CreateDealRequest;
        } else {
          payloadToSend = payload;
        }
        const response = await dealsApi.createDeal(payloadToSend);
        toast.success("Deal Created", {
          description: "Deal has been created successfully!",
        });
        // Return the created deal ID for navigation
        onSave(response.id);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : dealId
          ? "Failed to update deal"
          : "Failed to create deal";
      toast.error(dealId ? "Error Updating Deal" : "Error Creating Deal", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreviewConfirm = async () => {
    if (!pendingFormData) return;
    setShowPreview(false);
    await submitDeal(pendingFormData);
    setPendingFormData(null);
  };

  const handlePreviewClose = () => {
    setShowPreview(false);
    setPendingFormData(null);
  };

  return {
    showPreview,
    pendingFormData,
    isSubmitting,
    isReadOnly,
    handleFormSubmit,
    handlePreviewConfirm,
    handlePreviewClose,
  };
}
