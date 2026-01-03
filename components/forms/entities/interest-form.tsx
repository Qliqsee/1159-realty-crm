"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
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
            value={form.watch("clientId")}
            onValueChange={(value) => form.setValue("clientId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="client-1">Sample Client 1</SelectItem>
              <SelectItem value="client-2">Sample Client 2</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.clientId && (
            <p className="text-sm text-destructive">{form.formState.errors.clientId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="propertyId">Property *</Label>
          <Select
            value={form.watch("propertyId")}
            onValueChange={(value) => form.setValue("propertyId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select property" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="property-1">Sample Property 1</SelectItem>
              <SelectItem value="property-2">Sample Property 2</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.propertyId && (
            <p className="text-sm text-destructive">{form.formState.errors.propertyId.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <Select
          value={form.watch("status")}
          onValueChange={(value) => form.setValue("status", value as "New" | "Contacted" | "Converted" | "Lost")}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="Contacted">Contacted</SelectItem>
            <SelectItem value="Converted">Converted</SelectItem>
            <SelectItem value="Lost">Lost</SelectItem>
          </SelectContent>
        </Select>
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
