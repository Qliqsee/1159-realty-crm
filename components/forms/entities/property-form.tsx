"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/buttons/button";
import { Input, InputWithAddon } from "@/components/inputs/input";
import { Label } from "@/components/layout/label";
import { Select } from "@/components/inputs/select";
import { Textarea } from "@/components/inputs/textarea";
import { CurrencyInput } from "@/components/inputs/currency-input";
import { MediaUpload, type MediaItem } from "@/components/inputs/media-upload";
import { Checkbox } from "@/components/inputs/checkbox";
import { Separator } from "@/components/display/separator";
import {
  type Property,
  type PropertyType,
  type PropertyStatus,
  type PropertyFeature,
  PROPERTY_TYPES,
  PROPERTY_STATUS,
  LAND_SUBTYPES,
  COUNTRIES,
  PROPERTY_FEATURE_ICONS,
} from "@/types";
import * as Icons from "lucide-react";
import { toast } from "sonner";

// Validation Schema
const propertySchema = z
  .object({
    // Basic Information
    name: z.string().min(1, "This field is required"),
    type: z.enum(["Land", "Apartment"]),
    subtype: z.string().min(1, "This field is required"),
    status: z.enum(["Available", "Pre-launch", "Sold Out", "Reserved", "Disabled"]),
    description: z.string().min(10, "Description must be at least 10 characters"),

    // Conditional Fields
    agriculturalFee: z
      .object({
        amount: z.number().min(0),
        isActive: z.boolean(),
      })
      .optional(),
    requiredDocuments: z.array(z.string()).default([]),

    // Location
    country: z.enum(["Nigeria", "Others"]),
    state: z.string().optional(),
    address: z.string().min(1, "This field is required"),
    nearbyLandmark: z.string().min(1, "This field is required"),

    // Features
    features: z
      .array(
        z.object({
          name: z.string(),
          icon: z.string(),
        })
      )
      .default([]),

    // Unit Pricing
    unitPricing: z
      .array(
        z.object({
          unit: z.string().min(1, "This field is required"),
          regularPrice: z.number().min(1, "Price must be greater than 0"),
          prelaunchPrice: z.number().min(1, "Price must be greater than 0"),
        })
      )
      .min(1, "Add at least one unit pricing"),

    // Discount
    salesDiscount: z
      .object({
        percentage: z.number().min(0).max(100),
        isActive: z.boolean(),
      })
      .optional(),

    // Payment Terms
    overdueInterestRate: z.number().min(0),
    paymentCycle: z.number().min(1),

    // Payment Plans
    paymentPlans: z
      .array(
        z.object({
          durationMonths: z.number().min(1, "Duration must be at least 1 month"),
          interestRate: z.number().min(0).max(100),
        })
      )
      .min(1, "Add at least one payment plan"),

    // Map Configuration
    mapConfig: z
      .object({
        src: z.string().url("Invalid URL").optional().or(z.literal("")),
        width: z.string().optional(),
        height: z.string().optional(),
      })
      .optional(),
  })
  .refine(
    (data) => {
      // State is required if country is Nigeria
      if (data.country === "Nigeria" && !data.state) {
        return false;
      }
      return true;
    },
    {
      message: "This field is required",
      path: ["state"],
    }
  );

type PropertyFormData = z.infer<typeof propertySchema>;

interface PropertyFormProps {
  initialData?: Partial<Property>;
  onSubmit: (data: PropertyFormData & { media: MediaItem[] }) => void | Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function PropertyForm({ initialData, onSubmit, onCancel, isLoading }: PropertyFormProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [mediaError, setMediaError] = useState<string>("");

  // Clear media error when media is added
  useEffect(() => {
    if (media.length > 0 && mediaError) {
      setMediaError("");
    }
  }, [media]);

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema) as any,
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      name: initialData?.name || "",
      type: initialData?.type || "Land",
      subtype: initialData?.subtype || "",
      status: initialData?.status || "Available",
      description: initialData?.description || "",
      agriculturalFee: initialData?.agriculturalFee || { amount: 0, isActive: true },
      requiredDocuments: [],
      country: initialData?.country || "Nigeria",
      state: initialData?.state || "",
      address: initialData?.address || "",
      nearbyLandmark: initialData?.nearbyLandmark || "",
      features: [],
      unitPricing: initialData?.unitPricing || [{ unit: "", regularPrice: 0, prelaunchPrice: 0 }],
      salesDiscount: initialData?.salesDiscount || { percentage: 0, isActive: false },
      overdueInterestRate: initialData?.overdueInterestRate || 1.5,
      paymentCycle: initialData?.paymentCycle || 32,
      paymentPlans: initialData?.paymentPlans || [{ durationMonths: 0, interestRate: 0 }],
      mapConfig: initialData?.mapConfig || { src: "", width: "600", height: "450" },
    },
  });

  const {
    fields: unitPricingFields,
    append: appendUnitPricing,
    remove: removeUnitPricing,
  } = useFieldArray({
    control: form.control,
    name: "unitPricing",
  });

  const {
    fields: paymentPlansFields,
    append: appendPaymentPlan,
    remove: removePaymentPlan,
  } = useFieldArray({
    control: form.control,
    name: "paymentPlans",
  });

  const [features, setFeatures] = useState<PropertyFeature[]>(initialData?.features || []);
  const [requiredDocuments, setRequiredDocuments] = useState<string[]>(initialData?.requiredDocuments || []);

  const watchType = form.watch("type");
  const watchSubtype = form.watch("subtype");
  const watchCountry = form.watch("country");
  const watchSalesDiscountActive = form.watch("salesDiscount.isActive");
  const watchAgriculturalFeeActive = form.watch("agriculturalFee.isActive");

  // Reset subtype when type changes
  useEffect(() => {
    form.setValue("subtype", "");
  }, [watchType]);

  const handleFormSubmit = async (data: PropertyFormData) => {
    // Validate media
    if (media.length === 0) {
      setMediaError("Add at least one media item");
      toast.error("Please complete all required fields");
      return;
    }

    setMediaError("");

    try {
      await onSubmit({ ...data, features, requiredDocuments, media });
    } catch (error) {
      toast.error("Failed to save property");
    }
  };

  const handleInvalidSubmit = (errors: any) => {
    console.log("Form validation errors:", errors);

    // Check media validation
    if (media.length === 0) {
      setMediaError("Add at least one media item");
    }

    // Check which section has errors
    const errorFields = Object.keys(errors);
    if (errorFields.length > 0) {
      toast.error("Please complete all required fields");
    }
  };

  const propertyTypeOptions = PROPERTY_TYPES.map((type) => ({ value: type, label: type }));
  const propertyStatusOptions = PROPERTY_STATUS.map((status) => ({ value: status, label: status }));
  const countryOptions = COUNTRIES.map((country) => ({ value: country, label: country }));
  const landSubtypeOptions = LAND_SUBTYPES.map((subtype) => ({ value: subtype, label: subtype }));

  // Nigerian states (simplified - you can expand this)
  const nigerianStates = [
    "Lagos",
    "Abuja",
    "Kano",
    "Rivers",
    "Oyo",
    "Kaduna",
    "Enugu",
    "Anambra",
    "Delta",
    "Edo",
    "Ogun",
    "Ondo",
    "Osun",
    "Ekiti",
  ].map((state) => ({ value: state, label: state }));

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit, handleInvalidSubmit)} noValidate className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Basic Information</h3>

        <div className="space-y-2">
          <Label htmlFor="name">Property Name *</Label>
          <Input
            id="name"
            {...form.register("name")}
            placeholder="e.g., Lekki Gardens Phase 2"
            error={form.formState.errors.name?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Property Type *</Label>
            <Controller
              name="type"
              control={form.control}
              render={({ field }) => (
                <Select
                  id="type"
                  value={field.value}
                  onValueChange={field.onChange}
                  options={propertyTypeOptions}
                  error={form.formState.errors.type?.message}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtype">Property Subtype *</Label>
            {watchType === "Land" ? (
              <Controller
                name="subtype"
                control={form.control}
                render={({ field }) => (
                  <Select
                    id="subtype"
                    value={field.value}
                    onValueChange={field.onChange}
                    options={landSubtypeOptions}
                    placeholder="Select subtype"
                    error={form.formState.errors.subtype?.message}
                  />
                )}
              />
            ) : (
              <Input
                id="subtype"
                {...form.register("subtype")}
                placeholder="e.g., Bungalow, Duplex, Self-contained"
                error={form.formState.errors.subtype?.message}
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Controller
              name="status"
              control={form.control}
              render={({ field }) => (
                <Select
                  id="status"
                  value={field.value}
                  onValueChange={field.onChange}
                  options={propertyStatusOptions}
                  error={form.formState.errors.status?.message}
                />
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Property Description *</Label>
          <Textarea
            id="description"
            {...form.register("description")}
            placeholder="Detailed property description"
            rows={4}
            error={form.formState.errors.description?.message}
          />
        </div>

        {/* Agricultural Fee - only for Farmland subtype */}
        {watchSubtype === "Farmland" && (
          <div className="space-y-2 p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Controller
                name="agriculturalFee.isActive"
                control={form.control}
                render={({ field }) => (
                  <Checkbox id="agriculturalFeeActive" checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
              <Label htmlFor="agriculturalFeeActive">Apply Agricultural Fee</Label>
            </div>

            {watchAgriculturalFeeActive && (
              <div className="space-y-2">
                <Label htmlFor="agriculturalFeeAmount">Agricultural Fee Amount</Label>
                <Controller
                  name="agriculturalFee.amount"
                  control={form.control}
                  render={({ field }) => (
                    <CurrencyInput
                      value={field.value || 0}
                      onChange={field.onChange}
                      placeholder="0.00"
                      error={form.formState.errors.agriculturalFee?.amount?.message}
                    />
                  )}
                />
              </div>
            )}
          </div>
        )}

        {/* Required Documents */}
        <div className="space-y-2">
          <Label>Required Documents</Label>
          <div className="space-y-2">
            {requiredDocuments.map((doc, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={doc}
                  onChange={(e) => {
                    const newDocs = [...requiredDocuments];
                    newDocs[index] = e.target.value;
                    setRequiredDocuments(newDocs);
                  }}
                  placeholder="Document name"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setRequiredDocuments(requiredDocuments.filter((_, i) => i !== index))}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setRequiredDocuments([...requiredDocuments, ""])}>
              <Plus className="h-4 w-4 mr-2" />
              Add Document
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Location */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Location</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <Controller
              name="country"
              control={form.control}
              render={({ field }) => (
                <Select
                  id="country"
                  value={field.value}
                  onValueChange={field.onChange}
                  options={countryOptions}
                  error={form.formState.errors.country?.message}
                />
              )}
            />
          </div>

          {watchCountry === "Nigeria" && (
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Controller
                name="state"
                control={form.control}
                render={({ field }) => (
                  <Select
                    id="state"
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    options={nigerianStates}
                    placeholder="Select state"
                    error={form.formState.errors.state?.message}
                  />
                )}
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address *</Label>
          <Textarea
            id="address"
            {...form.register("address")}
            placeholder="Full property address"
            rows={3}
            error={form.formState.errors.address?.message}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nearbyLandmark">Nearby Landmark *</Label>
          <Textarea
            id="nearbyLandmark"
            {...form.register("nearbyLandmark")}
            placeholder="Describe nearby landmarks"
            rows={2}
            error={form.formState.errors.nearbyLandmark?.message}
          />
        </div>
      </div>

      <Separator />

      {/* Features */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Features</h3>
        <div className="space-y-3">
          {features.map((feature, index) => {
            const IconComponent = Icons[feature.icon as keyof typeof Icons] as React.ComponentType<any>;

            return (
              <div key={index} className="flex gap-2">
                <div className="space-y-2 flex-1">
                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      value={feature.icon}
                      onValueChange={(value) => {
                        const newFeatures = [...features];
                        newFeatures[index].icon = value;
                        setFeatures(newFeatures);
                      }}
                      options={PROPERTY_FEATURE_ICONS.map((icon) => ({
                        value: icon.value,
                        label: icon.label,
                      }))}
                      placeholder="Select icon"
                    />
                    <Input
                      value={feature.name}
                      onChange={(e) => {
                        const newFeatures = [...features];
                        newFeatures[index].name = e.target.value;
                        setFeatures(newFeatures);
                      }}
                      placeholder="Feature name"
                    />
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  {IconComponent && (
                    <div className="h-10 w-10 rounded-md border flex items-center justify-center text-muted-foreground">
                      <IconComponent className="h-4 w-4" />
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setFeatures(features.filter((_, i) => i !== index))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setFeatures([...features, { name: "", icon: "Home" }])}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Feature
          </Button>
        </div>
      </div>

      <Separator />

      {/* Unit Pricing */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Unit Configurations & Pricing *</h3>
        <p className="text-sm text-muted-foreground">Define different unit types/sizes with their pricing</p>
        <div className="space-y-4">
          {unitPricingFields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Unit {index + 1}</h4>
                {unitPricingFields.length > 1 && (
                  <Button type="button" variant="outline" size="sm" onClick={() => removeUnitPricing(index)}>
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`unitPricing.${index}.unit`}>Unit Name/Size *</Label>
                <Input
                  id={`unitPricing.${index}.unit`}
                  {...form.register(`unitPricing.${index}.unit` as const)}
                  placeholder="e.g., 440 sqm, 2 bedroom bungalow"
                  error={form.formState.errors.unitPricing?.[index]?.unit?.message}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`unitPricing.${index}.regularPrice`}>Regular Price *</Label>
                  <Controller
                    name={`unitPricing.${index}.regularPrice` as const}
                    control={form.control}
                    render={({ field }) => (
                      <CurrencyInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="0.00"
                        error={form.formState.errors.unitPricing?.[index]?.regularPrice?.message}
                      />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`unitPricing.${index}.prelaunchPrice`}>Pre-launch Price *</Label>
                  <Controller
                    name={`unitPricing.${index}.prelaunchPrice` as const}
                    control={form.control}
                    render={({ field }) => (
                      <CurrencyInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="0.00"
                        error={form.formState.errors.unitPricing?.[index]?.prelaunchPrice?.message}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => appendUnitPricing({ unit: "", regularPrice: 0, prelaunchPrice: 0 })}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Unit Configuration
          </Button>
        </div>
        {form.formState.errors.unitPricing?.root && (
          <p className="text-sm text-red-600">{form.formState.errors.unitPricing.root.message}</p>
        )}
      </div>

      <Separator />

      {/* Sales Discount */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Sales Discount</h3>
        <div className="p-4 border rounded-lg space-y-3">
          <div className="flex items-center gap-2">
            <Controller
              name="salesDiscount.isActive"
              control={form.control}
              render={({ field }) => <Checkbox id="salesDiscountActive" checked={field.value} onCheckedChange={field.onChange} />}
            />
            <Label htmlFor="salesDiscountActive">Apply Sales Discount</Label>
          </div>

          {watchSalesDiscountActive && (
            <div className="space-y-2">
              <Label htmlFor="salesDiscountPercentage">Discount Percentage</Label>
              <Controller
                name="salesDiscount.percentage"
                control={form.control}
                render={({ field }) => (
                  <InputWithAddon
                    id="salesDiscountPercentage"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={field.value}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    suffix="%"
                  />
                )}
              />
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Payment Terms */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Payment Terms</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="overdueInterestRate">Overdue Interest Rate * (Default: 1.5%)</Label>
            <Controller
              name="overdueInterestRate"
              control={form.control}
              render={({ field }) => (
                <InputWithAddon
                  id="overdueInterestRate"
                  type="number"
                  step="0.01"
                  min="0"
                  value={field.value}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  suffix="%"
                  error={form.formState.errors.overdueInterestRate?.message}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentCycle">Payment Cycle * (Default: 32 days)</Label>
            <Controller
              name="paymentCycle"
              control={form.control}
              render={({ field }) => (
                <InputWithAddon
                  id="paymentCycle"
                  type="number"
                  min="1"
                  value={field.value}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  suffix="days"
                  error={form.formState.errors.paymentCycle?.message}
                />
              )}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Payment Plans */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Payment Plans *</h3>
        <p className="text-sm text-muted-foreground">Define installment payment plans with duration and interest rates</p>
        <div className="space-y-4">
          {paymentPlansFields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Plan {index + 1}</h4>
                {paymentPlansFields.length > 1 && (
                  <Button type="button" variant="outline" size="sm" onClick={() => removePaymentPlan(index)}>
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`paymentPlans.${index}.durationMonths`}>Duration *</Label>
                  <Controller
                    name={`paymentPlans.${index}.durationMonths` as const}
                    control={form.control}
                    render={({ field }) => (
                      <InputWithAddon
                        id={`paymentPlans.${index}.durationMonths`}
                        type="number"
                        min="1"
                        value={field.value}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        suffix="months"
                        error={form.formState.errors.paymentPlans?.[index]?.durationMonths?.message}
                      />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`paymentPlans.${index}.interestRate`}>Interest Rate *</Label>
                  <Controller
                    name={`paymentPlans.${index}.interestRate` as const}
                    control={form.control}
                    render={({ field }) => (
                      <InputWithAddon
                        id={`paymentPlans.${index}.interestRate`}
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={field.value}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        suffix="%"
                        error={form.formState.errors.paymentPlans?.[index]?.interestRate?.message}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => appendPaymentPlan({ durationMonths: 0, interestRate: 0 })}>
            <Plus className="h-4 w-4 mr-2" />
            Add Payment Plan
          </Button>
        </div>
        {form.formState.errors.paymentPlans?.root && (
          <p className="text-sm text-red-600">{form.formState.errors.paymentPlans.root.message}</p>
        )}
      </div>

      <Separator />

      {/* Map Configuration */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Map Configuration (Optional)</h3>
        <p className="text-sm text-muted-foreground">Paste the Google Maps embed code fields</p>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="mapSrc">Map Embed URL</Label>
            <Input
              id="mapSrc"
              {...form.register("mapConfig.src")}
              placeholder="https://www.google.com/maps/embed?pb=..."
              error={form.formState.errors.mapConfig?.src?.message}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mapWidth">Width (px)</Label>
              <Input id="mapWidth" {...form.register("mapConfig.width")} placeholder="600" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mapHeight">Height (px)</Label>
              <Input id="mapHeight" {...form.register("mapConfig.height")} placeholder="450" />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Media */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Property Media *</h3>
        <MediaUpload
          value={media}
          onChange={setMedia}
          maxItems={20}
          variant="gold"
          error={mediaError}
          helperText="Upload images and videos, or add YouTube and Instagram Reel links"
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Update Property" : "Create Property"}
        </Button>
      </div>
    </form>
  );
}
