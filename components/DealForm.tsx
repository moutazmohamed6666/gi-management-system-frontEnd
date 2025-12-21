"use client";

import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { StyledDatePicker } from "./StyledDatePicker";
import { useFilters } from "@/lib/useFilters";
import { dealsApi, type CreateDealRequest, type Deal } from "@/lib/deals";
import { ArrowLeft, Save, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface DealFormProps {
  dealId: string | null;
  onBack: () => void;
  onSave: () => void;
}

type UserRole = "agent" | "finance" | "ceo" | "admin";

// Define stages that should lock the deal for finance editing
// Only lock after CEO/final approval, not during finance review stages
const LOCKED_STAGES = [
  "ceo approved",
  "commission received",
  "commission transferred",
  "closed",
  "completed",
];

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
  bedrooms: string;

  // Seller Information
  sellerName: string;
  sellerPhone: string;
  sellerNationalityId: string;
  sellerSourceId: string;

  // Buyer Information
  buyerName: string;
  buyerPhone: string;
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
    isLoading: filtersLoading,
    error: filtersError,
  } = useFilters();

  // Initialize form with useForm hook
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
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
      bedrooms: "",

      // Seller Information
      sellerName: "",
      sellerPhone: "",
      sellerNationalityId: "",
      sellerSourceId: "",

      // Buyer Information
      buyerName: "",
      buyerPhone: "",
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
    },
  });

  // Watch fields for conditional rendering and filtering
  const watchedDeveloperId = watch("developerId");
  const watchedHasAdditionalAgent = watch("hasAdditionalAgent");
  const watchedAdditionalAgentType = watch("additionalAgentType");
  const watchedSalesValue = watch("salesValue");
  const watchedAgencyComm = watch("agencyComm");

  const [dealError, setDealError] = useState<string | null>(null);
  const [loadedDealId, setLoadedDealId] = useState<string | null>(null);
  const [dealFetchNonce, setDealFetchNonce] = useState(0);
  const [dealStatusName, setDealStatusName] = useState<string>("");

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

  const watchedStatusId = watch("statusId");
  const effectiveStatusId = watchedStatusId || defaultStatusId;

  const statusNameFromFilters = useMemo(() => {
    if (!effectiveStatusId) return "";
    return statuses.find((s) => s.id === effectiveStatusId)?.name || "";
  }, [effectiveStatusId, statuses]);

  // Set default statusId for agents when creating a deal (field is hidden)
  useEffect(() => {
    if (currentRole === "agent" && !isEditMode && defaultStatusId) {
      setValue("statusId", defaultStatusId, { shouldValidate: false });
    }
  }, [currentRole, isEditMode, defaultStatusId, setValue]);

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
        const statusLabel =
          (deal as unknown as { status?: unknown }).status ??
          (deal as unknown as { dealStatus?: unknown }).dealStatus ??
          "";
        if (typeof statusLabel === "string") setDealStatusName(statusLabel);
        else if (
          statusLabel &&
          typeof statusLabel === "object" &&
          "name" in (statusLabel as Record<string, unknown>) &&
          typeof (statusLabel as Record<string, unknown>).name === "string"
        ) {
          setDealStatusName(
            (statusLabel as Record<string, unknown>).name as string
          );
        } else {
          setDealStatusName("");
        }

        const buyer = deal.buyerSellerDetails?.find((d) => d.isBuyer === true);
        const seller = deal.buyerSellerDetails?.find(
          (d) => d.isBuyer === false
        );

        // Extract agent commission from commissions array
        // Look for commission with roleId matching agent role (typically roleId for agents)
        const agentCommission = deal.commissions?.find(
          (c) => c.roleId && c.roleId !== "" // Agent commission (you may need to adjust this logic based on your role IDs)
        );
        const agentCommissionTypeId = agentCommission?.typeId || "";
        const agentCommissionValue = agentCommission?.expectedAmount
          ? String(parseFloat(agentCommission.expectedAmount))
          : "";

        // Extract additional agents if available in the deal response
        // Check if deal has additionalAgents field (might not be in Deal type but could be in response)
        const additionalAgents =
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
          closeDate: isoToYmd(deal.closeDate),
          dealTypeId: deal.dealTypeId || "",
          statusId: deal.statusId || "",
          purchaseStatusId: deal.purchaseStatusId || "",

          // Property Details
          developerId: deal.developerId || deal.developer?.id || "",
          projectId: deal.projectId || deal.project?.id || "",
          propertyName: deal.propertyName || "",
          propertyTypeId: deal.propertyTypeId || "",
          unitNumber: deal.unitNumber || "",
          unitTypeId: deal.unitTypeId || "",
          size: deal.size ? String(deal.size) : "",
          bedrooms: "", // Keep for now

          // Seller
          sellerName: seller?.name || "",
          sellerPhone: seller?.phone || "",
          sellerNationalityId: seller?.nationalityId || "",
          sellerSourceId: seller?.sourceId || "",

          // Buyer
          buyerName: buyer?.name || "",
          buyerPhone: buyer?.phone || "",
          buyerNationalityId: buyer?.nationalityId || "",
          buyerSourceId: buyer?.sourceId || "",

          // Commission
          salesValue: deal.dealValue ? String(deal.dealValue) : "",
          agentCommissionTypeId: agentCommissionTypeId,
          commRate: agentCommissionValue,
          totalCommissionTypeId: deal.totalCommissionTypeId || "",
          totalCommissionValue: deal.totalCommissionValue
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

  // UUID validation function
  const isValidUuid = (value: string) => {
    // UUID v1-v5
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value
    );
  };

  // Form submission handler
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
      size: parseFloat(data.size) || 0,
      buyer: {
        name: data.buyerName,
        phone: data.buyerPhone,
        nationalityId: data.buyerNationalityId,
        sourceId: data.buyerSourceId,
      },
      seller: {
        name: data.sellerName,
        phone: data.sellerPhone,
        nationalityId: data.sellerNationalityId,
        sourceId: data.sellerSourceId,
      },
      // Optional fields
      agentCommissionTypeId: data.agentCommissionTypeId || undefined,
      agentCommissionValue: data.commRate
        ? parseFloat(data.commRate)
        : undefined,
      // Total Commission fields
      totalCommissionTypeId: data.totalCommissionTypeId || undefined,
      totalCommissionValue: data.totalCommissionValue
        ? parseFloat(data.totalCommissionValue)
        : undefined,
      // Purchase status
      purchaseStatusId: data.purchaseStatusId || undefined,
      // Additional agents if enabled
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
            {/* Deal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Deal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bookingDate">Booking Date</Label>
                    <div className="mt-1">
                      <Controller
                        name="bookingDate"
                        control={control}
                        rules={{ required: "Booking date is required" }}
                        render={({ field }) => (
                          <StyledDatePicker
                            id="bookingDate"
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select booking date"
                          />
                        )}
                      />
                    </div>
                    {errors.bookingDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.bookingDate.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="cfExpiry">CF Expiry</Label>
                    <div className="mt-1">
                      <Controller
                        name="cfExpiry"
                        control={control}
                        render={({ field }) => (
                          <StyledDatePicker
                            id="cfExpiry"
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select CF expiry date"
                          />
                        )}
                      />
                    </div>
                  </div>
                  {!(currentRole === "agent" && !isEditMode) && (
                    <div>
                      <Label htmlFor="closeDate">Close Date</Label>
                      <div className="mt-1">
                        <Controller
                          name="closeDate"
                          control={control}
                          rules={{
                            required: "Close date is required",
                          }}
                          render={({ field }) => (
                            <StyledDatePicker
                              id="closeDate"
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Select close date"
                            />
                          )}
                        />
                      </div>
                      {errors.closeDate && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.closeDate.message}
                        </p>
                      )}
                    </div>
                  )}
                  <div>
                    <Label htmlFor="dealTypeId">Deal Type</Label>
                    <Controller
                      name="dealTypeId"
                      control={control}
                      rules={{ required: "Deal type is required" }}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={filtersLoading}
                        >
                          <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="Select deal type" />
                          </SelectTrigger>
                          <SelectContent>
                            {dealTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.dealTypeId && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.dealTypeId.message}
                      </p>
                    )}
                  </div>
                  {!(currentRole === "agent" && !isEditMode) && (
                    <div>
                      <Label htmlFor="statusId">
                        Status <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name="statusId"
                        control={control}
                        rules={{
                          required: "Status is required",
                          validate: (value) => {
                            const finalValue = value || defaultStatusId;
                            if (!finalValue) return "Status is required";
                            if (!isValidUuid(finalValue))
                              return "Status must be a valid UUID";
                            return true;
                          },
                        }}
                        render={({ field }) => (
                          <Select
                            value={field.value || defaultStatusId}
                            onValueChange={field.onChange}
                            disabled={filtersLoading}
                          >
                            <SelectTrigger className="w-full mt-1">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              {statuses.map((status) => (
                                <SelectItem key={status.id} value={status.id}>
                                  {status.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.statusId && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.statusId.message}
                        </p>
                      )}
                    </div>
                  )}
                  {currentRole !== "agent" && (
                    <div>
                      <Label htmlFor="purchaseStatusId">Purchase Status</Label>
                      <Controller
                        name="purchaseStatusId"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={filtersLoading}
                          >
                            <SelectTrigger className="w-full mt-1">
                              <SelectValue placeholder="Select purchase status" />
                            </SelectTrigger>
                            <SelectContent>
                              {purchaseStatuses.map((status) => (
                                <SelectItem key={status.id} value={status.id}>
                                  {status.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="developerId">
                      Developer <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="developerId"
                      control={control}
                      rules={{ required: "Developer is required" }}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            // Reset project when developer changes
                            setValue("projectId", "");
                          }}
                          disabled={filtersLoading}
                        >
                          <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="Select developer" />
                          </SelectTrigger>
                          <SelectContent>
                            {developers.map((dev) => (
                              <SelectItem key={dev.id} value={dev.id}>
                                {dev.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.developerId && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.developerId.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="projectId">
                      Project <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="projectId"
                      control={control}
                      rules={{ required: "Project is required" }}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={filtersLoading || !watchedDeveloperId}
                        >
                          <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="Select project" />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredProjects.length === 0 ? (
                              <SelectItem value="__no_projects__" disabled>
                                {watchedDeveloperId
                                  ? "No projects available"
                                  : "Select developer first"}
                              </SelectItem>
                            ) : (
                              filteredProjects.map((project) => (
                                <SelectItem key={project.id} value={project.id}>
                                  {project.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.projectId && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.projectId.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="propertyName">Property Name</Label>
                    <Input
                      id="propertyName"
                      {...register("propertyName")}
                      placeholder="Enter property name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="propertyTypeId">Property Type</Label>
                    <Controller
                      name="propertyTypeId"
                      control={control}
                      rules={{ required: "Property type is required" }}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={filtersLoading}
                        >
                          <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                          <SelectContent>
                            {propertyTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.propertyTypeId && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.propertyTypeId.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Row 2: Additional Property Details */}
          <Card>
            <CardHeader>
              <CardTitle>Unit Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`grid grid-cols-1 gap-4 ${
                  currentRole !== "agent" && currentRole !== "finance"
                    ? "md:grid-cols-4"
                    : "md:grid-cols-3"
                }`}
              >
                <div>
                  <Label htmlFor="unitNumber">Unit #</Label>
                  <Input
                    id="unitNumber"
                    type="text"
                    {...register("unitNumber", {
                      onChange: (e) => {
                        const numericValue = e.target.value.replace(
                          /[^0-9]/g,
                          ""
                        );
                        setValue("unitNumber", numericValue, {
                          shouldValidate: true,
                        });
                      },
                    })}
                    placeholder="Enter unit number"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="unitTypeId">Unit Type</Label>
                  <Controller
                    name="unitTypeId"
                    control={control}
                    rules={{ required: "Unit type is required" }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={filtersLoading}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="Select unit type" />
                        </SelectTrigger>
                        <SelectContent>
                          {unitTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.unitTypeId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.unitTypeId.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="size">Size (sq.ft)</Label>
                  <Input
                    id="size"
                    type="text"
                    {...register("size", {
                      onChange: (e) => {
                        const numericValue = e.target.value.replace(
                          /[^0-9]/g,
                          ""
                        );
                        setValue("size", numericValue, {
                          shouldValidate: true,
                        });
                      },
                    })}
                    placeholder="Enter size in sq.ft"
                    className="mt-1"
                  />
                </div>
                {currentRole !== "agent" && currentRole !== "finance" && (
                  <div>
                    <Label htmlFor="bedrooms">BR (Bedrooms)</Label>
                    <Controller
                      name="bedrooms"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="Select bedrooms" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Studio">Studio</SelectItem>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="6+">6+</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Row 3: Seller & Buyer */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Seller Information */}
            <Card>
              <CardHeader>
                <CardTitle>Seller</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sellerName">Name</Label>
                    <Input
                      id="sellerName"
                      {...register("sellerName", {
                        required: "Seller name is required",
                      })}
                      placeholder="Enter seller name"
                      className={`mt-1 ${
                        errors.sellerName ? "border-red-500" : ""
                      }`}
                    />
                    {errors.sellerName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.sellerName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="sellerPhone">Phone</Label>
                    <Input
                      id="sellerPhone"
                      type="tel"
                      {...register("sellerPhone", {
                        required: "Seller phone is required",
                        validate: (value) =>
                          !value ||
                          validatePhone(value) ||
                          "Invalid phone number format",
                      })}
                      placeholder="+971 50 123 4567"
                      className={`mt-1 ${
                        errors.sellerPhone ? "border-red-500" : ""
                      }`}
                    />
                    {errors.sellerPhone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.sellerPhone.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="sellerNationalityId">Nationality</Label>
                    <Controller
                      name="sellerNationalityId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={filtersLoading}
                        >
                          <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="Select nationality" />
                          </SelectTrigger>
                          <SelectContent>
                            {nationalities.map((nationality) => (
                              <SelectItem
                                key={nationality.id}
                                value={nationality.id}
                              >
                                {nationality.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sellerSourceId">Source</Label>
                    <Controller
                      name="sellerSourceId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={filtersLoading}
                        >
                          <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="Select source" />
                          </SelectTrigger>
                          <SelectContent>
                            {leadSources.map((source) => (
                              <SelectItem key={source.id} value={source.id}>
                                {source.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Buyer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Buyer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="buyerName">Name</Label>
                    <Input
                      id="buyerName"
                      {...register("buyerName", {
                        required: "Buyer name is required",
                      })}
                      placeholder="Enter buyer name"
                      className={`mt-1 ${
                        errors.buyerName ? "border-red-500" : ""
                      }`}
                    />
                    {errors.buyerName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.buyerName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="buyerPhone">Phone</Label>
                    <Input
                      id="buyerPhone"
                      type="tel"
                      {...register("buyerPhone", {
                        required: "Buyer phone is required",
                        validate: (value) =>
                          !value ||
                          validatePhone(value) ||
                          "Invalid phone number format",
                      })}
                      placeholder="+971 50 123 4567"
                      className={`mt-1 ${
                        errors.buyerPhone ? "border-red-500" : ""
                      }`}
                    />
                    {errors.buyerPhone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.buyerPhone.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="buyerNationalityId">Nationality</Label>
                    <Controller
                      name="buyerNationalityId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={filtersLoading}
                        >
                          <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="Select nationality" />
                          </SelectTrigger>
                          <SelectContent>
                            {nationalities.map((nationality) => (
                              <SelectItem
                                key={nationality.id}
                                value={nationality.id}
                              >
                                {nationality.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div>
                    <Label htmlFor="buyerSourceId">Source</Label>
                    <Controller
                      name="buyerSourceId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={filtersLoading}
                        >
                          <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="Select source" />
                          </SelectTrigger>
                          <SelectContent>
                            {leadSources.map((source) => (
                              <SelectItem key={source.id} value={source.id}>
                                {source.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Row 4: Commission Details & Additional Notes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Commission Details */}
            <Card>
              <CardHeader>
                <CardTitle>Commission Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Basic Commission Fields */}
                  <div>
                    <Label htmlFor="salesValue">
                      Sales Value (AED) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="salesValue"
                      type="text"
                      {...register("salesValue", {
                        required: "Sales value is required",
                        onChange: (e) => {
                          const numericValue = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                          setValue("salesValue", numericValue, {
                            shouldValidate: true,
                          });
                        },
                      })}
                      placeholder="Enter sales value"
                      className={`mt-1 ${
                        errors.salesValue ? "border-red-500" : ""
                      }`}
                    />
                    {errors.salesValue && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.salesValue.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="agentCommissionTypeId">
                      Commission Type
                    </Label>
                    <Controller
                      name="agentCommissionTypeId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={filtersLoading}
                        >
                          <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="Select commission type" />
                          </SelectTrigger>
                          <SelectContent>
                            {commissionTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div>
                    <Label htmlFor="commRate">
                      Agent Commission Rate/Value
                    </Label>
                    <Input
                      id="commRate"
                      type="text"
                      {...register("commRate", {
                        onChange: (e) => {
                          // Allow digits and decimal point
                          let numericValue = e.target.value.replace(
                            /[^0-9.]/g,
                            ""
                          );
                          // Ensure only one decimal point
                          const parts = numericValue.split(".");
                          if (parts.length > 2) {
                            numericValue =
                              parts[0] + "." + parts.slice(1).join("");
                          }
                          setValue("commRate", numericValue, {
                            shouldValidate: true,
                          });
                        },
                      })}
                      placeholder="Enter agent commission rate (%) or fixed amount"
                      className="mt-1"
                    />
                  </div>

                  {/* Total Commission Fields */}
                    <div
                      className="pt-4 border-t"
                      style={{ borderColor: "var(--gi-green-40)" }}
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="totalCommissionTypeId">
                            Total Commission Type
                          </Label>
                          <Controller
                            name="totalCommissionTypeId"
                            control={control}
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled={filtersLoading}
                              >
                                <SelectTrigger className="w-full mt-1">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {commissionTypes.map((type) => (
                                    <SelectItem key={type.id} value={type.id}>
                                      {type.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                        <div>
                          <Label htmlFor="totalCommissionValue">
                            Total Commission Value
                          </Label>
                          <Input
                            id="totalCommissionValue"
                            type="text"
                            {...register("totalCommissionValue", {
                              onChange: (e) => {
                                const numericValue = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );
                                setValue("totalCommissionValue", numericValue, {
                                  shouldValidate: true,
                                });
                              },
                            })}
                            placeholder="Enter value"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>

                  {/* Additional Agent Toggle */}
                  <div
                    className="flex items-center justify-between pt-4 border-t"
                    style={{ borderColor: "var(--gi-green-40)" }}
                  >
                    <Label
                      htmlFor="hasAdditionalAgent"
                      className="text-gray-900"
                    >
                      Additional Agent
                    </Label>
                    <Controller
                      name="hasAdditionalAgent"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          id="hasAdditionalAgent"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                  </div>

                  {/* Additional Agent Fields - Shown when toggle is enabled */}
                  {watchedHasAdditionalAgent && (
                    <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      {/* Agent Type Selection */}
                      <div>
                        <Label className="mb-2 block">Agent Type</Label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="additionalAgentType"
                              value="internal"
                              checked={
                                watchedAdditionalAgentType === "internal"
                              }
                              onChange={(e) =>
                                setValue(
                                  "additionalAgentType",
                                  e.target.value as "internal" | "external"
                                )
                              }
                              className="w-4 h-4"
                            />
                            <span className="text-sm">Internal Agent</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="additionalAgentType"
                              value="external"
                              checked={
                                watchedAdditionalAgentType === "external"
                              }
                              onChange={(e) =>
                                setValue(
                                  "additionalAgentType",
                                  e.target.value as "internal" | "external"
                                )
                              }
                              className="w-4 h-4"
                            />
                            <span className="text-sm">External Agent</span>
                          </label>
                        </div>
                      </div>

                      {/* Internal Agent Selection */}
                      {watchedAdditionalAgentType === "internal" && (
                        <div>
                          <Label htmlFor="additionalAgentId">
                            Select Agent
                          </Label>
                          <Controller
                            name="additionalAgentId"
                            control={control}
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled={filtersLoading}
                              >
                                <SelectTrigger className="w-full mt-1">
                                  <SelectValue placeholder="Select internal agent" />
                                </SelectTrigger>
                                <SelectContent>
                                  {allAgents.map((agent) => (
                                    <SelectItem key={agent.id} value={agent.id}>
                                      {agent.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                      )}

                      {/* External Agent Name */}
                      {watchedAdditionalAgentType === "external" && (
                        <div>
                          <Label htmlFor="agencyName">Agency/Agent Name</Label>
                          <Input
                            id="agencyName"
                            {...register("agencyName")}
                            placeholder="Enter agency or agent name"
                            className="mt-1"
                          />
                        </div>
                      )}

                      <div>
                        <Label htmlFor="agencyCommissionTypeId">
                          Commission Type
                        </Label>
                        <Controller
                          name="agencyCommissionTypeId"
                          control={control}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={filtersLoading}
                            >
                              <SelectTrigger className="w-full mt-1">
                                <SelectValue placeholder="Select commission type" />
                              </SelectTrigger>
                              <SelectContent>
                                {commissionTypes.map((type) => (
                                  <SelectItem key={type.id} value={type.id}>
                                    {type.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                      <div>
                        <Label htmlFor="agencyComm">Commission Value</Label>
                        <Input
                          id="agencyComm"
                          type="text"
                          {...register("agencyComm", {
                            onChange: (e) => {
                              const numericValue = e.target.value.replace(
                                /[^0-9]/g,
                                ""
                              );
                              setValue("agencyComm", numericValue, {
                                shouldValidate: true,
                              });
                            },
                          })}
                          placeholder="Enter commission value"
                          className="mt-1"
                        />
                        {watchedSalesValue && watchedAgencyComm && (
                          <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded text-sm">
                            <p className="text-blue-900 dark:text-blue-100 font-semibold">
                              Commission: AED{" "}
                              {parseFloat(watchedAgencyComm).toLocaleString(
                                "en-US",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

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
    </div>
  );
}
