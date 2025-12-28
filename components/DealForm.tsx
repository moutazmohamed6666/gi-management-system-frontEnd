"use client";

import { Button } from "./ui/button";
import { useFilters } from "@/lib/useFilters";
import { ArrowLeft, Save, Loader2, AlertCircle } from "lucide-react";
import { DealPreviewModal } from "./DealPreviewModal";
import { DealInformationSection } from "./deal-form/DealInformationSection";
import { PropertyDetailsSection } from "./deal-form/PropertyDetailsSection";
import { UnitDetailsSection } from "./deal-form/UnitDetailsSection";
import { BuyerSellerSection } from "./deal-form/BuyerSellerSection";
import { CommissionDetailsSection } from "./deal-form/CommissionDetailsSection";
import {
  useDealFormData,
  useDealFormDefaults,
  useDealLoader,
  useDealSubmission,
  useDealPreview,
  useDealValidation,
  useDealFormHelpers,
} from "@/lib/hooks";

interface DealFormProps {
  dealId: string | null;
  onBack: () => void;
  onSave: (createdDealId?: string) => void;
}

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
    areas,
    teams,
    isLoading: filtersLoading,
    error: filtersError,
  } = useFilters();

  // Initialize form with custom hook
  const { form, watchedFields } = useDealFormData();
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = form;

  // Get current role
  const { getCurrentRole, filteredProjects } = useDealFormHelpers({
    allProjects,
    watchedDeveloperId: watchedFields.developerId,
  });
  const currentRole = getCurrentRole();

  const isEditMode = Boolean(dealId);

  // Handle form defaults (status, commission, purchase status)
  const { defaultStatusId } = useDealFormDefaults({
    isEditMode,
    currentRole,
    statuses,
    purchaseStatuses,
    watchedBookingDate: watchedFields.bookingDate,
    setValue,
  });

  // Load deal data when editing
  const { dealError, loadedDealId, retryLoadDeal } = useDealLoader({
    dealId,
    reset,
  });

  // Handle form submission
  const {
    showPreview,
    pendingFormData,
    isSubmitting,
    isReadOnly,
    handleFormSubmit,
    handlePreviewConfirm,
    handlePreviewClose,
  } = useDealSubmission({
    dealId,
    currentRole,
    defaultStatusId,
    purchaseStatuses,
    onSave,
  });

  // Prepare preview data
  const previewData = useDealPreview({
    pendingFormData,
    defaultStatusId,
    developers,
    filteredProjects,
    dealTypes,
    statuses,
    purchaseStatuses,
    propertyTypes,
    unitTypes,
    bedrooms,
    commissionTypes,
    allAgents,
  });

  // Validation functions
  const { validatePhone, validateEmail, isValidUuid } = useDealValidation();

  // Loading and error states
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
              <Button variant="outline" onClick={retryLoadDeal}>
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
          {currentRole === "SALES_ADMIN" ? "Back to Home" : "Back to Deals"}
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
            {currentRole === "agent" ? (
              <>
                You can <span className="font-medium">create</span> deals, but
                existing deals are{" "}
                <span className="font-medium">view-only</span> for Agents.
              </>
            ) : currentRole === "compliance" ? (
              <>
                Compliance users can <span className="font-medium">view</span>{" "}
                deals and <span className="font-medium">upload media</span>, but
                cannot <span className="font-medium">edit</span> deal data.
              </>
            ) : (
              "This deal is read-only."
            )}
          </div>
        </div>
      )}

      <form id="deal-form" onSubmit={handleSubmit(handleFormSubmit)}>
        <fieldset
          disabled={isReadOnly || isSubmitting}
          className={isReadOnly ? "opacity-80" : ""}
        >
          <div className="space-y-6">
            {/* Row 1: Deal Information & Property Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DealInformationSection
                control={control}
                errors={errors}
                register={register}
                setValue={setValue}
                currentRole={
                  currentRole as
                    | "agent"
                    | "finance"
                    | "ceo"
                    | "admin"
                    | "SALES_ADMIN"
                    | "compliance"
                }
                isEditMode={isEditMode}
                defaultStatusId={defaultStatusId}
                dealTypes={dealTypes}
                statuses={statuses}
                purchaseStatuses={purchaseStatuses}
                areas={areas}
                teams={teams}
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
                watchedDeveloperId={watchedFields.developerId}
                filtersLoading={filtersLoading}
              />
            </div>

            {/* Row 2: Unit Details */}
            <div className="grid grid-cols-1 gap-6">
              <UnitDetailsSection
                control={control}
                register={register}
                errors={errors}
                setValue={setValue}
                unitTypes={unitTypes}
                bedrooms={bedrooms}
                filtersLoading={filtersLoading}
              />
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

            {/* Row 4: Commission Details */}
            <CommissionDetailsSection
              control={control}
              register={register}
              errors={errors}
              setValue={setValue}
              commissionTypes={commissionTypes}
              allAgents={allAgents}
              watchedAdditionalAgents={watchedFields.additionalAgents || []}
              currentRole={currentRole}
              filtersLoading={filtersLoading}
            />
          </div>
        </fieldset>
      </form>

      {/* Documents & Attachments (hidden for now - backend has no attachment APIs yet) */}

      {/* Preview Modal */}
      {showPreview && pendingFormData && previewData && (
        <DealPreviewModal
          isOpen={showPreview}
          onClose={handlePreviewClose}
          onConfirm={handlePreviewConfirm}
          data={previewData}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
