"use client";

import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { StyledDatePicker } from "../StyledDatePicker";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { DealFormData } from "@/lib/hooks/useDealFormData";

interface DealInformationSectionProps {
  control: Control<DealFormData>;
  errors: FieldErrors<DealFormData>;
  register: UseFormRegister<DealFormData>;
  setValue: UseFormSetValue<DealFormData>;
  currentRole:
    | "agent"
    | "finance"
    | "ceo"
    | "admin"
    | "SALES_ADMIN"
    | "compliance";
  isEditMode: boolean;
  defaultStatusId: string;
  dealTypes: Array<{ id: string; name: string }>;
  statuses: Array<{ id: string; name: string }>;
  purchaseStatuses: Array<{ id: string; name: string }>;
  areas: Array<{ id: string; name: string }>;
  teams: Array<{ id: string; name: string }>;
  managers: Array<{ id: string; name: string }>;
  filtersLoading: boolean;
  isValidUuid: (value: string) => boolean;
}

export function DealInformationSection({
  control,
  errors,
  register,
  setValue,
  currentRole,
  isEditMode,
  defaultStatusId,
  dealTypes,
  statuses,
  purchaseStatuses,
  areas,
  teams,
  managers,
  filtersLoading,
  isValidUuid,
}: DealInformationSectionProps) {
  // Watch deal type to conditionally show area dropdown
  const watchedDealTypeId = useWatch({ control, name: "dealTypeId" });
  const selectedDealType = dealTypes.find(
    (type) => type.id === watchedDealTypeId
  );
  const isSecondaryDeal = selectedDealType?.name?.toLowerCase() === "secondary";

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

          {!(
            currentRole === "agent" ||
            (currentRole === "SALES_ADMIN" && !isEditMode)
          ) && (
            <div>
              <Label htmlFor="closeDate">Close Date</Label>
              <div className="mt-1">
                <Controller
                  name="closeDate"
                  control={control}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dealTypeId">Deal Type</Label>
              <Controller
                name="dealTypeId"
                control={control}
                rules={{ required: "Deal type is required" }}
                render={({ field }) => (
                  <div className="relative">
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={filtersLoading}
                    >
                      <SelectTrigger
                        className={`w-full mt-1 ${field.value ? "pr-10" : ""}`}
                      >
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
                    {field.value && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => field.onChange("")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              />
              {errors.dealTypeId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.dealTypeId.message}
                </p>
              )}
            </div>

            {isSecondaryDeal && (
              <div>
                <Label htmlFor="areaId">Area</Label>
                <Controller
                  name="areaId"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={filtersLoading}
                      >
                        <SelectTrigger
                          className={`w-full mt-1 ${
                            field.value ? "pr-10" : ""
                          }`}
                        >
                          <SelectValue placeholder="Select area" />
                        </SelectTrigger>
                        <SelectContent>
                          {areas.map((area) => (
                            <SelectItem key={area.id} value={area.id}>
                              {area.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {field.value && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => field.onChange("")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                />
              </div>
            )}
          </div>

          {!(
            currentRole === "agent" ||
            (currentRole === "SALES_ADMIN" && !isEditMode)
          ) && (
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
                  <div className="relative">
                    <Select
                      value={field.value || defaultStatusId}
                      onValueChange={field.onChange}
                      disabled={filtersLoading}
                    >
                      <SelectTrigger
                        className={`w-full mt-1 ${
                          field.value || defaultStatusId ? "pr-10" : ""
                        }`}
                      >
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
                    {(field.value || defaultStatusId) && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => field.onChange("")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
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
                  <div className="relative">
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={filtersLoading}
                    >
                      <SelectTrigger
                        className={`w-full mt-1 ${field.value ? "pr-10" : ""}`}
                      >
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
                    {field.value && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => field.onChange("")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              />
            </div>

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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="teamId">Team</Label>
              <Controller
                name="teamId"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={filtersLoading}
                    >
                      <SelectTrigger
                        className={`w-full mt-1 ${field.value ? "pr-10" : ""}`}
                      >
                        <SelectValue placeholder="Select team" />
                      </SelectTrigger>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {field.value && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => field.onChange("")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              />
            </div>

            <div>
              <Label htmlFor="managerId">
                Manager <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="managerId"
                control={control}
                rules={{ required: "Manager is required" }}
                render={({ field }) => (
                  <div className="relative">
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={filtersLoading}
                    >
                      <SelectTrigger
                        className={`w-full mt-1 ${field.value ? "pr-10" : ""}`}
                      >
                        <SelectValue placeholder="Select manager" />
                      </SelectTrigger>
                      <SelectContent>
                        {managers.map((manager) => (
                          <SelectItem key={manager.id} value={manager.id}>
                            {manager.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {field.value && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => field.onChange("")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              />
              {errors.managerId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.managerId.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
