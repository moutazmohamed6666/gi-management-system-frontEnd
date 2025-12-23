"use client";

import { Control, Controller, FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
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

interface CommissionDetailsSectionProps {
  control: Control<DealFormData>;
  register: UseFormRegister<DealFormData>;
  errors: FieldErrors<DealFormData>;
  setValue: UseFormSetValue<DealFormData>;
  commissionTypes: Array<{ id: string; name: string }>;
  allAgents: Array<{ id: string; name: string }>;
  watchedHasAdditionalAgent: boolean;
  watchedAdditionalAgentType: "internal" | "external";
  watchedSalesValue: string;
  watchedAgencyComm: string;
  currentRole: "agent" | "finance" | "ceo" | "admin";
  filtersLoading: boolean;
}

export function CommissionDetailsSection({
  control,
  register,
  errors,
  setValue,
  commissionTypes,
  allAgents,
  watchedHasAdditionalAgent,
  watchedAdditionalAgentType,
  watchedSalesValue,
  watchedAgencyComm,
  currentRole,
  filtersLoading,
}: CommissionDetailsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Commission Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Sales Value */}
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
                  const numericValue = e.target.value.replace(/[^0-9]/g, "");
                  setValue("salesValue", numericValue, {
                    shouldValidate: true,
                  });
                },
              })}
              placeholder="Enter sales value"
              className={`mt-1 ${errors.salesValue ? "border-red-500" : ""}`}
            />
            {errors.salesValue && (
              <p className="text-red-500 text-sm mt-1">
                {errors.salesValue.message}
              </p>
            )}
          </div>

          {/* Total Deal Commission Section */}
          <div
            className="pt-4 border-t"
            style={{ borderColor: "var(--gi-green-40)" }}
          >
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Total Deal Commission
            </h4>
            <div className="space-y-4 bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="totalCommissionTypeId">Commission Type</Label>
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
                  <Label htmlFor="totalCommissionValue">Commission Value</Label>
                  <Input
                    id="totalCommissionValue"
                    type="text"
                    {...register("totalCommissionValue", {
                      onChange: (e) => {
                        const numericValue = e.target.value.replace(/[^0-9]/g, "");
                        setValue("totalCommissionValue", numericValue, {
                          shouldValidate: true,
                        });
                      },
                    })}
                    placeholder="Enter total commission value"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Agent Commission Section */}
          <div
            className="pt-4 border-t"
            style={{ borderColor: "var(--gi-green-40)" }}
          >
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Agent Commission
            </h4>
            <div className="space-y-4 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg">
              <div>
                <Label htmlFor="agentCommissionTypeId">Commission Type</Label>
                <Controller
                  name="agentCommissionTypeId"
                  control={control}
                  render={({ field }) => {
                    // For agents, use commission type from login unless it was programmatically changed
                    console.log("commissionTypes", commissionTypes);
                    console.log(
                      "agentCommissionTypeId field.value:",
                      field.value
                    );

                    const loginCommissionType =
                      sessionStorage.getItem("userCommissionType");
                    // For agents: prioritize field.value if it exists (programmatically set override),
                    // otherwise use login commission type
                    const effectiveValue =
                      currentRole === "agent"
                        ? field.value || loginCommissionType || ""
                        : field.value;

                    console.log("effectiveValue for Select:", effectiveValue);

                    return (
                      <Select
                        value={effectiveValue}
                        onValueChange={(value) => {
                          // Only allow changes for non-agents
                          if (currentRole !== "agent") {
                            field.onChange(value);
                          }
                        }}
                        disabled={filtersLoading || currentRole === "agent"}
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
                    );
                  }}
                />
              </div>
              <div>
                <Label htmlFor="commRate">Agent Commission Rate/Value</Label>
                <Input
                  id="commRate"
                  type="text"
                  {...register("commRate", {
                    onChange: (e) => {
                      // Allow digits and decimal point
                      let numericValue = e.target.value.replace(/[^0-9.]/g, "");
                      // Ensure only one decimal point
                      const parts = numericValue.split(".");
                      if (parts.length > 2) {
                        numericValue = parts[0] + "." + parts.slice(1).join("");
                      }
                      setValue("commRate", numericValue, {
                        shouldValidate: true,
                      });

                      // When agent commission rate/value changes, automatically select override option
                      // Only set override if there's a value and commission types are loaded
                      if (
                        numericValue &&
                        numericValue.trim() !== "" &&
                        commissionTypes.length > 0
                      ) {
                        // Find the override commission type (case-insensitive search)
                        const overrideType = commissionTypes.find((type) =>
                          type.name.toLowerCase().includes("override")
                        );

                        if (overrideType) {
                          // Set the override commission type ID
                          console.log(
                            "Setting override commission type:",
                            overrideType.id,
                            overrideType.name
                          );
                          setValue("agentCommissionTypeId", overrideType.id, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        } else {
                          console.log(
                            "Override type not found in commissionTypes:",
                            commissionTypes.map((t) => ({
                              id: t.id,
                              name: t.name,
                            }))
                          );
                        }
                      }
                    },
                  })}
                  placeholder="Enter agent commission rate (%) or fixed amount"
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
                      checked={watchedAdditionalAgentType === "internal"}
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
                      checked={watchedAdditionalAgentType === "external"}
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
                  <Label htmlFor="additionalAgentId">Select Agent</Label>
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
                <Label htmlFor="agencyCommissionTypeId">Commission Type</Label>
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
                      const numericValue = e.target.value.replace(/[^0-9]/g, "");
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
                      {parseFloat(watchedAgencyComm).toLocaleString("en-US", {
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
  );
}

