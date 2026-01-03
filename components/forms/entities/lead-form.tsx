"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/buttons/button"
import { Input } from "@/components/inputs/input"
import { Label } from "@/components/layout/label"
import { Select } from "@/components/inputs/select"
import { Textarea } from "@/components/inputs/textarea"
import { PhoneInput } from "@/components/inputs/phone-input"
import { MultiSelect } from "@/components/inputs/multi-select"
import type { Lead, LeadStatus, LeadSource } from "@/types"

const leadSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  alternatePhone: z.string().optional(),
  status: z.enum(["New", "Contacted", "Qualified", "Converted", "Lost"]),
  source: z.enum(["Website", "Social Media", "Referral", "Agent", "Partner", "Walk-in", "Phone Call", "Email", "Advertisement", "Event", "Other"]),
  sourceDetails: z.string().optional(),
  assignedAgentId: z.string().optional(),
  tags: z.array(z.string()).default([]),
  followUpDate: z.date().optional(),
  interestedProperties: z.array(z.string()).default([]),
})

type LeadFormData = z.infer<typeof leadSchema>

interface LeadFormProps {
  initialData?: Partial<Lead>
  onSubmit: (data: LeadFormData) => void | Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export function LeadForm({ initialData, onSubmit, onCancel, isLoading }: LeadFormProps) {
  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      alternatePhone: initialData?.alternatePhone || "",
      status: initialData?.status || "New",
      source: initialData?.source || "Website",
      sourceDetails: initialData?.sourceDetails || "",
      assignedAgentId: initialData?.assignedAgentId || "",
      tags: initialData?.tags || [],
      interestedProperties: initialData?.interestedProperties || [],
    },
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            {...form.register("firstName")}
            placeholder="Enter first name"
          />
          {form.formState.errors.firstName && (
            <p className="text-sm text-destructive">{form.formState.errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            {...form.register("lastName")}
            placeholder="Enter last name"
          />
          {form.formState.errors.lastName && (
            <p className="text-sm text-destructive">{form.formState.errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...form.register("email")}
            placeholder="email@example.com"
          />
          {form.formState.errors.email && (
            <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <PhoneInput
            value={form.watch("phone")}
            onChange={(value) => form.setValue("phone", value)}
          />
          {form.formState.errors.phone && (
            <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="alternatePhone">Alternate Phone</Label>
        <PhoneInput
          value={form.watch("alternatePhone") || ""}
          onChange={(value) => form.setValue("alternatePhone", value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select
            id="status"
            value={form.watch("status")}
            onValueChange={(value) => form.setValue("status", value as LeadStatus)}
            options={[
              { value: "New", label: "New" },
              { value: "Contacted", label: "Contacted" },
              { value: "Qualified", label: "Qualified" },
              { value: "Converted", label: "Converted" },
              { value: "Lost", label: "Lost" },
            ]}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="source">Source *</Label>
          <Select
            id="source"
            value={form.watch("source")}
            onValueChange={(value) => form.setValue("source", value as LeadSource)}
            options={[
              { value: "Website", label: "Website" },
              { value: "Social Media", label: "Social Media" },
              { value: "Referral", label: "Referral" },
              { value: "Agent", label: "Agent" },
              { value: "Partner", label: "Partner" },
              { value: "Walk-in", label: "Walk-in" },
              { value: "Phone Call", label: "Phone Call" },
              { value: "Email", label: "Email" },
              { value: "Advertisement", label: "Advertisement" },
              { value: "Event", label: "Event" },
              { value: "Other", label: "Other" },
            ]}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sourceDetails">Source Details</Label>
        <Textarea
          id="sourceDetails"
          {...form.register("sourceDetails")}
          placeholder="Additional details about the lead source"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Update Lead" : "Create Lead"}
        </Button>
      </div>
    </form>
  )
}
