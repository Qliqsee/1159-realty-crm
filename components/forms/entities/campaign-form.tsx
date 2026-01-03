"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/buttons/button"
import { Input } from "@/components/inputs/input"
import { Label } from "@/components/layout/label"
import { Textarea } from "@/components/inputs/textarea"
import { MultiSelect } from "@/components/inputs/multi-select"
import type { ContactSegment } from "@/types"

const campaignSchema = z.object({
  name: z.string().min(1, "Segment name is required"),
  description: z.string().optional(),
  filterLogic: z.enum(["AND", "OR"]),
  tags: z.array(z.string()).default([]),
})

type CampaignFormData = z.infer<typeof campaignSchema>

interface CampaignFormProps {
  initialData?: Partial<ContactSegment>
  onSubmit: (data: CampaignFormData) => void | Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export function CampaignForm({ initialData, onSubmit, onCancel, isLoading }: CampaignFormProps) {
  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      filterLogic: initialData?.filterLogic || "AND",
      tags: initialData?.tags || [],
    },
  })

  const availableTags = [
    { value: "high-value", label: "High Value" },
    { value: "new-lead", label: "New Lead" },
    { value: "active", label: "Active" },
    { value: "vip", label: "VIP" },
  ]

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Segment Name *</Label>
        <Input
          id="name"
          {...form.register("name")}
          placeholder="e.g., High Value Clients"
        />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...form.register("description")}
          placeholder="Describe this contact segment"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <MultiSelect
          options={availableTags}
          selected={form.watch("tags")}
          onChange={(values) => form.setValue("tags", values)}
          placeholder="Select tags"
        />
      </div>

      <div className="p-4 border rounded-lg space-y-4">
        <h3 className="font-semibold">Filter Criteria</h3>
        <p className="text-sm text-muted-foreground">
          Add filters to automatically include contacts based on properties, location, gender, source, or other criteria.
        </p>
        <Button type="button" variant="outline" size="sm">
          Add Filter
        </Button>
      </div>

      <div className="p-4 border rounded-lg space-y-4">
        <h3 className="font-semibold">Manual Contacts</h3>
        <p className="text-sm text-muted-foreground">
          Add specific contacts manually to this segment.
        </p>
        <Button type="button" variant="outline" size="sm">
          Add Contacts
        </Button>
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Update Segment" : "Create Segment"}
        </Button>
      </div>
    </form>
  )
}
