"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/buttons/button"
import { Input } from "@/components/inputs/input"
import { Label } from "@/components/layout/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/inputs/select"
import { Textarea } from "@/components/inputs/textarea"
import { Upload } from "lucide-react"
import type { SupportTicket, TicketCategory, TicketPriority, TicketStatus } from "@/types"

const ticketSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  subject: z.string().min(1, "Subject is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(["Technical", "Billing", "General", "Property", "Payment", "Account", "Other"]),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]),
  status: z.enum(["Open", "In Progress", "Resolved", "Closed"]),
  assignedTo: z.string().optional(),
})

type TicketFormData = z.infer<typeof ticketSchema>

interface SupportTicketFormProps {
  initialData?: Partial<SupportTicket>
  onSubmit: (data: TicketFormData) => void | Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export function SupportTicketForm({ initialData, onSubmit, onCancel, isLoading }: SupportTicketFormProps) {
  const form = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      clientId: initialData?.clientId || "",
      subject: initialData?.subject || "",
      description: initialData?.description || "",
      category: initialData?.category || "General",
      priority: initialData?.priority || "Medium",
      status: initialData?.status || "Open",
      assignedTo: initialData?.assignedTo || "",
    },
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        <Label htmlFor="subject">Subject *</Label>
        <Input
          id="subject"
          {...form.register("subject")}
          placeholder="Brief description of the issue"
        />
        {form.formState.errors.subject && (
          <p className="text-sm text-destructive">{form.formState.errors.subject.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          {...form.register("description")}
          placeholder="Detailed description of the issue"
          rows={5}
        />
        {form.formState.errors.description && (
          <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={form.watch("category")}
            onValueChange={(value) => form.setValue("category", value as TicketCategory)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Technical">Technical</SelectItem>
              <SelectItem value="Billing">Billing</SelectItem>
              <SelectItem value="General">General</SelectItem>
              <SelectItem value="Property">Property</SelectItem>
              <SelectItem value="Payment">Payment</SelectItem>
              <SelectItem value="Account">Account</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority *</Label>
          <Select
            value={form.watch("priority")}
            onValueChange={(value) => form.setValue("priority", value as TicketPriority)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select
            value={form.watch("status")}
            onValueChange={(value) => form.setValue("status", value as TicketStatus)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="assignedTo">Assigned To</Label>
          <Select
            value={form.watch("assignedTo")}
            onValueChange={(value) => form.setValue("assignedTo", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Unassigned" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="support-1">Support Agent 1</SelectItem>
              <SelectItem value="support-2">Support Agent 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Attachments</Label>
        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Click to upload or drag and drop</p>
          <p className="text-xs text-muted-foreground">Images, PDFs, Documents (max 5MB each)</p>
          <input type="file" className="hidden" multiple />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Update Ticket" : "Create Ticket"}
        </Button>
      </div>
    </form>
  )
}
