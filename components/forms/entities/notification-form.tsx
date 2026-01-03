"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/buttons/button"
import { Input } from "@/components/inputs/input"
import { Label } from "@/components/layout/label"
import { Select } from "@/components/inputs/select"
import { Textarea } from "@/components/inputs/textarea"
import { Checkbox } from "@/components/inputs/checkbox"
import { Calendar } from "@/components/inputs/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/overlays/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import type { Notification, NotificationType, NotificationChannel } from "@/types"

const notificationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  type: z.enum(["Info", "Success", "Warning", "Error"]),
  channels: z.array(z.enum(["In-App", "Email", "SMS", "WhatsApp"])).min(1, "Select at least one channel"),
  recipientType: z.enum(["Roles", "Users", "Segment", "All"]),
  recipientRoles: z.array(z.string()).optional(),
  recipientUserIds: z.array(z.string()).optional(),
  recipientSegmentId: z.string().optional(),
  scheduledFor: z.date().optional(),
})

type NotificationFormData = z.infer<typeof notificationSchema>

interface NotificationFormProps {
  initialData?: Partial<Notification>
  onSubmit: (data: NotificationFormData) => void | Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export function NotificationForm({ initialData, onSubmit, onCancel, isLoading }: NotificationFormProps) {
  const form = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: initialData?.title || "",
      message: initialData?.message || "",
      type: initialData?.type || "Info",
      channels: initialData?.channels || ["In-App"],
      recipientType: initialData?.recipientType || "All",
      recipientRoles: initialData?.recipientRoles || [],
      recipientUserIds: initialData?.recipientUserIds || [],
      recipientSegmentId: initialData?.recipientSegmentId || "",
      scheduledFor: initialData?.scheduledFor,
    },
  })

  const channels = form.watch("channels") || []
  const recipientType = form.watch("recipientType")

  const toggleChannel = (channel: NotificationChannel) => {
    const currentChannels = form.watch("channels") || []
    if (currentChannels.includes(channel)) {
      form.setValue("channels", currentChannels.filter((c) => c !== channel))
    } else {
      form.setValue("channels", [...currentChannels, channel])
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          {...form.register("title")}
          placeholder="Notification title"
        />
        {form.formState.errors.title && (
          <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          {...form.register("message")}
          placeholder="Notification message"
          rows={4}
        />
        {form.formState.errors.message && (
          <p className="text-sm text-destructive">{form.formState.errors.message.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type *</Label>
        <Select
          id="type"
          value={form.watch("type")}
          onValueChange={(value) => form.setValue("type", value as NotificationType)}
          options={[
            { value: "Info", label: "Info" },
            { value: "Success", label: "Success" },
            { value: "Warning", label: "Warning" },
            { value: "Error", label: "Error" },
          ]}
        />
      </div>

      <div className="space-y-2">
        <Label>Channels *</Label>
        <div className="space-y-2">
          {(["In-App", "Email", "SMS", "WhatsApp"] as NotificationChannel[]).map((channel) => (
            <div key={channel} className="flex items-center space-x-2">
              <Checkbox
                id={channel}
                checked={channels.includes(channel)}
                onCheckedChange={() => toggleChannel(channel)}
              />
              <Label htmlFor={channel} className="cursor-pointer">
                {channel}
              </Label>
            </div>
          ))}
        </div>
        {form.formState.errors.channels && (
          <p className="text-sm text-destructive">{form.formState.errors.channels.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="recipientType">Recipients *</Label>
        <Select
          id="recipientType"
          value={form.watch("recipientType")}
          onValueChange={(value) => form.setValue("recipientType", value as any)}
          options={[
            { value: "All", label: "All Users" },
            { value: "Roles", label: "Specific Roles" },
            { value: "Users", label: "Specific Users" },
            { value: "Segment", label: "Contact Segment" },
          ]}
        />
      </div>

      {recipientType === "Roles" && (
        <div className="space-y-2">
          <Label htmlFor="recipientRoles">Select Roles</Label>
          <Select
            id="recipientRoles"
            placeholder="Select roles"
            options={[
              { value: "Agent", label: "Agent" },
              { value: "Manager", label: "Manager" },
              { value: "Admin", label: "Admin" },
            ]}
          />
        </div>
      )}

      {recipientType === "Segment" && (
        <div className="space-y-2">
          <Label htmlFor="recipientSegmentId">Select Segment</Label>
          <Select
            id="recipientSegmentId"
            value={form.watch("recipientSegmentId")}
            onValueChange={(value) => form.setValue("recipientSegmentId", value)}
            placeholder="Select segment"
            options={[
              { value: "segment-1", label: "High Value Clients" },
              { value: "segment-2", label: "New Leads" },
            ]}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="scheduledFor">Schedule For</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {form.watch("scheduledFor") ? (
                format(form.watch("scheduledFor")!, "PPP")
              ) : (
                <span>Send now or schedule for later</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={form.watch("scheduledFor")}
              onSelect={(date) => form.setValue("scheduledFor", date)}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : form.watch("scheduledFor") ? "Schedule Notification" : "Send Now"}
        </Button>
      </div>
    </form>
  )
}
