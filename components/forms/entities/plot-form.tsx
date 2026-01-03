"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/buttons/button"
import { Input } from "@/components/inputs/input"
import { Label } from "@/components/layout/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/inputs/select"
import { Checkbox } from "@/components/inputs/checkbox"
import type { Plot, PlotStatus } from "@/types"

const plotSchema = z.object({
  coordinate: z.string().min(1, "Plot ID/Coordinate is required"),
  size: z.string().min(1, "Size is required"),
  byRoadSide: z.boolean().default(false),
  status: z.enum(["AVAILABLE", "SOLD", "ARCHIVED"]),
})

type PlotFormData = z.infer<typeof plotSchema>

interface PlotFormProps {
  initialData?: Partial<Plot>
  onSubmit: (data: PlotFormData) => void | Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export function PlotForm({ initialData, onSubmit, onCancel, isLoading }: PlotFormProps) {
  const form = useForm<PlotFormData>({
    resolver: zodResolver(plotSchema),
    defaultValues: {
      coordinate: initialData?.coordinate || "",
      size: initialData?.size || "",
      byRoadSide: initialData?.byRoadSide || false,
      status: initialData?.status || "AVAILABLE",
    },
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="coordinate">Plot ID / Coordinate *</Label>
        <Input
          id="coordinate"
          {...form.register("coordinate")}
          placeholder="e.g., A-101 or 6.5244, 3.3792"
        />
        {form.formState.errors.coordinate && (
          <p className="text-sm text-destructive">{form.formState.errors.coordinate.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="size">Size *</Label>
        <Input
          id="size"
          {...form.register("size")}
          placeholder="e.g., 500 sqm, 1000 sqm"
        />
        {form.formState.errors.size && (
          <p className="text-sm text-destructive">{form.formState.errors.size.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <Select
          value={form.watch("status")}
          onValueChange={(value) => form.setValue("status", value as PlotStatus)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AVAILABLE">Available</SelectItem>
            <SelectItem value="SOLD">Sold</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="byRoadSide"
          checked={form.watch("byRoadSide")}
          onCheckedChange={(checked) => form.setValue("byRoadSide", checked === true)}
        />
        <Label htmlFor="byRoadSide" className="cursor-pointer">
          By Road Side
        </Label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Update Plot" : "Add Plot"}
        </Button>
      </div>
    </form>
  )
}
