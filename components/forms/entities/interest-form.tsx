"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/buttons/button"
import { Label } from "@/components/layout/label"
import { Select } from "@/components/inputs/select"
import { Textarea } from "@/components/inputs/textarea"
import type { ClientInterest } from "@/types"

const interestSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  propertyId: z.string().min(1, "Property is required"),
  message: z.string().optional(),
  status: z.enum(["New", "Contacted", "Converted", "Lost"]),
})

type InterestFormData = z.infer<typeof interestSchema>

interface InterestFormProps {
  initialData?: Partial<ClientInterest>
  onSubmit: (data: InterestFormData) => void | Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export function InterestForm({ initialData, onSubmit, onCancel, isLoading }: InterestFormProps) {
  const form = useForm<InterestFormData>({
    resolver: zodResolver(interestSchema),
    defaultValues: {
      clientId: initialData?.clientId || "",
      propertyId: initialData?.propertyId || "",
      message: initialData?.message || "",
      status: initialData?.status || "New",
    },
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="clientId">Client *</Label>
          <Select
            id="clientId"
            value={form.watch("clientId")}
            onValueChange={(value) => form.setValue("clientId", value)}
            placeholder="Select client"
            options={[
              { value: "client-1", label: "Sample Client 1" },
              { value: "client-2", label: "Sample Client 2" },
            ]}
            error={form.formState.errors.clientId?.message}
          />
        </div>

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
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <Select
          id="status"
          value={form.watch("status")}
          onValueChange={(value) => form.setValue("status", value as "New" | "Contacted" | "Converted" | "Lost")}
          options={[
            { value: "New", label: "New" },
            { value: "Contacted", label: "Contacted" },
            { value: "Converted", label: "Converted" },
            { value: "Lost", label: "Lost" },
          ]}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          {...form.register("message")}
          placeholder="Client's interest message or notes"
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
          {isLoading ? "Saving..." : initialData ? "Update Interest" : "Create Interest"}
        </Button>
      </div>
    </form>
  )
}
