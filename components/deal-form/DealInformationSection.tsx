"use client";

import { Control, Controller, FieldErrors } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { StyledDatePicker } from "../StyledDatePicker";

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

interface DealInformationSectionProps {
  control: Control<DealFormData>;
  errors: FieldErrors<DealFormData>;
  currentRole: "agent" | "finance" | "ceo" | "admin";
  isEditMode: boolean;
  defaultStatusId: string;
  dealTypes: Array<{ id: string; name: string }>;
  statuses: Array<{ id: string; name: string }>;
  purchaseStatuses: Array<{ id: string; name: string }>;
  filtersLoading: boolean;
  isValidUuid: (value: string) => boolean;
}

export function DealInformationSection({
  control,
  errors,
  currentRole,
  isEditMode,
  defaultStatusId,
  dealTypes,
  statuses,
  purchaseStatuses,
  filtersLoading,
  isValidUuid,
}: DealInformationSectionProps) {
  return (
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

