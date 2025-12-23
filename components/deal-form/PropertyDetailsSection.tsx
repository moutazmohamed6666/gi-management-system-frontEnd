"use client";

import { Control, Controller, FieldErrors, UseFormSetValue } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { DealFormData } from "@/lib/hooks/useDealFormData";

interface PropertyDetailsSectionProps {
  control: Control<DealFormData>;
  errors: FieldErrors<DealFormData>;
  setValue: UseFormSetValue<DealFormData>;
  developers: Array<{ id: string; name: string }>;
  filteredProjects: Array<{ id: string; name: string }>;
  propertyTypes: Array<{ id: string; name: string }>;
  watchedDeveloperId: string;
  filtersLoading: boolean;
}

export function PropertyDetailsSection({
  control,
  errors,
  setValue,
  developers,
  filteredProjects,
  propertyTypes,
  watchedDeveloperId,
  filtersLoading,
}: PropertyDetailsSectionProps) {
  return (
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
            <Controller
              name="propertyName"
              control={control}
              render={({ field }) => (
                <Input
                  id="propertyName"
                  {...field}
                  placeholder="Enter property name"
                  className="mt-1"
                />
              )}
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
  );
}

