"use client";

import { useState } from "react";
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
import { mockDeals } from "@/lib/mockData";
import { ArrowLeft, Save, Upload } from "lucide-react";

interface DealFormProps {
  dealId: string | null;
  onBack: () => void;
  onSave: () => void;
}

export function DealForm({ dealId, onBack, onSave }: DealFormProps) {
  const existingDeal = dealId ? mockDeals.find((d) => d.id === dealId) : null;

  const [formData, setFormData] = useState({
    // Deal Information
    bookingDate: existingDeal?.dealCloseDate || "",
    cfExpiry: "",
    dealType: "",

    // Property Details
    developer: existingDeal?.developer || "",
    projectName: existingDeal?.project || "",
    propertyType: existingDeal?.propertyType || "",
    unitNumber: existingDeal?.unitNumber || "",
    unitType: existingDeal?.unitType || "",
    sizeSqFt: "",
    bedrooms: "",

    // Seller Information
    sellerName: existingDeal?.sellerName || "",
    sellerPhone: existingDeal?.sellerContact || "",
    sellerNationality: "",
    sellerSource: "",

    // Buyer Information
    buyerName: existingDeal?.buyerName || "",
    buyerPhone: existingDeal?.buyerContact || "",
    buyerNationality: "",
    buyerSource: "",

    // Commission Details
    salesValue: "",
    commRate: "",
    hasExternalAgent: false,
    agencyName: "",
    agencyComm: "",

    notes: existingDeal?.notes || "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (field: string, value: any) => {
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

  const handleSave = () => {
    // Validate phones before saving
    const newErrors: { [key: string]: string } = {};

    if (formData.sellerPhone && !validatePhone(formData.sellerPhone)) {
      newErrors.sellerPhone = "Invalid phone number format";
    }
    if (formData.buyerPhone && !validatePhone(formData.buyerPhone)) {
      newErrors.buyerPhone = "Invalid phone number format";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert("Please fix the validation errors before saving");
      return;
    }

    alert("Deal saved successfully!");
    onSave();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Deals
        </Button>
        <Button
          onClick={handleSave}
          className="gi-bg-dark-green flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save Deal
        </Button>
      </div>

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
                <Label htmlFor="dealType">Deal Type</Label>
                <Select
                  value={formData.dealType}
                  onValueChange={(value) => handleChange("dealType", value)}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select deal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Primary Sale">Primary Sale</SelectItem>
                    <SelectItem value="Secondary Sale">
                      Secondary Sale
                    </SelectItem>
                    <SelectItem value="Lease">Lease</SelectItem>
                    <SelectItem value="Off-Plan">Off-Plan</SelectItem>
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
                <Label htmlFor="developer">Developer</Label>
                <Select
                  value={formData.developer}
                  onValueChange={(value) => handleChange("developer", value)}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select developer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Emaar">Emaar Properties</SelectItem>
                    <SelectItem value="Damac">Damac Properties</SelectItem>
                    <SelectItem value="Meraas">Meraas</SelectItem>
                    <SelectItem value="Nakheel">Nakheel</SelectItem>
                    <SelectItem value="Aldar">Aldar Properties</SelectItem>
                    <SelectItem value="Dubai Properties">
                      Dubai Properties
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  value={formData.projectName}
                  onChange={(e) => handleChange("projectName", e.target.value)}
                  placeholder="Enter project name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="propertyType">Property Type</Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(value) => handleChange("propertyType", value)}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="Villa">Villa</SelectItem>
                    <SelectItem value="Townhouse">Townhouse</SelectItem>
                    <SelectItem value="Penthouse">Penthouse</SelectItem>
                    <SelectItem value="Studio">Studio</SelectItem>
                    <SelectItem value="Plot">Plot</SelectItem>
                  </SelectContent>
                </Select>
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
                onChange={(e) => handleNumberOnly("unitNumber", e.target.value)}
                placeholder="Enter unit number"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="unitType">Unit Type</Label>
              <Select
                value={formData.unitType}
                onValueChange={(value) => handleChange("unitType", value)}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select unit type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Studio">Studio</SelectItem>
                  <SelectItem value="1 BR">1 Bedroom</SelectItem>
                  <SelectItem value="2 BR">2 Bedroom</SelectItem>
                  <SelectItem value="3 BR">3 Bedroom</SelectItem>
                  <SelectItem value="4 BR">4 Bedroom</SelectItem>
                  <SelectItem value="5 BR+">5+ Bedroom</SelectItem>
                  <SelectItem value="Penthouse">Penthouse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sizeSqFt">Size (sq.ft)</Label>
              <Input
                id="sizeSqFt"
                type="text"
                value={formData.sizeSqFt}
                onChange={(e) => handleNumberOnly("sizeSqFt", e.target.value)}
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
                  className="mt-1"
                />
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
                <Label htmlFor="sellerNationality">Nationality</Label>
                <Select
                  value={formData.sellerNationality}
                  onValueChange={(value) =>
                    handleChange("sellerNationality", value)
                  }
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UAE">UAE</SelectItem>
                    <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="Pakistan">Pakistan</SelectItem>
                    <SelectItem value="Egypt">Egypt</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="USA">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sellerSource">Source</Label>
                <Select
                  value={formData.sellerSource}
                  onValueChange={(value) => handleChange("sellerSource", value)}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Direct">Direct Walk-in</SelectItem>
                    <SelectItem value="Social Media">Social Media</SelectItem>
                    <SelectItem value="Exhibition">Exhibition</SelectItem>
                    <SelectItem value="Cold Call">Cold Call</SelectItem>
                    <SelectItem value="Property Portal">
                      Property Portal
                    </SelectItem>
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
                  className="mt-1"
                />
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
                <Label htmlFor="buyerNationality">Nationality</Label>
                <Select
                  value={formData.buyerNationality}
                  onValueChange={(value) =>
                    handleChange("buyerNationality", value)
                  }
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UAE">UAE</SelectItem>
                    <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="Pakistan">Pakistan</SelectItem>
                    <SelectItem value="Egypt">Egypt</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="USA">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="buyerSource">Source</Label>
                <Select
                  value={formData.buyerSource}
                  onValueChange={(value) => handleChange("buyerSource", value)}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Direct">Direct Walk-in</SelectItem>
                    <SelectItem value="Social Media">Social Media</SelectItem>
                    <SelectItem value="Exhibition">Exhibition</SelectItem>
                    <SelectItem value="Cold Call">Cold Call</SelectItem>
                    <SelectItem value="Property Portal">
                      Property Portal
                    </SelectItem>
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
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="commRate">Commission Rate (%)</Label>
                <Input
                  id="commRate"
                  type="text"
                  value={formData.commRate}
                  onChange={(e) => handleNumberOnly("commRate", e.target.value)}
                  placeholder="Enter commission rate"
                  className="mt-1"
                />
              </div>

              {/* External Agent Toggle */}
              <div
                className="flex items-center justify-between pt-4 border-t"
                style={{ borderColor: "var(--gi-green-40)" }}
              >
                <Label htmlFor="hasExternalAgent" className="text-gray-900">
                  External Agent
                </Label>
                <Switch
                  id="hasExternalAgent"
                  checked={formData.hasExternalAgent}
                  onCheckedChange={(checked) =>
                    handleChange("hasExternalAgent", checked)
                  }
                />
              </div>

              {/* External Agent Fields - Shown when toggle is enabled */}
              {formData.hasExternalAgent && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <Label htmlFor="agencyName">Agency Name</Label>
                    <Input
                      id="agencyName"
                      value={formData.agencyName}
                      onChange={(e) =>
                        handleChange("agencyName", e.target.value)
                      }
                      placeholder="Enter agency name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="agencyComm">Agency Commission (%)</Label>
                    <Input
                      id="agencyComm"
                      type="text"
                      value={formData.agencyComm}
                      onChange={(e) =>
                        handleNumberOnly("agencyComm", e.target.value)
                      }
                      placeholder="Enter agency commission %"
                      className="mt-1"
                    />
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                      <p className="text-blue-900 mb-1">
                        <span className="font-semibold">Calculation:</span>
                      </p>
                      <p className="text-blue-800">
                        Agency Commission Amount = Sales Value × (Agency
                        Commission % / 100)
                      </p>
                      {formData.salesValue && formData.agencyComm && (
                        <p className="text-blue-900 mt-2 font-semibold">
                          = AED {formData.salesValue} × {formData.agencyComm}% =
                          AED{" "}
                          {(
                            (parseFloat(formData.salesValue) *
                              parseFloat(formData.agencyComm)) /
                            100
                          ).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      )}
                    </div>
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

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Documents & Attachments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[(--gi-dark-green)] transition-colors cursor-pointer">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                Drag and drop files here, or click to browse
              </p>
              <Button variant="outline">Choose Files</Button>
            </div>
            <div className="text-gray-600">
              <p className="mb-2">Supported documents:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Booking form</li>
                <li>Signed contract</li>
                <li>Customer ID/Passport</li>
                <li>Payment receipts</li>
                <li>Commission invoices</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
