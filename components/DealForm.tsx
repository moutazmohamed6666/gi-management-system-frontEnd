"use client";

import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useFilters } from "@/lib/useFilters";
import { dealsApi, type CreateDealRequest, type Deal } from "@/lib/deals";
import { ArrowLeft, Save, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { DealPreviewModal } from "./DealPreviewModal";
import { DealInformationSection } from "./deal-form/DealInformationSection";
import { PropertyDetailsSection } from "./deal-form/PropertyDetailsSection";
import { UnitDetailsSection } from "./deal-form/UnitDetailsSection";
import { BuyerSellerSection } from "./deal-form/BuyerSellerSection";
import { CommissionDetailsSection } from "./deal-form/CommissionDetailsSection";
import { PurchaseValueSection } from "./deal-form/PurchaseValueSection";

interface DealFormProps {
  dealId: string | null;
  onBack: () => void;
  onSave: () => void;
}

type UserRole = "agent" | "finance" | "ceo" | "admin";

// Form data type for react-hook-form
type DealFormData = {
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
  bedroomsId: string; // Changed from bedrooms to bedroomsId for API consistency
  purchaseValue: string; // New: Purchase Value field

  // Seller Information
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string; // New: Optional seller email
  sellerNationalityId: string;
  sellerSourceId: string;

  // Buyer Information
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string; // New: Optional buyer email
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

export function DealForm({ dealId, onBack, onSave }: DealFormProps) {
  // Fetch filter data for dropdowns
  const {
    developers,
    projects: allProjects,
    statuses,
    dealTypes,
    propertyTypes,
    unitTypes,
    nationalities,
    leadSources,
    commissionTypes,
    purchaseStatuses,
    agents: allAgents,
    bedrooms,
    isLoading: filtersLoading,
    error: filtersError,
  } = useFilters();

  // Initialize form with useForm hook
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DealFormData>({
    mode: "onChange", // Validate on change for better UX
    defaultValues: {
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
      agentCommissionTypeId: "", // Will be populated in useEffect
      totalCommissionTypeId: "",
      totalCommissionValue: "",
      hasAdditionalAgent: false,
      additionalAgentType: "external",
      additionalAgentId: "",
      agencyName: "",
      agencyComm: "",
      agencyCommissionTypeId: "",

      notes: "",
    },
  });

  // Watch fields for conditional rendering and filtering using useWatch
  // This is compatible with React Compiler and prevents stale UI issues
  const watchedDeveloperId = useWatch({ control, name: "developerId" });
  const watchedHasAdditionalAgent = useWatch({
    control,
    name: "hasAdditionalAgent",
  });
  const watchedAdditionalAgentType = useWatch({
    control,
    name: "additionalAgentType",
  });
  const watchedSalesValue = useWatch({ control, name: "salesValue" });
  const watchedBookingDate = useWatch({ control, name: "bookingDate" });
  const watchedAgencyComm = useWatch({ control, name: "agencyComm" });

  const [dealError, setDealError] = useState<string | null>(null);
  const [loadedDealId, setLoadedDealId] = useState<string | null>(null);
  const [dealFetchNonce, setDealFetchNonce] = useState(0);
  // Preview modal state
  const [showPreview, setShowPreview] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<DealFormData | null>(
    null
  );

  const isEditMode = Boolean(dealId);

  const isoToYmd = (value?: string) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  };

  const currentRole: UserRole =
    (typeof window !== "undefined"
      ? (sessionStorage.getItem("userRole") as UserRole)
      : "agent") || "agent";

  // Get original commission value from login for override detection
  const originalCommissionValue = useMemo(() => {
    if (!isEditMode && currentRole === "agent") {
      return sessionStorage.getItem("userCommissionValue");
    }
    return null;
  }, [isEditMode, currentRole]);

  const defaultStatusId = useMemo(() => {
    if (isEditMode) return "";
    if (statuses.length === 0) return "";

    // For agents, always use "submitted" status
    if (currentRole === "agent") {
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

  // Set default statusId for agents when creating a deal (field is hidden)
  useEffect(() => {
    if (currentRole === "agent" && !isEditMode && defaultStatusId) {
      setValue("statusId", defaultStatusId, { shouldValidate: false });
    }
  }, [currentRole, isEditMode, defaultStatusId, setValue]);

  // Ensure commission type is always set from login for agents (create mode only)
  useEffect(() => {
    if (currentRole === "agent" && !isEditMode) {
      const loginCommissionType = sessionStorage.getItem("userCommissionType");
      if (loginCommissionType) {
        // Always ensure commission type from login is set
        setValue("agentCommissionTypeId", loginCommissionType, {
          shouldValidate: false,
        });
      }
    }
  }, [currentRole, isEditMode, setValue]);

  // Auto-set purchaseStatusId to "Booking" when bookingDate is set for agents
  useEffect(() => {
    if (
      currentRole === "agent" &&
      !isEditMode &&
      watchedBookingDate &&
      purchaseStatuses.length > 0
    ) {
      // Find the "Booking" purchase status (case-insensitive search)
      const bookingStatus = purchaseStatuses.find((status) =>
        status.name.toLowerCase().includes("booking")
      );

      if (bookingStatus && bookingStatus.id) {
        // Set purchaseStatusId to booking status, but don't validate (hidden field)
        setValue("purchaseStatusId", bookingStatus.id, {
          shouldValidate: false,
          shouldDirty: false,
        });
      }
    }
  }, [currentRole, isEditMode, watchedBookingDate, purchaseStatuses, setValue]);

  // Load defaults from sessionStorage for agents
  useEffect(() => {
    if (!isEditMode && currentRole === "agent") {
      const defaultCommType = sessionStorage.getItem("userCommissionType");
      const defaultCommValue = sessionStorage.getItem("userCommissionValue");

      // Always set commission type from login (required for agents)
      if (defaultCommType) {
        setValue("agentCommissionTypeId", defaultCommType, {
          shouldValidate: false,
        });
      }

      // Pre-fill commission value from login
      if (defaultCommValue) {
        setValue("commRate", defaultCommValue, { shouldValidate: false });
      }
    }
  }, [isEditMode, currentRole, setValue]);

  // Finance can always edit deals (same as agent create form)
  // Agents can only create, not edit
  const isReadOnly = isEditMode && currentRole === "agent";

  // Load deal when editing
  useLayoutEffect(() => {
    if (!dealId) return;
    if (loadedDealId === dealId) return;

    let cancelled = false;

    dealsApi
      .getDealById(dealId)
      .then((deal: Deal) => {
        if (cancelled) return;

        // Backend responses can expose status as either a string or an object.
        // Extract statusId from status object if available (new structure)
        let statusId = deal.statusId || "";
        const statusLabel =
          (deal as unknown as { status?: unknown }).status ??
          (deal as unknown as { dealStatus?: unknown }).dealStatus ??
          "";

        if (
          statusLabel &&
          typeof statusLabel === "object" &&
          "id" in (statusLabel as Record<string, unknown>)
        ) {
          // New structure: status is an object with id and name
          const statusObj = statusLabel as { id: string; name?: string };
          statusId = statusObj.id || statusId;
        }

        // Handle both old structure (buyerSellerDetails) and new structure (buyer/seller objects)
        const buyer =
          deal.buyer ||
          deal.buyerSellerDetails?.find((d) => d.isBuyer === true);
        const seller =
          deal.seller ||
          deal.buyerSellerDetails?.find((d) => d.isBuyer === false);

        // Extract dealType - handle both old (dealTypeId) and new (dealType object) structures
        const dealTypeId = deal.dealType?.id || deal.dealTypeId || "";

        // Extract purchaseStatus - handle both old (purchaseStatusId) and new (purchaseStatus object) structures
        const purchaseStatusId =
          deal.purchaseStatus?.id || deal.purchaseStatusId || "";

        // Extract property data - handle both old and new structures
        const propertyName = deal.property?.name || deal.propertyName || "";
        const propertyTypeId =
          deal.property?.type?.id || deal.propertyTypeId || "";

        // Extract unit data - handle both old and new structures
        const unitNumber = deal.unit?.number || deal.unitNumber || "";
        const unitTypeId = deal.unit?.type?.id || deal.unitTypeId || "";
        const size = deal.unit?.size
          ? String(deal.unit.size)
          : deal.size
          ? String(deal.size)
          : "";

        // Extract buyer/seller nationality and source - handle nested objects
        const buyerNationalityId =
          (buyer as { nationality?: { id: string } })?.nationality?.id ||
          (buyer as { nationalityId?: string })?.nationalityId ||
          "";
        const buyerSourceId =
          (buyer as { source?: { id: string } })?.source?.id ||
          (buyer as { sourceId?: string })?.sourceId ||
          "";
        const sellerNationalityId =
          (seller as { nationality?: { id: string } })?.nationality?.id ||
          (seller as { nationalityId?: string })?.nationalityId ||
          "";
        const sellerSourceId =
          (seller as { source?: { id: string } })?.source?.id ||
          (seller as { sourceId?: string })?.sourceId ||
          "";

        // Extract agent commission - handle both old and new structures
        let agentCommissionTypeId = "";
        let agentCommissionValue = "";

        // New structure: use agentCommissions.mainAgent
        if (deal.agentCommissions?.mainAgent) {
          const mainAgent = deal.agentCommissions.mainAgent;
          agentCommissionTypeId = mainAgent.commissionType?.id || "";
          agentCommissionValue = mainAgent.expectedAmount
            ? String(mainAgent.expectedAmount)
            : mainAgent.commissionValue
            ? String(mainAgent.commissionValue)
            : "";
        } else if (deal.commissions) {
          // Old structure: extract from commissions array
          const agentCommission = deal.commissions.find(
            (c) => c.roleId && c.roleId !== "" // Agent commission
          );
          agentCommissionTypeId = agentCommission?.typeId || "";
          agentCommissionValue = agentCommission?.expectedAmount
            ? String(parseFloat(agentCommission.expectedAmount))
            : "";
        }

        // Extract additional agents - handle both old and new structures
        let additionalAgents: Array<{
          agentId?: string;
          externalAgentName?: string;
          commissionTypeId?: string;
          commissionValue?: number;
          isInternal?: boolean;
        }> = [];

        // New structure: use agentCommissions.additionalAgents
        if (deal.agentCommissions?.additionalAgents) {
          additionalAgents = deal.agentCommissions.additionalAgents.map(
            (agent) => ({
              agentId: agent.agent?.id,
              externalAgentName: agent.isInternal
                ? undefined
                : agent.agent?.name,
              commissionTypeId: agent.commissionType?.id,
              commissionValue: agent.commissionValue,
              isInternal: agent.isInternal,
            })
          );
        } else {
          // Old structure: check if deal has additionalAgents field
          additionalAgents =
            (
              deal as unknown as {
                additionalAgents?: Array<{
                  agentId?: string;
                  externalAgentName?: string;
                  commissionTypeId?: string;
                  commissionValue?: number;
                  isInternal?: boolean;
                }>;
              }
            ).additionalAgents || [];
        }

        // Get first additional agent if exists (form currently supports one additional agent)
        const firstAdditionalAgent = additionalAgents[0];
        const hasAdditionalAgent = additionalAgents.length > 0;
        const additionalAgentType: "internal" | "external" =
          firstAdditionalAgent?.isInternal === true ? "internal" : "external";
        const additionalAgentId = firstAdditionalAgent?.agentId || "";
        const agencyName = firstAdditionalAgent?.externalAgentName || "";
        const agencyComm = firstAdditionalAgent?.commissionValue
          ? String(firstAdditionalAgent.commissionValue)
          : "";
        const agencyCommissionTypeId =
          firstAdditionalAgent?.commissionTypeId || "";

        // Reset form with deal data
        reset({
          // Deal Information
          bookingDate: isoToYmd(deal.bookingDate),
          cfExpiry: isoToYmd(deal.cfExpiry),
          closeDate: deal.closeDate ? isoToYmd(deal.closeDate) : "",
          dealTypeId: dealTypeId, // Use extracted dealTypeId (from dealType object or dealTypeId field)
          statusId: statusId, // Use extracted statusId (from status object or statusId field)
          purchaseStatusId: purchaseStatusId, // Use extracted purchaseStatusId (from purchaseStatus object or purchaseStatusId field)

          // Property Details
          developerId: deal.developerId || deal.developer?.id || "",
          projectId: deal.projectId || deal.project?.id || "",
          propertyName: propertyName, // Use extracted propertyName (from property object or propertyName field)
          propertyTypeId: propertyTypeId, // Use extracted propertyTypeId (from property.type object or propertyTypeId field)
          unitNumber: unitNumber, // Use extracted unitNumber (from unit.number or unitNumber field)
          unitTypeId: unitTypeId, // Use extracted unitTypeId (from unit.type object or unitTypeId field)
          size: size, // Use extracted size (from unit.size or size field)
          bedroomsId: "", // TODO: Extract from deal if backend provides it
          purchaseValue: "", // TODO: Extract from deal if backend provides it

          // Seller - handle both old structure (BuyerSellerDetail) and new structure (BuyerSeller)
          sellerName: seller?.name || "",
          sellerPhone: seller?.phone || "",
          sellerEmail: (seller as { email?: string })?.email || "",
          sellerNationalityId: sellerNationalityId, // Use extracted from nested nationality object or nationalityId field
          sellerSourceId: sellerSourceId, // Use extracted from nested source object or sourceId field

          // Buyer - handle both old structure (BuyerSellerDetail) and new structure (BuyerSeller)
          buyerName: buyer?.name || "",
          buyerPhone: buyer?.phone || "",
          buyerEmail: (buyer as { email?: string })?.email || "",
          buyerNationalityId: buyerNationalityId, // Use extracted from nested nationality object or nationalityId field
          buyerSourceId: buyerSourceId, // Use extracted from nested source object or sourceId field

          // Commission
          salesValue:
            typeof deal.dealValue === "number"
              ? String(deal.dealValue)
              : deal.dealValue || "",
          agentCommissionTypeId: agentCommissionTypeId,
          commRate: agentCommissionValue,
          totalCommissionTypeId:
            deal.totalCommission?.type?.id || deal.totalCommissionTypeId || "",
          totalCommissionValue: deal.totalCommission?.value
            ? String(deal.totalCommission.value)
            : deal.totalCommission?.commissionValue
            ? String(deal.totalCommission.commissionValue)
            : deal.totalCommissionValue
            ? String(deal.totalCommissionValue)
            : "",

          // Additional Agent
          hasAdditionalAgent: hasAdditionalAgent,
          additionalAgentType: additionalAgentType,
          additionalAgentId: additionalAgentId,
          agencyName: agencyName,
          agencyComm: agencyComm,
          agencyCommissionTypeId: agencyCommissionTypeId,

          notes: "", // Keep for now
        });

        setLoadedDealId(dealId);
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : "Failed to load deal";
        setDealError(message);
        console.error("Error loading deal:", err);
      });

    return () => {
      cancelled = true;
    };
  }, [dealId, loadedDealId, dealFetchNonce, reset]);

  // Filter projects by selected developer
  // Note: If API doesn't provide developerId in project objects,
  // we may need to fetch projects with ?developerId={id} parameter
  const filteredProjects = useMemo(() => {
    if (!watchedDeveloperId) return [];
    // Try to filter by developerId if it exists in project object
    // Otherwise show all projects (backend should filter or we need to update API)
    type ProjectOption = { developerId?: string };
    const projectsWithDeveloper = allProjects.filter((project) => {
      const devId = (project as unknown as ProjectOption).developerId;
      return devId === watchedDeveloperId;
    });
    // If no projects have developerId property, show all projects
    // (This means API doesn't include developerId, and we should update API call)
    return projectsWithDeveloper.length > 0
      ? projectsWithDeveloper
      : allProjects;
  }, [allProjects, watchedDeveloperId]);

  // Phone validation function
  const validatePhone = (phone: string): boolean => {
    // Phone regex: allows international format with + and numbers, 10-15 digits
    const phoneRegex =
      /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,5}[-\s\.]?[0-9]{1,5}$/;
    return phoneRegex.test(phone);
  };

  // Email validation function
  const validateEmail = (email: string): boolean => {
    if (!email) return true; // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // UUID validation function
  const isValidUuid = (value: string) => {
    // UUID v1-v5
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value
    );
  };

  // Form submission handler - shows preview for new deals
  const onSubmit = async (data: DealFormData) => {
    if (isReadOnly) {
      toast.error("Permission denied", {
        description:
          currentRole === "agent"
            ? "Agents can create deals, but cannot edit an existing deal."
            : "This deal is approved and cannot be edited.",
      });
      return;
    }

    // For new deals (not editing), show preview modal first
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
    // Get agent ID from session
    const agentId = sessionStorage.getItem("userId");
    if (!agentId) {
      toast.error("Authentication Error", {
        description: "Agent ID not found. Please log in again.",
      });
      return;
    }

    // Use effectiveStatusId (either from form or default)
    const finalStatusId = data.statusId || defaultStatusId;

    // For agents creating deals, exclude closeDate from payload
    const isAgentCreating = currentRole === "agent" && !dealId;

    // Prepare base payload
    const basePayload = {
      dealValue: parseFloat(data.salesValue) || 0,
      purchaseValue: data.purchaseValue
        ? parseFloat(data.purchaseValue)
        : undefined,
      developerId: data.developerId,
      projectId: data.projectId,
      agentId: agentId,
      bookingDate: new Date(data.bookingDate).toISOString(),
      cfExpiry: data.cfExpiry
        ? new Date(data.cfExpiry).toISOString()
        : new Date().toISOString(),
      dealTypeId: data.dealTypeId,
      statusId: finalStatusId,
      numberOfDeal: 1, // Default to 1, discuss with backend
      propertyName: data.propertyName || "",
      propertyTypeId: data.propertyTypeId,
      unitNumber: data.unitNumber,
      unitTypeId: data.unitTypeId,
      bedroomsId: data.bedroomsId || undefined,
      size: parseFloat(data.size) || 0,
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
      // Commission fields - for agents, always use commission type from login
      agentCommissionTypeId: (() => {
        // For agents, always use commission type from login (never from form)
        if (currentRole === "agent") {
          const loginCommissionType =
            sessionStorage.getItem("userCommissionType");
          return loginCommissionType || data.agentCommissionTypeId || undefined;
        }
        // For other roles, use form value
        return data.agentCommissionTypeId || undefined;
      })(),
      agentCommissionValue: data.commRate
        ? parseFloat(data.commRate)
        : undefined,
      agentCommissionTypeOverride: (() => {
        // Only apply override logic for agents
        if (currentRole === "agent") {
          const originalValue =
            originalCommissionValue ||
            sessionStorage.getItem("userCommissionValue");
          const currentValue = data.commRate;

          // If value changed from original, set override flag
          if (originalValue && currentValue) {
            const originalNum = parseFloat(originalValue);
            const currentNum = parseFloat(currentValue);
            // Check if values are different (accounting for floating point precision)
            if (
              !isNaN(originalNum) &&
              !isNaN(currentNum) &&
              originalNum !== currentNum
            ) {
              return true;
            }
          }
        }
        return false;
      })(),
      // Total Commission fields
      totalCommissionTypeId: data.totalCommissionTypeId || undefined,
      totalCommissionValue: data.totalCommissionValue
        ? parseFloat(data.totalCommissionValue)
        : undefined,
      // Purchase status - for agents creating deals, always include if bookingDate is set
      purchaseStatusId: (() => {
        // For agents creating deals, if bookingDate is set but purchaseStatusId is not,
        // try to find and set the booking status
        if (
          currentRole === "agent" &&
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
      // Additional agents if enabled
      // Note: Backend supports multiple external agents (array).
      // Current UI supports one additional agent for simplicity.
      // Future enhancement: Add UI for managing multiple external agents.
      additionalAgents: data.hasAdditionalAgent
        ? [
            data.additionalAgentType === "internal"
              ? {
                  agentId: data.additionalAgentId,
                  commissionTypeId:
                    data.agencyCommissionTypeId ||
                    data.agentCommissionTypeId ||
                    "",
                  commissionValue: data.agencyComm
                    ? parseFloat(data.agencyComm)
                    : 0,
                  isInternal: true,
                }
              : {
                  externalAgentName: data.agencyName,
                  commissionTypeId:
                    data.agencyCommissionTypeId ||
                    data.agentCommissionTypeId ||
                    "",
                  commissionValue: data.agencyComm
                    ? parseFloat(data.agencyComm)
                    : 0,
                  isInternal: false,
                },
          ]
        : undefined,
    };

    // For agents creating deals, exclude closeDate from payload
    // For other roles or when editing, include closeDate
    const payload: CreateDealRequest = isAgentCreating
      ? ({
          ...basePayload,
          closeDate: new Date().toISOString(), // Required by type but won't be used by backend for agents
        } as CreateDealRequest)
      : {
          ...basePayload,
          closeDate: data.closeDate
            ? new Date(data.closeDate).toISOString()
            : new Date().toISOString(),
        };

    try {
      if (dealId) {
        await dealsApi.updateDeal(dealId, payload);
        toast.success("Deal Updated", {
          description: "Deal has been updated successfully!",
        });
      } else {
        // For agents creating deals, remove closeDate from payload before sending
        let payloadToSend: CreateDealRequest;
        if (isAgentCreating) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { closeDate, ...rest } = payload;
          payloadToSend = rest as CreateDealRequest;
        } else {
          payloadToSend = payload;
        }
        await dealsApi.createDeal(payloadToSend);
        toast.success("Deal Created", {
          description: "Deal has been created successfully!",
        });
      }
      onSave();
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
    }
  };

  // Handle preview modal confirm
  const handlePreviewConfirm = async () => {
    if (!pendingFormData) return;
    setShowPreview(false);
    await submitDeal(pendingFormData);
    setPendingFormData(null);
  };

  // Handle preview modal close
  const handlePreviewClose = () => {
    setShowPreview(false);
    setPendingFormData(null);
  };

  // Prepare preview data from form data
  const getPreviewData = () => {
    if (!pendingFormData) return null;

    const getDeveloperName = () => {
      const dev = developers.find((d) => d.id === pendingFormData.developerId);
      return dev?.name || "N/A";
    };

    const getProjectName = () => {
      const proj = filteredProjects.find(
        (p) => p.id === pendingFormData.projectId
      );
      return proj?.name || "N/A";
    };

    const getDealTypeName = () => {
      const type = dealTypes.find((t) => t.id === pendingFormData.dealTypeId);
      return type?.name || "N/A";
    };

    const getStatusName = () => {
      const status = statuses.find(
        (s) => s.id === (pendingFormData.statusId || defaultStatusId)
      );
      return status?.name || "N/A";
    };

    const getPurchaseStatusName = () => {
      const status = purchaseStatuses.find(
        (s) => s.id === pendingFormData.purchaseStatusId
      );
      return status?.name || "N/A";
    };

    const getPropertyTypeName = () => {
      const type = propertyTypes.find(
        (t) => t.id === pendingFormData.propertyTypeId
      );
      return type?.name || "N/A";
    };

    const getUnitTypeName = () => {
      const type = unitTypes.find((t) => t.id === pendingFormData.unitTypeId);
      return type?.name || "N/A";
    };

    const getBedroomsName = () => {
      const bedroom = bedrooms.find((b) => b.id === pendingFormData.bedroomsId);
      return bedroom?.name || "N/A";
    };

    const getDealCommissionTypeName = () => {
      const type = commissionTypes.find(
        (t) => t.id === pendingFormData.totalCommissionTypeId
      );
      return type?.name || "N/A";
    };

    const getAgentCommissionTypeName = () => {
      const type = commissionTypes.find(
        (t) => t.id === pendingFormData.agentCommissionTypeId
      );
      return type?.name || "N/A";
    };

    const getAdditionalAgentCommissionTypeName = () => {
      const type = commissionTypes.find(
        (t) => t.id === pendingFormData.agencyCommissionTypeId
      );
      return type?.name || "N/A";
    };

    const getAdditionalAgentName = () => {
      if (pendingFormData.additionalAgentType === "internal") {
        const agent = allAgents.find(
          (a) => a.id === pendingFormData.additionalAgentId
        );
        return agent?.name || "N/A";
      }
      return pendingFormData.agencyName || "N/A";
    };

    const getMainAgentName = () => {
      return sessionStorage.getItem("username") || "Current Agent";
    };

    return {
      bookingDate: pendingFormData.bookingDate,
      cfExpiry: pendingFormData.cfExpiry,
      closeDate: pendingFormData.closeDate,
      dealType: getDealTypeName(),
      status: getStatusName(),
      purchaseStatus: getPurchaseStatusName(),
      developer: getDeveloperName(),
      project: getProjectName(),
      propertyName: pendingFormData.propertyName,
      propertyType: getPropertyTypeName(),
      unitNumber: pendingFormData.unitNumber,
      unitType: getUnitTypeName(),
      size: pendingFormData.size,
      bedrooms: getBedroomsName(),
      buyerName: pendingFormData.buyerName,
      buyerPhone: pendingFormData.buyerPhone,
      buyerEmail: pendingFormData.buyerEmail,
      sellerName: pendingFormData.sellerName,
      sellerPhone: pendingFormData.sellerPhone,
      sellerEmail: pendingFormData.sellerEmail,
      salesValue: pendingFormData.salesValue,
      purchaseValue: pendingFormData.purchaseValue,

      // Deal Commission
      dealCommissionRate: pendingFormData.totalCommissionValue || "N/A",
      dealCommissionType: getDealCommissionTypeName(),
      totalDealCommission: pendingFormData.totalCommissionValue,

      // Main Agent Commission
      mainAgentName: getMainAgentName(),
      mainAgentCommissionRate: pendingFormData.commRate,
      mainAgentCommissionType: getAgentCommissionTypeName(),
      mainAgentCommissionValue: pendingFormData.commRate, // This will be calculated by backend

      // Additional Agent
      hasAdditionalAgent: pendingFormData.hasAdditionalAgent,
      additionalAgentType: pendingFormData.additionalAgentType,
      additionalAgentName: getAdditionalAgentName(),
      additionalAgentCommissionRate: pendingFormData.agencyComm,
      additionalAgentCommissionType: getAdditionalAgentCommissionTypeName(),
      additionalAgentCommissionValue: pendingFormData.agencyComm,
    };
  };

  const shouldShowDealLoading =
    Boolean(dealId) && loadedDealId !== dealId && !dealError;

  if (shouldShowDealLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-3 text-gray-600 dark:text-gray-400">
          Loading deal...
        </span>
      </div>
    );
  }

  if (dealError) {
    return (
      <div className="flex items-center justify-center py-12">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <div className="ml-3">
          <div className="text-red-600 dark:text-red-400">{dealError}</div>
          {dealId && (
            <div className="mt-3">
              <Button
                variant="outline"
                onClick={() => {
                  setDealError(null);
                  setLoadedDealId(null);
                  setDealFetchNonce((n) => n + 1);
                }}
              >
                Retry
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show loading state while filters are loading
  if (filtersLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-3 text-gray-600 dark:text-gray-400">
          Loading form data...
        </span>
      </div>
    );
  }

  // Show error state if filters failed to load
  if (filtersError) {
    return (
      <div className="flex items-center justify-center py-12">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <span className="ml-3 text-red-600 dark:text-red-400">
          {filtersError}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Deals
        </Button>
        {!isReadOnly ? (
          <Button
            type="submit"
            form="deal-form"
            disabled={isSubmitting}
            className="gi-bg-dark-green flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isEditMode ? "Updating..." : "Saving..."}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isEditMode ? "Update Deal" : "Save Deal"}
              </>
            )}
          </Button>
        ) : (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            View only
          </div>
        )}
      </div>

      {isReadOnly && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900 dark:border-amber-900/30 dark:bg-amber-950/30 dark:text-amber-100">
          <div className="text-sm">
            You can <span className="font-medium">create</span> deals, but
            existing deals are <span className="font-medium">view-only</span>{" "}
            for Agents.
          </div>
        </div>
      )}

      <form id="deal-form" onSubmit={handleSubmit(onSubmit)}>
        <fieldset
          disabled={isReadOnly || isSubmitting}
          className={isReadOnly ? "opacity-80" : ""}
        >
          {/* Row 1: Deal Information & Property Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DealInformationSection
              control={control}
              errors={errors}
              currentRole={currentRole}
              isEditMode={isEditMode}
              defaultStatusId={defaultStatusId}
              dealTypes={dealTypes}
              statuses={statuses}
              purchaseStatuses={purchaseStatuses}
              filtersLoading={filtersLoading}
              isValidUuid={isValidUuid}
            />

            <PropertyDetailsSection
              control={control}
              errors={errors}
              setValue={setValue}
              developers={developers}
              filteredProjects={filteredProjects}
              propertyTypes={propertyTypes}
              watchedDeveloperId={watchedDeveloperId}
              filtersLoading={filtersLoading}
            />
          </div>

          {/* Row 2: Unit Details with Purchase Value */}
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Unit Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <UnitDetailsSection
                    control={control}
                    register={register}
                    errors={errors}
                    setValue={setValue}
                    unitTypes={unitTypes}
                    bedrooms={bedrooms}
                    filtersLoading={filtersLoading}
                  />
                  <div className="pt-4 border-t">
                    <PurchaseValueSection
                      register={register}
                      setValue={setValue}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Row 3: Seller & Buyer */}
          <BuyerSellerSection
            control={control}
            register={register}
            errors={errors}
            nationalities={nationalities}
            leadSources={leadSources}
            filtersLoading={filtersLoading}
            validatePhone={validatePhone}
            validateEmail={validateEmail}
          />

          {/* Row 4: Commission Details & Additional Notes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CommissionDetailsSection
              control={control}
              register={register}
              errors={errors}
              setValue={setValue}
              commissionTypes={commissionTypes}
              allAgents={allAgents}
              watchedHasAdditionalAgent={watchedHasAdditionalAgent}
              watchedAdditionalAgentType={watchedAdditionalAgentType}
              watchedSalesValue={watchedSalesValue}
              watchedAgencyComm={watchedAgencyComm}
              currentRole={currentRole}
              filtersLoading={filtersLoading}
            />

            {/* Additional Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="notes"
                  {...register("notes")}
                  placeholder="Enter any additional notes or comments..."
                  rows={10}
                  className="resize-none"
                />
              </CardContent>
            </Card>
          </div>
        </fieldset>
      </form>

      {/* Documents & Attachments (hidden for now - backend has no attachment APIs yet) */}

      {/* Preview Modal */}
      {showPreview && pendingFormData && (
        <DealPreviewModal
          isOpen={showPreview}
          onClose={handlePreviewClose}
          onConfirm={handlePreviewConfirm}
          data={getPreviewData()!}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
