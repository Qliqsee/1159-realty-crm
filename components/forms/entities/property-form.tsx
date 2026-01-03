"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import { Button } from "@/components/buttons/button"
import { Input } from "@/components/inputs/input"
import { Label } from "@/components/layout/label"
import { Select } from "@/components/inputs/select"
import { Textarea } from "@/components/inputs/textarea"
import { CurrencyInput } from "@/components/inputs/currency-input"
import { MultiSelect } from "@/components/inputs/multi-select"
import { MediaUpload, type MediaItem } from "@/components/inputs/media-upload"
import type { Property, PropertyType, PropertyStatus } from "@/types"

const propertySchema = z.object({
  name: z.string().min(1, "Property name is required"),
  type: z.enum(["Land", "Apartment"]),
  subtype: z.string().min(1, "Subtype is required"),
  status: z.enum(["Available", "Sold Out", "Reserved", "Disabled"]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  stateId: z.string().min(1, "State is required"),
  lgaId: z.string().min(1, "LGA is required"),
  areaId: z.string().min(1, "Area is required"),
  regularPrice: z.number().min(1, "Regular price is required"),
  marketPrice: z.number().optional(),
  discountPercentage: z.number().min(0).max(100).default(0),
  totalPlots: z.number().min(1, "Total plots is required"),
  interestRate: z.number().min(0).max(100).default(0),
  overduepenaltyRate: z.number().min(0).max(100).default(0),
  nearbyLandmarks: z.array(z.string()).default([]),
})

type PropertyFormData = z.infer<typeof propertySchema>

interface PropertyFormProps {
  initialData?: Partial<Property>
  onSubmit: (data: PropertyFormData) => void | Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export function PropertyForm({ initialData, onSubmit, onCancel, isLoading }: PropertyFormProps) {
  const [media, setMedia] = useState<MediaItem[]>([])

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: initialData?.name || "",
      type: initialData?.type || "Land",
      subtype: initialData?.subtype || "",
      status: initialData?.status || "Available",
      description: initialData?.description || "",
      stateId: initialData?.stateId || "",
      lgaId: initialData?.lgaId || "",
      areaId: initialData?.areaId || "",
      regularPrice: initialData?.regularPrice || 0,
      marketPrice: initialData?.marketPrice,
      discountPercentage: initialData?.discountPercentage || 0,
      totalPlots: initialData?.totalPlots || 0,
      interestRate: initialData?.interestRate || 0,
      overduepenaltyRate: initialData?.overduepenaltyRate || 0,
      nearbyLandmarks: initialData?.nearbyLandmarks || [],
    },
  })

  const handleFormSubmit = async (data: PropertyFormData) => {
    // Include media in the submission
    const formDataWithMedia = {
      ...data,
      media,
    }
    await onSubmit(formDataWithMedia as any)
  }

  const regularPrice = form.watch("regularPrice")
  const discountPercentage = form.watch("discountPercentage")
  const finalPrice = regularPrice - (regularPrice * discountPercentage / 100)

  const landmarkOptions = [
    { value: "school", label: "School" },
    { value: "hospital", label: "Hospital" },
    { value: "shopping", label: "Shopping Mall" },
    { value: "transport", label: "Transport Hub" },
  ]

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Property Name *</Label>
        <Input
          id="name"
          {...form.register("name")}
          placeholder="e.g., Lekki Gardens Phase 2"
        />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Property Type *</Label>
          <Select
            id="type"
            value={form.watch("type")}
            onValueChange={(value) => form.setValue("type", value as PropertyType)}
            options={[
              { value: "Land", label: "Land" },
              { value: "Apartment", label: "Apartment" },
            ]}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subtype">Subtype *</Label>
          <Input
            id="subtype"
            {...form.register("subtype")}
            placeholder="e.g., Residential, Commercial"
          />
          {form.formState.errors.subtype && (
            <p className="text-sm text-destructive">{form.formState.errors.subtype.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select
            id="status"
            value={form.watch("status")}
            onValueChange={(value) => form.setValue("status", value as PropertyStatus)}
            options={[
              { value: "Available", label: "Available" },
              { value: "Sold Out", label: "Sold Out" },
              { value: "Reserved", label: "Reserved" },
              { value: "Disabled", label: "Disabled" },
            ]}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          {...form.register("description")}
          placeholder="Detailed property description"
          rows={4}
        />
        {form.formState.errors.description && (
          <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stateId">State *</Label>
          <Select
            id="stateId"
            value={form.watch("stateId")}
            onValueChange={(value) => form.setValue("stateId", value)}
            placeholder="Select state"
            options={[
              { value: "state-1", label: "Lagos" },
              { value: "state-2", label: "Abuja" },
            ]}
            error={form.formState.errors.stateId?.message}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lgaId">LGA *</Label>
          <Select
            id="lgaId"
            value={form.watch("lgaId")}
            onValueChange={(value) => form.setValue("lgaId", value)}
            placeholder="Select LGA"
            options={[
              { value: "lga-1", label: "Ikeja" },
              { value: "lga-2", label: "Lekki" },
            ]}
            error={form.formState.errors.lgaId?.message}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="areaId">Area *</Label>
          <Select
            id="areaId"
            value={form.watch("areaId")}
            onValueChange={(value) => form.setValue("areaId", value)}
            placeholder="Select area"
            options={[
              { value: "area-1", label: "Phase 1" },
              { value: "area-2", label: "Phase 2" },
            ]}
            error={form.formState.errors.areaId?.message}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="regularPrice">Regular Price *</Label>
          <CurrencyInput
            value={form.watch("regularPrice")}
            onChange={(value) => form.setValue("regularPrice", value)}
          />
          {form.formState.errors.regularPrice && (
            <p className="text-sm text-destructive">{form.formState.errors.regularPrice.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="marketPrice">Market Price (After Payment)</Label>
          <CurrencyInput
            value={form.watch("marketPrice") || 0}
            onChange={(value) => form.setValue("marketPrice", value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="discountPercentage">Discount %</Label>
          <Input
            id="discountPercentage"
            type="number"
            step="0.01"
            min="0"
            max="100"
            {...form.register("discountPercentage", { valueAsNumber: true })}
          />
        </div>

        <div className="p-4 bg-muted rounded-lg flex items-center justify-between">
          <span className="text-sm font-medium">Final Price:</span>
          <span className="text-lg font-bold">₦{finalPrice.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="totalPlots">Total Plots *</Label>
          <Input
            id="totalPlots"
            type="number"
            min="1"
            {...form.register("totalPlots", { valueAsNumber: true })}
          />
          {form.formState.errors.totalPlots && (
            <p className="text-sm text-destructive">{form.formState.errors.totalPlots.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="interestRate">Interest Rate %</Label>
          <Input
            id="interestRate"
            type="number"
            step="0.01"
            min="0"
            max="100"
            {...form.register("interestRate", { valueAsNumber: true })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="overduepenaltyRate">Penalty Rate %</Label>
          <Input
            id="overduepenaltyRate"
            type="number"
            step="0.01"
            min="0"
            max="100"
            {...form.register("overduepenaltyRate", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Nearby Landmarks</Label>
        <MultiSelect
          options={landmarkOptions}
          value={form.watch("nearbyLandmarks")}
          onChange={(values) => form.setValue("nearbyLandmarks", values)}
          placeholder="Select landmarks"
        />
      </div>

      <div className="space-y-2">
        <Label>Property Media (Images, Videos & Links)</Label>
        <MediaUpload
          value={media}
          onChange={setMedia}
          maxItems={20}
          variant="gold"
        />
        <p className="text-xs text-muted-foreground">
          Upload images and videos, or add YouTube and Instagram Reel links to showcase your property
        </p>
      </div>

      <div className="flex justify-end gap-3">
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
  )
}
