"use client";

import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
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
import { DealFormData } from "@/lib/hooks/useDealFormData";

interface BuyerSellerSectionProps {
  control: Control<DealFormData>;
  register: UseFormRegister<DealFormData>;
  errors: FieldErrors<DealFormData>;
  nationalities: Array<{ id: string; name: string }>;
  leadSources: Array<{ id: string; name: string }>;
  filtersLoading: boolean;
  validatePhone: (phone: string) => boolean;
  validateEmail: (email: string) => boolean;
}

export function BuyerSellerSection({
  control,
  register,
  errors,
  nationalities,
  leadSources,
  filtersLoading,
  validatePhone,
  validateEmail,
}: BuyerSellerSectionProps) {
  return (
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
                className={`mt-1 ${errors.sellerName ? "border-red-500" : ""}`}
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
                className={`mt-1 ${errors.sellerPhone ? "border-red-500" : ""}`}
              />
              {errors.sellerPhone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.sellerPhone.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="sellerEmail">Email (Optional)</Label>
              <Input
                id="sellerEmail"
                type="email"
                {...register("sellerEmail", {
                  validate: (value) =>
                    validateEmail(value) || "Invalid email format",
                })}
                placeholder="seller@example.com"
                className={`mt-1 ${errors.sellerEmail ? "border-red-500" : ""}`}
              />
              {errors.sellerEmail && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.sellerEmail.message}
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
                        <SelectItem key={nationality.id} value={nationality.id}>
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
                className={`mt-1 ${errors.buyerName ? "border-red-500" : ""}`}
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
                className={`mt-1 ${errors.buyerPhone ? "border-red-500" : ""}`}
              />
              {errors.buyerPhone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.buyerPhone.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="buyerEmail">Email (Optional)</Label>
              <Input
                id="buyerEmail"
                type="email"
                {...register("buyerEmail", {
                  validate: (value) =>
                    validateEmail(value) || "Invalid email format",
                })}
                placeholder="buyer@example.com"
                className={`mt-1 ${errors.buyerEmail ? "border-red-500" : ""}`}
              />
              {errors.buyerEmail && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.buyerEmail.message}
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
                        <SelectItem key={nationality.id} value={nationality.id}>
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
  );
}
