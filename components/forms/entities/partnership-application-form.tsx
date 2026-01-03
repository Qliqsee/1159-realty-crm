"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/buttons/button"
import { Input } from "@/components/inputs/input"
import { Label } from "@/components/layout/label"
import { Select } from "@/components/inputs/select"
import { Textarea } from "@/components/inputs/textarea"
import { Upload } from "lucide-react"
import type { PartnershipApplication, PartnershipApplicationStatus } from "@/types"

const partnershipSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  status: z.enum(["Pending", "Under Review", "Approved", "Rejected"]),
  motivation: z.string().min(10, "Please provide motivation (min 10 characters)"),
  experience: z.string().optional(),
  referralNetwork: z.string().optional(),
  linkedAgentId: z.string().optional(),
  rejectionReason: z.string().optional(),
})

type PartnershipFormData = z.infer<typeof partnershipSchema>

interface PartnershipApplicationFormProps {
  initialData?: Partial<PartnershipApplication>
  onSubmit: (data: PartnershipFormData) => void | Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export function PartnershipApplicationForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading
}: PartnershipApplicationFormProps) {
  const form = useForm<PartnershipFormData>({
    resolver: zodResolver(partnershipSchema),
    defaultValues: {
      clientId: initialData?.clientId || "",
      status: initialData?.status || "Pending",
      motivation: initialData?.motivation || "",
      experience: initialData?.experience || "",
      referralNetwork: initialData?.referralNetwork || "",
      linkedAgentId: initialData?.linkedAgentId || "",
      rejectionReason: initialData?.rejectionReason || "",
    },
  })

  const status = form.watch("status")

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
          <Label htmlFor="status">Status *</Label>
          <Select
            id="status"
            value={form.watch("status")}
            onValueChange={(value) => form.setValue("status", value as PartnershipApplicationStatus)}
            options={[
              { value: "Pending", label: "Pending" },
              { value: "Under Review", label: "Under Review" },
              { value: "Approved", label: "Approved" },
              { value: "Rejected", label: "Rejected" },
            ]}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="motivation">Motivation *</Label>
        <Textarea
          id="motivation"
          {...form.register("motivation")}
          placeholder="Why do you want to become a partner?"
          rows={4}
        />
        {form.formState.errors.motivation && (
          <p className="text-sm text-destructive">{form.formState.errors.motivation.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience">Experience</Label>
        <Textarea
          id="experience"
          {...form.register("experience")}
          placeholder="Relevant experience in real estate or sales"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="referralNetwork">Referral Network</Label>
        <Textarea
          id="referralNetwork"
          {...form.register("referralNetwork")}
          placeholder="Describe your network and referral capabilities"
          rows={3}
        />
      </div>

      {status === "Approved" && (
        <div className="space-y-2">
          <Label htmlFor="linkedAgentId">Assigned Agent</Label>
          <Select
            id="linkedAgentId"
            value={form.watch("linkedAgentId")}
            onValueChange={(value) => form.setValue("linkedAgentId", value)}
            placeholder="Select agent"
            options={[
              { value: "agent-1", label: "Agent 1" },
              { value: "agent-2", label: "Agent 2" },
            ]}
          />
        </div>
      )}

      {status === "Rejected" && (
        <div className="space-y-2">
          <Label htmlFor="rejectionReason">Rejection Reason *</Label>
          <Textarea
            id="rejectionReason"
            {...form.register("rejectionReason")}
            placeholder="Reason for rejection"
            rows={3}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label>Supporting Documents</Label>
        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Click to upload or drag and drop</p>
          <p className="text-xs text-muted-foreground">PDF, PNG, JPG (max 5MB each)</p>
          <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" multiple />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Update Application" : "Submit Application"}
        </Button>
      </div>
    </form>
  )
}
