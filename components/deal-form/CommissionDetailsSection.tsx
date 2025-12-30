"use client";

import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Plus, X } from "lucide-react";
import { AdditionalAgent, DealFormData } from "@/lib/hooks/useDealFormData";
import { memo, useCallback, useMemo, useState, useEffect } from "react";

interface CommissionDetailsSectionProps {
  control: Control<DealFormData>;
  register: UseFormRegister<DealFormData>;
  errors: FieldErrors<DealFormData>;
  setValue: UseFormSetValue<DealFormData>;
  commissionTypes: Array<{ id: string; name: string }>;
  allAgents: Array<{ id: string; name: string }>;
  watchedAdditionalAgents: AdditionalAgent[];
  currentRole:
    | "agent"
    | "finance"
    | "ceo"
    | "admin"
    | "SALES_ADMIN"
    | "compliance";
  filtersLoading: boolean;
}

interface AdditionalAgentItemProps {
  index: number;
  agent: AdditionalAgent;
  control: Control<DealFormData>;
  commissionTypes: Array<{ id: string; name: string }>;
  allAgents: Array<{ id: string; name: string }>;
  filtersLoading: boolean;
  onRemove: (index: number) => void;
}

// Memoized component for individual additional agent item
const AdditionalAgentItem = memo<AdditionalAgentItemProps>(
  ({
    index,
    agent,
    control,
    commissionTypes,
    allAgents,
    filtersLoading,
    onRemove,
  }) => {
    const handleRemove = useCallback(() => {
      onRemove(index);
    }, [index, onRemove]);

    return (
      <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {/* Header with Remove Button */}
        <div className="flex items-center justify-between">
          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Agent #{index + 1}
          </h5>
          <Button
            type="button"
            onClick={handleRemove}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Agent Type Selection */}
        <div>
          <Label className="mb-2 block">Agent Type</Label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <Controller
                name={`additionalAgents.${index}.type`}
                control={control}
                render={({ field }) => (
                  <input
                    type="radio"
                    name={`additionalAgentType-${index}`}
                    value="internal"
                    checked={field.value === "internal"}
                    onChange={() => field.onChange("internal")}
                    className="w-4 h-4"
                  />
                )}
              />
              <span className="text-sm">Internal Agent</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Controller
                name={`additionalAgents.${index}.type`}
                control={control}
                render={({ field }) => (
                  <input
                    type="radio"
                    name={`additionalAgentType-${index}`}
                    value="external"
                    checked={field.value === "external"}
                    onChange={() => field.onChange("external")}
                    className="w-4 h-4"
                  />
                )}
              />
              <span className="text-sm">External Agent</span>
            </label>
          </div>
        </div>

        {/* Internal Agent Selection */}
        {agent.type === "internal" && (
          <div>
            <Label htmlFor={`additionalAgentId-${index}`}>Select Agent</Label>
            <Controller
              name={`additionalAgents.${index}.agentId`}
              control={control}
              render={({ field }) => (
                <div className="relative mt-1">
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    disabled={filtersLoading}
                  >
                    <SelectTrigger
                      className={`w-full ${field.value ? "pr-10" : ""}`}
                    >
                      <SelectValue placeholder="Select internal agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {allAgents.map((a) => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.name}
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

        {/* External Agent Name */}
        {agent.type === "external" && (
          <div>
            <Label htmlFor={`agencyName-${index}`}>Agency/Agent Name</Label>
            <Controller
              name={`additionalAgents.${index}.agencyName`}
              control={control}
              render={({ field }) => (
                <Input
                  id={`agencyName-${index}`}
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder="Enter agency or agent name"
                  className="mt-1"
                />
              )}
            />
          </div>
        )}

        {/* Commission Type */}
        <div>
          <Label htmlFor={`commissionTypeId-${index}`}>Commission Type</Label>
          <Controller
            name={`additionalAgents.${index}.commissionTypeId`}
            control={control}
            render={({ field }) => (
              <div className="relative mt-1">
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  disabled={filtersLoading}
                >
                  <SelectTrigger
                    className={`w-full ${field.value ? "pr-10" : ""}`}
                  >
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

        {/* Commission Value */}
        <div>
          <Label htmlFor={`commissionValue-${index}`}>Commission Rate</Label>
          <Controller
            name={`additionalAgents.${index}.commissionValue`}
            control={control}
            render={({ field }) => (
              <DebouncedCommissionInput
                id={`commissionValue-${index}`}
                value={field.value || ""}
                onChange={field.onChange}
                onClear={() => field.onChange("")}
                disabled={filtersLoading}
                commissionTypes={commissionTypes}
                commissionTypeId={agent.commissionTypeId}
              />
            )}
          />
        </div>
      </div>
    );
  }
);

AdditionalAgentItem.displayName = "AdditionalAgentItem";

// Optimized input component with debouncing
interface DebouncedCommissionInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  disabled: boolean;
  id: string;
  commissionTypes: Array<{ id: string; name: string }>;
  commissionTypeId: string;
}

const DebouncedCommissionInput = memo<DebouncedCommissionInputProps>(
  ({
    value,
    onChange,
    onClear,
    disabled,
    id,
    commissionTypes,
    commissionTypeId,
  }) => {
    const [localValue, setLocalValue] = useState(value);

    // Sync local state with external value changes
    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    // Debounced update
    useEffect(() => {
      const timer = setTimeout(() => {
        if (localValue !== value) {
          onChange(localValue);
        }
      }, 0);

      return () => clearTimeout(timer);
    }, [localValue, value, onChange]);

    const sanitizeValue = useCallback((input: string) => {
      let numericValue = input.replace(/[^0-9.]/g, "");
      const parts = numericValue.split(".");
      if (parts.length > 2) {
        numericValue = parts[0] + "." + parts.slice(1).join("");
      }
      return numericValue;
    }, []);

    const handleChange = useCallback(
      (input: string) => {
        const sanitized = sanitizeValue(input);
        setLocalValue(sanitized);
      },
      [sanitizeValue]
    );

    const handleClear = useCallback(() => {
      setLocalValue("");
      onClear();
    }, [onClear]);

    // Get commission type name
    const commissionTypeName = useMemo(() => {
      const type = commissionTypes.find((t) => t.id === commissionTypeId);
      return type?.name || "";
    }, [commissionTypes, commissionTypeId]);

    const isPercentage = commissionTypeName
      .toLowerCase()
      .includes("percentage");

    return (
      <>
        <div className="relative mt-1">
          <Input
            id={id}
            type="text"
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            placeholder="Enter commission rate"
            className={localValue ? "pr-10" : ""}
          />
          {localValue && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {localValue && commissionTypeId && (
          <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded text-sm">
            <p className="text-blue-900 dark:text-blue-100 font-semibold">
              Commission: {localValue}
              {isPercentage ? "%" : ` (${commissionTypeName})`}
            </p>
          </div>
        )}
      </>
    );
  }
);

DebouncedCommissionInput.displayName = "DebouncedCommissionInput";

// Simple debounced input without commission type display
interface SimpleDebouncedInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  disabled: boolean;
  id: string;
  placeholder: string;
  className?: string;
}

const SimpleDebouncedInput = memo<SimpleDebouncedInputProps>(
  ({ value, onChange, onClear, disabled, id, placeholder, className }) => {
    const [localValue, setLocalValue] = useState(value);

    // Sync local state with external value changes
    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    // Debounced update
    useEffect(() => {
      const timer = setTimeout(() => {
        if (localValue !== value) {
          onChange(localValue);
        }
      }, 0);

      return () => clearTimeout(timer);
    }, [localValue, value, onChange]);

    const sanitizeValue = useCallback((input: string) => {
      let numericValue = input.replace(/[^0-9.]/g, "");
      const parts = numericValue.split(".");
      if (parts.length > 2) {
        numericValue = parts[0] + "." + parts.slice(1).join("");
      }
      return numericValue;
    }, []);

    const handleChange = useCallback(
      (input: string) => {
        const sanitized = sanitizeValue(input);
        setLocalValue(sanitized);
      },
      [sanitizeValue]
    );

    const handleClear = useCallback(() => {
      setLocalValue("");
      onClear();
    }, [onClear]);

    return (
      <div className="relative">
        <Input
          id={id}
          type="text"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className={className}
        />
        {localValue && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }
);

SimpleDebouncedInput.displayName = "SimpleDebouncedInput";

export function CommissionDetailsSection({
  control,
  register,
  errors,
  setValue,
  commissionTypes,
  allAgents,
  watchedAdditionalAgents,
  currentRole,
  filtersLoading,
}: CommissionDetailsSectionProps) {
  // Memoize percentage type lookup
  const percentageTypeId = useMemo(() => {
    const percentageType = commissionTypes.find((type) =>
      type.name.toLowerCase().includes("percentage")
    );
    return percentageType?.id || "";
  }, [commissionTypes]);

  const addAdditionalAgent = useCallback(() => {
    const newAgent: AdditionalAgent = {
      type: "external",
      agentId: "",
      agencyName: "",
      commissionValue: "",
      commissionTypeId: percentageTypeId,
    };
    setValue("additionalAgents", [...watchedAdditionalAgents, newAgent], {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [watchedAdditionalAgents, setValue, percentageTypeId]);

  const removeAdditionalAgent = useCallback(
    (index: number) => {
      const updated = watchedAdditionalAgents.filter((_, i) => i !== index);
      setValue("additionalAgents", updated, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [watchedAdditionalAgents, setValue]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commission Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 ">
          {/* Sales Value */}
          <div className="flex flex-row w-full space-x-4">
            <div className="flex-1 ">
              <Label htmlFor="salesValue">
                Sales Value (AED) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="salesValue"
                type="text"
                {...register("salesValue", {
                  required: "Sales value is required",
                  onChange: (e) => {
                    let numericValue = e.target.value.replace(/[^0-9.]/g, "");
                    const parts = numericValue.split(".");
                    if (parts.length > 2) {
                      numericValue = parts[0] + "." + parts.slice(1).join("");
                    }
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
            <div className="flex-1">
              <Label htmlFor="topup">Top Up (Optional)</Label>
              <Input
                id="topup"
                type="text"
                {...register("topup", {
                  onChange: (e) => {
                    let numericValue = e.target.value.replace(/[^0-9.]/g, "");
                    const parts = numericValue.split(".");
                    if (parts.length > 2) {
                      numericValue = parts[0] + "." + parts.slice(1).join("");
                    }
                    setValue("topup", numericValue, {
                      shouldValidate: true,
                    });
                  },
                })}
                placeholder="Enter top up amount"
                className="mt-1"
              />
            </div>
          </div>

          {/* Top Up Field */}

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
                  <Label htmlFor="totalCommissionValue">Commission Value</Label>
                  <Input
                    id="totalCommissionValue"
                    type="text"
                    {...register("totalCommissionValue", {
                      onChange: (e) => {
                        let numericValue = e.target.value.replace(
                          /[^0-9.]/g,
                          ""
                        );
                        const parts = numericValue.split(".");
                        if (parts.length > 2) {
                          numericValue =
                            parts[0] + "." + parts.slice(1).join("");
                        }
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
              {currentRole === "SALES_ADMIN" && (
                <div>
                  <Label htmlFor="agentId">
                    Agent <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="agentId"
                    control={control}
                    rules={{
                      required: "Agent selection is required for Sales Admin",
                    }}
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
                            <SelectValue placeholder="Select an agent" />
                          </SelectTrigger>
                          <SelectContent>
                            {allAgents.map((agent) => (
                              <SelectItem key={agent.id} value={agent.id}>
                                {agent.name}
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
                  {errors.agentId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.agentId.message}
                    </p>
                  )}
                </div>
              )}
              <div>
                <Label htmlFor="agentCommissionTypeId">Commission Type</Label>
                <Controller
                  name="agentCommissionTypeId"
                  control={control}
                  render={({ field }) => {
                    const loginCommissionType =
                      sessionStorage.getItem("userCommissionType");
                    // Use field.value if it exists (including programmatic updates), otherwise fallback to loginCommissionType
                    const effectiveValue =
                      currentRole === "agent"
                        ? field.value || loginCommissionType || ""
                        : field.value;

                    return (
                      <div className="relative">
                        <Select
                          value={effectiveValue}
                          onValueChange={(value) => {
                            // Allow programmatic changes but prevent manual user changes for agents
                            field.onChange(value);
                          }}
                        >
                          <SelectTrigger
                            className={`w-full mt-1 ${
                              effectiveValue ? "pr-10" : ""
                            }`}
                          >
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
                        {effectiveValue && currentRole !== "agent" && (
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
                    );
                  }}
                />
              </div>
              <div>
                <Label htmlFor="commRate">Agent Commission Rate</Label>
                <Controller
                  name="commRate"
                  control={control}
                  render={({ field }) => (
                    <SimpleDebouncedInput
                      id="commRate"
                      value={field.value || ""}
                      onChange={field.onChange}
                      onClear={() => {
                        field.onChange("");
                        setValue("agentCommissionTypeId", "", {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                      disabled={filtersLoading}
                      placeholder="Enter commission rate"
                      className={`mt-1 ${field.value ? "pr-10" : ""}`}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Additional Agents Section */}
          <div
            className="pt-4 border-t"
            style={{ borderColor: "var(--gi-green-40)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Additional Agents
              </h4>
              <Button
                type="button"
                onClick={addAdditionalAgent}
                size="sm"
                variant="outline"
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Agent
              </Button>
            </div>

            {watchedAdditionalAgents.length === 0 ? (
              <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                No additional agents added. Click &quot;Add Agent&quot; to
                include another agent.
              </div>
            ) : (
              <div className="space-y-4">
                {watchedAdditionalAgents.map((agent, index) => (
                  <AdditionalAgentItem
                    key={index}
                    index={index}
                    agent={agent}
                    control={control}
                    commissionTypes={commissionTypes}
                    allAgents={allAgents}
                    filtersLoading={filtersLoading}
                    onRemove={removeAdditionalAgent}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Additional Notes Section */}
          <div
            className="pt-4 border-t"
            style={{ borderColor: "var(--gi-green-40)" }}
          >
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Additional Notes
            </h4>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Enter any additional notes or comments..."
              rows={4}
              className="resize-none"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
