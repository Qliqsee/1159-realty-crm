"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/buttons/button"
import { Input } from "@/components/inputs/input"
import { Label } from "@/components/layout/label"
import { Select } from "@/components/inputs/select"
import { Textarea } from "@/components/inputs/textarea"
import { Calendar } from "@/components/inputs/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/overlays/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import type { Appointment } from "@/types"

const appointmentSchema = z.object({
  propertyId: z.string().min(1, "Property is required"),
  inspectionDate: z.date({
    required_error: "Inspection date is required",
  }),
  inspectionTime: z.string().min(1, "Inspection time is required"),
  location: z.string().min(1, "Location is required"),
  propertyAddress: z.string().min(1, "Property address is required"),
  maxCapacity: z.number().min(1, "Max capacity must be at least 1"),
  status: z.enum(["Scheduled", "Completed", "Cancelled"]),
  notes: z.string().optional(),
})

type AppointmentFormData = z.infer<typeof appointmentSchema>

interface AppointmentFormProps {
  initialData?: Partial<Appointment>
  onSubmit: (data: AppointmentFormData) => void | Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export function AppointmentForm({ initialData, onSubmit, onCancel, isLoading }: AppointmentFormProps) {
  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      propertyId: initialData?.propertyId || "",
      inspectionDate: initialData?.inspectionDate,
      inspectionTime: initialData?.inspectionTime || "",
      location: initialData?.location || "",
      propertyAddress: initialData?.propertyAddress || "",
      maxCapacity: initialData?.maxCapacity || 10,
      status: initialData?.status || "Scheduled",
      notes: initialData?.notes || "",
    },
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="propertyId">Property *</Label>
        <Select
          id="propertyId"
          value={form.watch("propertyId")}
          onValueChange={(value) => form.setValue("propertyId", value)}
          placeholder="Select property"
          options={[
            { value: "property-1", label: "Sample Property 1" },
            { value: "property-2", label: "Sample Property 2" },
          ]}
          error={form.formState.errors.propertyId?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="inspectionDate">Inspection Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.watch("inspectionDate") ? (
                  format(form.watch("inspectionDate"), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={form.watch("inspectionDate")}
                onSelect={(date) => form.setValue("inspectionDate", date!)}
              />
            </PopoverContent>
          </Popover>
          {form.formState.errors.inspectionDate && (
            <p className="text-sm text-destructive">{form.formState.errors.inspectionDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="inspectionTime">Inspection Time *</Label>
          <Input
            id="inspectionTime"
            type="time"
            {...form.register("inspectionTime")}
          />
          {form.formState.errors.inspectionTime && (
            <p className="text-sm text-destructive">{form.formState.errors.inspectionTime.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location *</Label>
        <Input
          id="location"
          {...form.register("location")}
          placeholder="Meeting location"
        />
        {form.formState.errors.location && (
          <p className="text-sm text-destructive">{form.formState.errors.location.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="propertyAddress">Property Address *</Label>
        <Input
          id="propertyAddress"
          {...form.register("propertyAddress")}
          placeholder="Full property address"
        />
        {form.formState.errors.propertyAddress && (
          <p className="text-sm text-destructive">{form.formState.errors.propertyAddress.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="maxCapacity">Max Capacity *</Label>
          <Input
            id="maxCapacity"
            type="number"
            min="1"
            {...form.register("maxCapacity", { valueAsNumber: true })}
          />
          {form.formState.errors.maxCapacity && (
            <p className="text-sm text-destructive">{form.formState.errors.maxCapacity.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select
            id="status"
            value={form.watch("status")}
            onValueChange={(value) => form.setValue("status", value as "Scheduled" | "Completed" | "Cancelled")}
            options={[
              { value: "Scheduled", label: "Scheduled" },
              { value: "Completed", label: "Completed" },
              { value: "Cancelled", label: "Cancelled" },
            ]}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...form.register("notes")}
          placeholder="Additional notes or instructions"
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Update Appointment" : "Create Appointment"}
        </Button>
      </div>
    </form>
  )
}
