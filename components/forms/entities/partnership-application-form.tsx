"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
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
          <Label htmlFor="status">Status *</Label>
          <Select
            value={form.watch("status")}
            onValueChange={(value) => form.setValue("status", value as PartnershipApplicationStatus)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Under Review">Under Review</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
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
            value={form.watch("linkedAgentId")}
            onValueChange={(value) => form.setValue("linkedAgentId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="agent-1">Agent 1</SelectItem>
              <SelectItem value="agent-2">Agent 2</SelectItem>
            </SelectContent>
          </Select>
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
