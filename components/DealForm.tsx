"use client";

import { useLayoutEffect, useMemo, useState } from "react";
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

  const [formData, setFormData] = useState({
    // Deal Information
    bookingDate: "",
    cfExpiry: "",
    closeDate: "", // NEW: Added closeDate field
    dealTypeId: "", // Changed from dealType to dealTypeId (UUID)
    statusId: "", // NEW: Required for create deal (UUID)
    purchaseStatusId: "", // NEW: Purchase status (UUID)

    // Property Details
    developerId: "", // Changed from developer to developerId (UUID)
    projectId: "", // Changed from projectName to projectId (UUID)
    propertyName: "", // NEW: Added propertyName field
    propertyTypeId: "", // Changed from propertyType to propertyTypeId (UUID)
    unitNumber: "",
    unitTypeId: "", // Changed from unitType to unitTypeId (UUID)
    size: "", // Changed from sizeSqFt to size (will convert to number)
    bedrooms: "", // Keep for now, discuss with backend

    // Seller Information
    sellerName: "",
    sellerPhone: "",
    sellerNationalityId: "", // Changed from sellerNationality to sellerNationalityId (UUID)
    sellerSourceId: "", // Changed from sellerSource to sellerSourceId (UUID)

    // Buyer Information
    buyerName: "",
    buyerPhone: "",
    buyerNationalityId: "", // Changed from buyerNationality to buyerNationalityId (UUID)
    buyerSourceId: "", // Changed from buyerSource to buyerSourceId (UUID)

    // Commission Details
    salesValue: "",
    commRate: "",
    agentCommissionTypeId: "", // NEW: For commission type
    totalCommissionTypeId: "", // NEW: Total commission type (UUID)
    totalCommissionValue: "", // NEW: Total commission value
    hasAdditionalAgent: false, // Renamed from hasExternalAgent
    additionalAgentType: "external" as "internal" | "external", // NEW: Type of additional agent
    additionalAgentId: "", // NEW: For internal agent selection
    agencyName: "",
    agencyComm: "",
    agencyCommissionTypeId: "", // NEW: For external agent commission type

    notes: "", // Keep for now, discuss with backend
  });

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
    const preferred =
      statuses.find((s) => String(s.name).toLowerCase().includes("new")) ??
      statuses[0];
    return preferred?.id ?? "";
  }, [isEditMode, statuses]);

  const effectiveStatusId = formData.statusId || defaultStatusId;

  const statusNameFromFilters = useMemo(() => {
    if (!effectiveStatusId) return "";
    return statuses.find((s) => s.id === effectiveStatusId)?.name || "";
  }, [effectiveStatusId, statuses]);

  const isValidUuid = (value: string) => {
    // UUID v1-v5
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value
    );
  };

  const isApproved = useMemo(() => {
    const candidates = [dealStatusName, statusNameFromFilters]
      .filter(Boolean)
      .map((s) => String(s).toLowerCase());
    return candidates.some((s) => s.includes("approved"));
  }, [dealStatusName, statusNameFromFilters]);

  const isReadOnly =
    (isEditMode && currentRole === "agent") ||
    (isEditMode && currentRole === "finance" && isApproved);

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

        setFormData((prev) => ({
          ...prev,
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
          totalCommissionTypeId: deal.totalCommissionTypeId || "",
          totalCommissionValue: deal.totalCommissionValue ? String(deal.totalCommissionValue) : "",
        }));

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
  }, [dealId, loadedDealId, dealFetchNonce]);

  // Filter projects by selected developer
  // Note: If API doesn't provide developerId in project objects,
  // we may need to fetch projects with ?developerId={id} parameter
  const filteredProjects = useMemo(() => {
    if (!formData.developerId) return [];
    // Try to filter by developerId if it exists in project object
    // Otherwise show all projects (backend should filter or we need to update API)
    type ProjectOption = { developerId?: string };
    const projectsWithDeveloper = allProjects.filter((project) => {
      const devId = (project as unknown as ProjectOption).developerId;
      return devId === formData.developerId;
    });
    // If no projects have developerId property, show all projects
    // (This means API doesn't include developerId, and we should update API call)
    return projectsWithDeveloper.length > 0
      ? projectsWithDeveloper
      : allProjects;
  }, [allProjects, formData.developerId]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (field: string, value: string | boolean | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validatePhone = (phone: string): boolean => {
    // Phone regex: allows international format with + and numbers, 10-15 digits
    const phoneRegex =
      /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,5}[-\s\.]?[0-9]{1,5}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneChange = (field: string, value: string) => {
    handleChange(field, value);
    if (value && !validatePhone(value)) {
      setErrors((prev) => ({
        ...prev,
        [field]: "Invalid phone number format",
      }));
    }
  };

  const handleNumberOnly = (field: string, value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, "");
    handleChange(field, numericValue);
  };

  const handleSave = async () => {
    if (isReadOnly) {
      toast.error("Permission denied", {
        description:
          currentRole === "agent"
            ? "Agents can create deals, but cannot edit an existing deal."
            : "This deal is approved and cannot be edited.",
      });
      return;
    }

    // Validate phones before saving
    const newErrors: { [key: string]: string } = {};

    // Required field validations
    if (!formData.developerId) {
      newErrors.developerId = "Developer is required";
    }
    if (!formData.projectId) {
      newErrors.projectId = "Project is required";
    }
    if (!formData.dealTypeId) {
      newErrors.dealTypeId = "Deal type is required";
    }
    if (!effectiveStatusId) {
      newErrors.statusId = "Status is required";
    } else if (!isValidUuid(effectiveStatusId)) {
      newErrors.statusId = "Status must be a valid UUID";
    }
    if (!formData.propertyTypeId) {
      newErrors.propertyTypeId = "Property type is required";
    }
    if (!formData.unitTypeId) {
      newErrors.unitTypeId = "Unit type is required";
    }
    if (!formData.buyerName) {
      newErrors.buyerName = "Buyer name is required";
    }
    if (!formData.buyerPhone) {
      newErrors.buyerPhone = "Buyer phone is required";
    }
    if (!formData.sellerName) {
      newErrors.sellerName = "Seller name is required";
    }
    if (!formData.sellerPhone) {
      newErrors.sellerPhone = "Seller phone is required";
    }
    if (!formData.salesValue) {
      newErrors.salesValue = "Sales value is required";
    }
    if (!formData.bookingDate) {
      newErrors.bookingDate = "Booking date is required";
    }
    if (!formData.closeDate) {
      newErrors.closeDate = "Close date is required";
    }

    if (formData.sellerPhone && !validatePhone(formData.sellerPhone)) {
      newErrors.sellerPhone = "Invalid phone number format";
    }
    if (formData.buyerPhone && !validatePhone(formData.buyerPhone)) {
      newErrors.buyerPhone = "Invalid phone number format";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Validation Error", {
        description: "Please fix the validation errors before saving",
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

    // Prepare API payload
    const payload: CreateDealRequest = {
      dealValue: parseFloat(formData.salesValue) || 0,
      developerId: formData.developerId,
      projectId: formData.projectId,
      agentId: agentId,
      bookingDate: new Date(formData.bookingDate).toISOString(),
      cfExpiry: formData.cfExpiry
        ? new Date(formData.cfExpiry).toISOString()
        : new Date().toISOString(),
      closeDate: new Date(formData.closeDate).toISOString(),
      dealTypeId: formData.dealTypeId,
      statusId: effectiveStatusId,
      numberOfDeal: 1, // Default to 1, discuss with backend
      propertyName: formData.propertyName || "", // Use propertyName or project name
      propertyTypeId: formData.propertyTypeId,
      unitNumber: formData.unitNumber,
      unitTypeId: formData.unitTypeId,
      size: parseFloat(formData.size) || 0,
      buyer: {
        name: formData.buyerName,
        phone: formData.buyerPhone,
        nationalityId: formData.buyerNationalityId,
        sourceId: formData.buyerSourceId,
      },
      seller: {
        name: formData.sellerName,
        phone: formData.sellerPhone,
        nationalityId: formData.sellerNationalityId,
        sourceId: formData.sellerSourceId,
      },
      // Optional fields
      agentCommissionTypeId: formData.agentCommissionTypeId || undefined,
      agentCommissionValue: formData.commRate
        ? parseFloat(formData.commRate)
        : undefined,
      // Total Commission fields
      totalCommissionTypeId: formData.totalCommissionTypeId || undefined,
      totalCommissionValue: formData.totalCommissionValue
        ? parseFloat(formData.totalCommissionValue)
        : undefined,
      // Purchase status
      purchaseStatusId: formData.purchaseStatusId || undefined,
      // Additional agents if enabled
      additionalAgents: formData.hasAdditionalAgent
        ? [
            formData.additionalAgentType === "internal"
              ? {
                  agentId: formData.additionalAgentId,
                  commissionTypeId:
                    formData.agencyCommissionTypeId ||
                    formData.agentCommissionTypeId ||
                    "",
                  commissionValue: formData.agencyComm
                    ? parseFloat(formData.agencyComm)
                    : 0,
                  isInternal: true,
                }
              : {
                  externalAgentName: formData.agencyName,
                  commissionTypeId:
                    formData.agencyCommissionTypeId ||
                    formData.agentCommissionTypeId ||
                    "",
                  commissionValue: formData.agencyComm
                    ? parseFloat(formData.agencyComm)
                    : 0,
                  isInternal: false,
                },
          ]
        : undefined,
    };

    try {
      if (dealId) {
        await dealsApi.updateDeal(dealId, payload);
        toast.success("Deal Updated", {
          description: "Deal has been updated successfully!",
        });
      } else {
        await dealsApi.createDeal(payload);
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
            onClick={handleSave}
            className="gi-bg-dark-green flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isEditMode ? "Update Deal" : "Save Deal"}
          </Button>
        ) : (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            View only
          </div>
        )}
      </div>

      {isReadOnly && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900 dark:border-amber-900/30 dark:bg-amber-950/30 dark:text-amber-100">
          {currentRole === "agent" ? (
            <div className="text-sm">
              You can <span className="font-medium">create</span> deals, but
              existing deals are <span className="font-medium">view-only</span>{" "}
              for Agents.
            </div>
          ) : (
            <div className="text-sm">
              This deal is <span className="font-medium">Approved</span> and is
              now <span className="font-medium">locked</span>. Finance can edit
              only before approval.
            </div>
          )}
        </div>
      )}

      <fieldset
        disabled={isReadOnly}
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
                    <StyledDatePicker
                      id="bookingDate"
                      value={formData.bookingDate}
                      onChange={(date) => handleChange("bookingDate", date)}
                      placeholder="Select booking date"
                    />
                  </div>
                  {errors.bookingDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.bookingDate}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="cfExpiry">CF Expiry</Label>
                  <div className="mt-1">
                    <StyledDatePicker
                      id="cfExpiry"
                      value={formData.cfExpiry}
                      onChange={(date) => handleChange("cfExpiry", date)}
                      placeholder="Select CF expiry date"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="closeDate">Close Date</Label>
                  <div className="mt-1">
                    <StyledDatePicker
                      id="closeDate"
                      value={formData.closeDate}
                      onChange={(date) => handleChange("closeDate", date)}
                      placeholder="Select close date"
                    />
                  </div>
                  {errors.closeDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.closeDate}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="dealTypeId">Deal Type</Label>
                  <Select
                    value={formData.dealTypeId}
                    onValueChange={(value) => handleChange("dealTypeId", value)}
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
                  {errors.dealTypeId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.dealTypeId}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="statusId">Status</Label>
                  <Select
                    value={formData.statusId || defaultStatusId}
                    onValueChange={(value) => handleChange("statusId", value)}
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
                  {errors.statusId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.statusId}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="purchaseStatusId">Purchase Status</Label>
                  <Select
                    value={formData.purchaseStatusId}
                    onValueChange={(value) => handleChange("purchaseStatusId", value)}
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
                </div>
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
                  <Label htmlFor="developerId">Developer</Label>
                  <Select
                    value={formData.developerId}
                    onValueChange={(value) => {
                      handleChange("developerId", value);
                      // Reset project when developer changes
                      handleChange("projectId", "");
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
                  {errors.developerId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.developerId}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="projectId">Project</Label>
                  <Select
                    value={formData.projectId}
                    onValueChange={(value) => handleChange("projectId", value)}
                    disabled={filtersLoading || !formData.developerId}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredProjects.length === 0 ? (
                        <SelectItem value="__no_projects__" disabled>
                          {formData.developerId
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
                  {errors.projectId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.projectId}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="propertyName">Property Name</Label>
                  <Input
                    id="propertyName"
                    value={formData.propertyName}
                    onChange={(e) =>
                      handleChange("propertyName", e.target.value)
                    }
                    placeholder="Enter property name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="propertyTypeId">Property Type</Label>
                  <Select
                    value={formData.propertyTypeId}
                    onValueChange={(value) =>
                      handleChange("propertyTypeId", value)
                    }
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
                  {errors.propertyTypeId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.propertyTypeId}
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="unitNumber">Unit #</Label>
                <Input
                  id="unitNumber"
                  type="text"
                  value={formData.unitNumber}
                  onChange={(e) =>
                    handleNumberOnly("unitNumber", e.target.value)
                  }
                  placeholder="Enter unit number"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="unitTypeId">Unit Type</Label>
                <Select
                  value={formData.unitTypeId}
                  onValueChange={(value) => handleChange("unitTypeId", value)}
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
                {errors.unitTypeId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.unitTypeId}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="size">Size (sq.ft)</Label>
                <Input
                  id="size"
                  type="text"
                  value={formData.size}
                  onChange={(e) => handleNumberOnly("size", e.target.value)}
                  placeholder="Enter size in sq.ft"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="bedrooms">BR (Bedrooms)</Label>
                <Select
                  value={formData.bedrooms}
                  onValueChange={(value) => handleChange("bedrooms", value)}
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
              </div>
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
                    value={formData.sellerName}
                    onChange={(e) => handleChange("sellerName", e.target.value)}
                    placeholder="Enter seller name"
                    className={`mt-1 ${
                      errors.sellerName ? "border-red-500" : ""
                    }`}
                  />
                  {errors.sellerName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.sellerName}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="sellerPhone">Phone</Label>
                  <Input
                    id="sellerPhone"
                    type="tel"
                    value={formData.sellerPhone}
                    onChange={(e) =>
                      handlePhoneChange("sellerPhone", e.target.value)
                    }
                    placeholder="+971 50 123 4567"
                    className={`mt-1 ${
                      errors.sellerPhone ? "border-red-500" : ""
                    }`}
                  />
                  {errors.sellerPhone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.sellerPhone}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="sellerNationalityId">Nationality</Label>
                  <Select
                    value={formData.sellerNationalityId}
                    onValueChange={(value) =>
                      handleChange("sellerNationalityId", value)
                    }
                    disabled={filtersLoading}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      {nationalities.map((nationality) => (
                        <SelectItem key={nationality.id} value={nationality.id}>
                          {nationality.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sellerSourceId">Source</Label>
                  <Select
                    value={formData.sellerSourceId}
                    onValueChange={(value) =>
                      handleChange("sellerSourceId", value)
                    }
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
                    value={formData.buyerName}
                    onChange={(e) => handleChange("buyerName", e.target.value)}
                    placeholder="Enter buyer name"
                    className={`mt-1 ${
                      errors.buyerName ? "border-red-500" : ""
                    }`}
                  />
                  {errors.buyerName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.buyerName}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="buyerPhone">Phone</Label>
                  <Input
                    id="buyerPhone"
                    type="tel"
                    value={formData.buyerPhone}
                    onChange={(e) =>
                      handlePhoneChange("buyerPhone", e.target.value)
                    }
                    placeholder="+971 50 123 4567"
                    className={`mt-1 ${
                      errors.buyerPhone ? "border-red-500" : ""
                    }`}
                  />
                  {errors.buyerPhone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.buyerPhone}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="buyerNationalityId">Nationality</Label>
                  <Select
                    value={formData.buyerNationalityId}
                    onValueChange={(value) =>
                      handleChange("buyerNationalityId", value)
                    }
                    disabled={filtersLoading}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      {nationalities.map((nationality) => (
                        <SelectItem key={nationality.id} value={nationality.id}>
                          {nationality.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="buyerSourceId">Source</Label>
                  <Select
                    value={formData.buyerSourceId}
                    onValueChange={(value) =>
                      handleChange("buyerSourceId", value)
                    }
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
                  <Label htmlFor="salesValue">Sales Value (AED)</Label>
                  <Input
                    id="salesValue"
                    type="text"
                    value={formData.salesValue}
                    onChange={(e) =>
                      handleNumberOnly("salesValue", e.target.value)
                    }
                    placeholder="Enter sales value"
                    className={`mt-1 ${
                      errors.salesValue ? "border-red-500" : ""
                    }`}
                  />
                  {errors.salesValue && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.salesValue}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="agentCommissionTypeId">Commission Type</Label>
                  <Select
                    value={formData.agentCommissionTypeId}
                    onValueChange={(value) =>
                      handleChange("agentCommissionTypeId", value)
                    }
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
                </div>
                <div>
                  <Label htmlFor="commRate">Agent Commission Rate/Value</Label>
                  <Input
                    id="commRate"
                    type="text"
                    value={formData.commRate}
                    onChange={(e) =>
                      handleNumberOnly("commRate", e.target.value)
                    }
                    placeholder="Enter agent commission rate (%) or fixed amount"
                    className="mt-1"
                  />
                </div>

                {/* Total Commission Fields */}
                <div className="pt-4 border-t" style={{ borderColor: "var(--gi-green-40)" }}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="totalCommissionTypeId">Total Commission Type</Label>
                      <Select
                        value={formData.totalCommissionTypeId}
                        onValueChange={(value) =>
                          handleChange("totalCommissionTypeId", value)
                        }
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
                    </div>
                    <div>
                      <Label htmlFor="totalCommissionValue">Total Commission Value</Label>
                      <Input
                        id="totalCommissionValue"
                        type="text"
                        value={formData.totalCommissionValue}
                        onChange={(e) =>
                          handleNumberOnly("totalCommissionValue", e.target.value)
                        }
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
                  <Label htmlFor="hasAdditionalAgent" className="text-gray-900">
                    Additional Agent
                  </Label>
                  <Switch
                    id="hasAdditionalAgent"
                    checked={formData.hasAdditionalAgent}
                    onCheckedChange={(checked) =>
                      handleChange("hasAdditionalAgent", checked)
                    }
                  />
                </div>

                {/* Additional Agent Fields - Shown when toggle is enabled */}
                {formData.hasAdditionalAgent && (
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
                            checked={formData.additionalAgentType === "internal"}
                            onChange={(e) => handleChange("additionalAgentType", e.target.value)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">Internal Agent</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="additionalAgentType"
                            value="external"
                            checked={formData.additionalAgentType === "external"}
                            onChange={(e) => handleChange("additionalAgentType", e.target.value)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">External Agent</span>
                        </label>
                      </div>
                    </div>

                    {/* Internal Agent Selection */}
                    {formData.additionalAgentType === "internal" && (
                      <div>
                        <Label htmlFor="additionalAgentId">Select Agent</Label>
                        <Select
                          value={formData.additionalAgentId}
                          onValueChange={(value) =>
                            handleChange("additionalAgentId", value)
                          }
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
                      </div>
                    )}

                    {/* External Agent Name */}
                    {formData.additionalAgentType === "external" && (
                      <div>
                        <Label htmlFor="agencyName">Agency/Agent Name</Label>
                        <Input
                          id="agencyName"
                          value={formData.agencyName}
                          onChange={(e) =>
                            handleChange("agencyName", e.target.value)
                          }
                          placeholder="Enter agency or agent name"
                          className="mt-1"
                        />
                      </div>
                    )}

                    <div>
                      <Label htmlFor="agencyCommissionTypeId">
                        Commission Type
                      </Label>
                      <Select
                        value={formData.agencyCommissionTypeId}
                        onValueChange={(value) =>
                          handleChange("agencyCommissionTypeId", value)
                        }
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
                    </div>
                    <div>
                      <Label htmlFor="agencyComm">Commission Value</Label>
                      <Input
                        id="agencyComm"
                        type="text"
                        value={formData.agencyComm}
                        onChange={(e) =>
                          handleNumberOnly("agencyComm", e.target.value)
                        }
                        placeholder="Enter commission value"
                        className="mt-1"
                      />
                      {formData.salesValue && formData.agencyComm && (
                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded text-sm">
                          <p className="text-blue-900 dark:text-blue-100 font-semibold">
                            Commission: AED{" "}
                            {parseFloat(formData.agencyComm).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
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
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Enter any additional notes or comments..."
                rows={10}
                className="resize-none"
              />
            </CardContent>
          </Card>
        </div>
      </fieldset>

      {/* Documents & Attachments (hidden for now - backend has no attachment APIs yet) */}
    </div>
  );
}
