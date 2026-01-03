"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/buttons/button"
import { Input } from "@/components/inputs/input"
import { Label } from "@/components/layout/label"
import { Select } from "@/components/inputs/select"
import type { State, LGA, Area, LocationStatus } from "@/types"

const locationSchema = z.object({
  locationType: z.enum(["State", "LGA", "Area"]),
  name: z.string().min(1, "Name is required"),
  code: z.string().optional(),
  stateId: z.string().optional(),
  lgaId: z.string().optional(),
  status: z.enum(["Active", "Inactive"]),
})

type LocationFormData = z.infer<typeof locationSchema>

interface LocationFormProps {
  initialData?: Partial<State | LGA | Area>
  locationType?: "State" | "LGA" | "Area"
  onSubmit: (data: LocationFormData) => void | Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export function LocationForm({ initialData, locationType = "State", onSubmit, onCancel, isLoading }: LocationFormProps) {
  const form = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      locationType: locationType,
      name: initialData?.name || "",
      code: (initialData as State)?.code || "",
      stateId: (initialData as LGA | Area)?.stateId || "",
      lgaId: (initialData as Area)?.lgaId || "",
      status: initialData?.status || "Active",
    },
  })

  const currentLocationType = form.watch("locationType")

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="locationType">Location Type *</Label>
        <Select
          id="locationType"
          value={form.watch("locationType")}
          onValueChange={(value) => form.setValue("locationType", value as "State" | "LGA" | "Area")}
          options={[
            { value: "State", label: "State" },
            { value: "LGA", label: "LGA (Local Government Area)" },
            { value: "Area", label: "Area" },
          ]}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">
          {currentLocationType === "State" ? "State Name" :
           currentLocationType === "LGA" ? "LGA Name" : "Area Name"} *
        </Label>
        <Input
          id="name"
          {...form.register("name")}
          placeholder={`Enter ${currentLocationType.toLowerCase()} name`}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
        )}
      </div>

      {currentLocationType === "State" && (
        <div className="space-y-2">
          <Label htmlFor="code">State Code</Label>
          <Input
            id="code"
            {...form.register("code")}
            placeholder="e.g., LA for Lagos"
            maxLength={2}
          />
        </div>
      )}

      {(currentLocationType === "LGA" || currentLocationType === "Area") && (
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
              { value: "state-3", label: "Rivers" },
            ]}
          />
        </div>
      )}

      {currentLocationType === "Area" && (
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
              { value: "lga-3", label: "Victoria Island" },
            ]}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <Select
          id="status"
          value={form.watch("status")}
          onValueChange={(value) => form.setValue("status", value as LocationStatus)}
          options={[
            { value: "Active", label: "Active" },
            { value: "Inactive", label: "Inactive" },
          ]}
        />
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? `Update ${currentLocationType}` : `Create ${currentLocationType}`}
        </Button>
      </div>
    </form>
  )
}
