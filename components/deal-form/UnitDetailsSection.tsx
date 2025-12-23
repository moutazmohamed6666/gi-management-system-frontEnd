"use client";

import { Control, Controller, FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

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

interface UnitDetailsSectionProps {
  control: Control<DealFormData>;
  register: UseFormRegister<DealFormData>;
  errors: FieldErrors<DealFormData>;
  setValue: UseFormSetValue<DealFormData>;
  unitTypes: Array<{ id: string; name: string }>;
  bedrooms: Array<{ id: string; name: string }>;
  filtersLoading: boolean;
}

export function UnitDetailsSection({
  control,
  register,
  errors,
  setValue,
  unitTypes,
  bedrooms,
  filtersLoading,
}: UnitDetailsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Unit Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <Label htmlFor="unitNumber">Unit #</Label>
            <Input
              id="unitNumber"
              type="text"
              {...register("unitNumber", {
                onChange: (e) => {
                  const numericValue = e.target.value.replace(/[^0-9]/g, "");
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
                  const numericValue = e.target.value.replace(/[^0-9]/g, "");
                  setValue("size", numericValue, {
                    shouldValidate: true,
                  });
                },
              })}
              placeholder="Enter size in sq.ft"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="bedroomsId">Bedrooms</Label>
            <Controller
              name="bedroomsId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={filtersLoading}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select bedrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    {bedrooms.map((bedroom) => (
                      <SelectItem key={bedroom.id} value={bedroom.id}>
                        {bedroom.name}
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
  );
}

