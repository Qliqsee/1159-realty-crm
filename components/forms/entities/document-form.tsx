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
import type { DocumentGroup, DocumentGroupType } from "@/types"

const documentSchema = z.object({
  name: z.string().min(1, "Group name is required"),
  description: z.string().optional(),
  type: z.enum(["Property", "Client", "General"]),
  propertyId: z.string().optional(),
  clientId: z.string().optional(),
})

type DocumentFormData = z.infer<typeof documentSchema>

interface DocumentFormProps {
  initialData?: Partial<DocumentGroup>
  onSubmit: (data: DocumentFormData) => void | Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export function DocumentForm({ initialData, onSubmit, onCancel, isLoading }: DocumentFormProps) {
  const form = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      type: initialData?.type || "General",
      propertyId: initialData?.propertyId || "",
      clientId: initialData?.clientId || "",
    },
  })

  const documentType = form.watch("type")

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Document Group Name *</Label>
        <Input
          id="name"
          {...form.register("name")}
          placeholder="e.g., Property Legal Documents"
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
          placeholder="Describe this document group"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Group Type *</Label>
        <Select
          id="type"
          value={form.watch("type")}
          onValueChange={(value) => form.setValue("type", value as DocumentGroupType)}
          options={[
            { value: "General", label: "General" },
            { value: "Property", label: "Property-Specific" },
            { value: "Client", label: "Client-Specific" },
          ]}
        />
      </div>

      {documentType === "Property" && (
        <div className="space-y-2">
          <Label htmlFor="propertyId">Property</Label>
          <Select
            id="propertyId"
            value={form.watch("propertyId")}
            onValueChange={(value) => form.setValue("propertyId", value)}
            placeholder="Select property"
            options={[
              { value: "property-1", label: "Sample Property 1" },
              { value: "property-2", label: "Sample Property 2" },
            ]}
          />
        </div>
      )}

      {documentType === "Client" && (
        <div className="space-y-2">
          <Label htmlFor="clientId">Client</Label>
          <Select
            id="clientId"
            value={form.watch("clientId")}
            onValueChange={(value) => form.setValue("clientId", value)}
            placeholder="Select client"
            options={[
              { value: "client-1", label: "Sample Client 1" },
              { value: "client-2", label: "Sample Client 2" },
            ]}
          />
        </div>
      )}

      <div className="space-y-4 p-4 border rounded-lg">
        <h3 className="font-semibold">Reference Documents</h3>
        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Click to upload documents</p>
          <p className="text-xs text-muted-foreground">PDF, DOC, DOCX (max 10MB each)</p>
          <input type="file" className="hidden" accept=".pdf,.doc,.docx" multiple />
        </div>
      </div>

      <div className="space-y-4 p-4 border rounded-lg">
        <h3 className="font-semibold">Tutorial Videos</h3>
        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Click to upload videos</p>
          <p className="text-xs text-muted-foreground">MP4, AVI (max 50MB each)</p>
          <input type="file" className="hidden" accept=".mp4,.avi,.mov" multiple />
        </div>
      </div>

      <div className="space-y-4 p-4 border rounded-lg">
        <h3 className="font-semibold">Required Client Documents</h3>
        <p className="text-sm text-muted-foreground">
          Specify documents that clients need to upload for this group.
        </p>
        <Button type="button" variant="outline" size="sm">
          Add Required Document
        </Button>
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Update Document Group" : "Create Document Group"}
        </Button>
      </div>
    </form>
  )
}
