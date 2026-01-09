"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/buttons/button"
import { Input } from "@/components/inputs/input"
import { Label } from "@/components/layout/label"
import { Select } from "@/components/inputs/select"
import type { Unit, UnitStatus } from "@/types"

const unitSchema = z.object({
  unitId: z.string().min(1, "Unit ID is required"),
  unit: z.string().min(1, "Unit is required"),
  coordinate: z.string().min(1, "Coordinate is required"),
  feature: z.string().optional(),
  status: z.enum(["AVAILABLE", "SOLD", "RESERVED", "ARCHIVED"]),
})

type UnitFormData = z.infer<typeof unitSchema>

interface UnitFormProps {
  initialData?: Partial<Unit>
  onSubmit: (data: UnitFormData) => void | Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export function UnitForm({ initialData, onSubmit, onCancel, isLoading }: UnitFormProps) {
  const form = useForm<UnitFormData>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      unitId: initialData?.unitId || "",
      unit: initialData?.unit || "",
      coordinate: initialData?.coordinate || "",
      feature: initialData?.feature || "",
      status: initialData?.status || "AVAILABLE",
    },
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="unitId">Unit ID *</Label>
        <Input
          id="unitId"
          {...form.register("unitId")}
          placeholder="e.g., A-101, B-202"
        />
        {form.formState.errors.unitId && (
          <p className="text-sm text-destructive">{form.formState.errors.unitId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="unit">Unit *</Label>
        <Input
          id="unit"
          {...form.register("unit")}
          placeholder="e.g., 500 sqm, 1000 sqm"
        />
        {form.formState.errors.unit && (
          <p className="text-sm text-destructive">{form.formState.errors.unit.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="coordinate">Coordinate *</Label>
        <Input
          id="coordinate"
          {...form.register("coordinate")}
          placeholder="e.g., 6.5244, 3.3792"
        />
        {form.formState.errors.coordinate && (
          <p className="text-sm text-destructive">{form.formState.errors.coordinate.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="feature">Feature</Label>
        <Input
          id="feature"
          {...form.register("feature")}
          placeholder="e.g., Roadside, River view, Gym nearby"
        />
        {form.formState.errors.feature && (
          <p className="text-sm text-destructive">{form.formState.errors.feature.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <Select
          id="status"
          value={form.watch("status")}
          onValueChange={(value) => form.setValue("status", value as UnitStatus)}
          options={[
            { value: "AVAILABLE", label: "Available" },
            { value: "SOLD", label: "Sold" },
            { value: "RESERVED", label: "Reserved" },
            { value: "ARCHIVED", label: "Archived" },
          ]}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Update Unit" : "Add Unit"}
        </Button>
      </div>
    </form>
  )
}
