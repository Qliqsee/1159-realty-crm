"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/buttons/button"
import { Input } from "@/components/inputs/input"
import { Label } from "@/components/layout/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/inputs/select"
import { Textarea } from "@/components/inputs/textarea"
import { CurrencyInput } from "@/components/inputs/currency-input"
import type { KYCSubmission } from "@/types"

const kycSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  identityDocumentType: z.enum(["Passport", "National ID", "Driver's License", "Voter's Card"]).optional(),
  identityDocumentNumber: z.string().optional(),
  identityDocumentStatus: z.enum(["Pending", "Approved", "Rejected", "Not Submitted"]),
  identityDocumentFeedback: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  bankDetailsStatus: z.enum(["Pending", "Approved", "Rejected", "Not Submitted"]),
  bankDetailsFeedback: z.string().optional(),
  employmentStatus: z.enum(["Employed", "Self-Employed", "Unemployed", "Student", "Retired"]).optional(),
  employerName: z.string().optional(),
  occupation: z.string().optional(),
  monthlyIncome: z.number().optional(),
  employmentStatus_DocumentStatus: z.enum(["Pending", "Approved", "Rejected", "Not Submitted"]),
  employmentFeedback: z.string().optional(),
  nextOfKinFirstName: z.string().optional(),
  nextOfKinLastName: z.string().optional(),
  nextOfKinPhone: z.string().optional(),
  nextOfKinRelationship: z.string().optional(),
  nextOfKinStatus: z.enum(["Pending", "Approved", "Rejected", "Not Submitted"]),
  nextOfKinFeedback: z.string().optional(),
  overallStatus: z.enum(["Pending", "Approved", "Rejected", "Incomplete"]),
})

type KYCFormData = z.infer<typeof kycSchema>

interface KYCReviewFormProps {
  initialData?: Partial<KYCSubmission>
  onSubmit: (data: KYCFormData) => void | Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export function KYCReviewForm({ initialData, onSubmit, onCancel, isLoading }: KYCReviewFormProps) {
  const form = useForm<KYCFormData>({
    resolver: zodResolver(kycSchema),
    defaultValues: {
      clientId: initialData?.clientId || "",
      identityDocumentType: initialData?.identityDocumentType,
      identityDocumentNumber: initialData?.identityDocumentNumber || "",
      identityDocumentStatus: initialData?.identityDocumentStatus || "Pending",
      identityDocumentFeedback: initialData?.identityDocumentFeedback || "",
      bankName: initialData?.bankName || "",
      accountNumber: initialData?.accountNumber || "",
      accountName: initialData?.accountName || "",
      bankDetailsStatus: initialData?.bankDetailsStatus || "Pending",
      bankDetailsFeedback: initialData?.bankDetailsFeedback || "",
      employmentStatus: initialData?.employmentStatus,
      employerName: initialData?.employerName || "",
      occupation: initialData?.occupation || "",
      monthlyIncome: initialData?.monthlyIncome,
      employmentStatus_DocumentStatus: initialData?.employmentStatus_DocumentStatus || "Pending",
      employmentFeedback: initialData?.employmentFeedback || "",
      nextOfKinFirstName: initialData?.nextOfKinFirstName || "",
      nextOfKinLastName: initialData?.nextOfKinLastName || "",
      nextOfKinPhone: initialData?.nextOfKinPhone || "",
      nextOfKinRelationship: initialData?.nextOfKinRelationship || "",
      nextOfKinStatus: initialData?.nextOfKinStatus || "Pending",
      nextOfKinFeedback: initialData?.nextOfKinFeedback || "",
      overallStatus: initialData?.overallStatus || "Pending",
    },
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

      {/* Identity Documents Section */}
      <div className="space-y-4 p-4 border rounded-lg">
        <h3 className="font-semibold">Identity Documents</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="identityDocumentType">Document Type</Label>
            <Select
              value={form.watch("identityDocumentType")}
              onValueChange={(value) => form.setValue("identityDocumentType", value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Passport">Passport</SelectItem>
                <SelectItem value="National ID">National ID</SelectItem>
                <SelectItem value="Driver's License">Driver's License</SelectItem>
                <SelectItem value="Voter's Card">Voter's Card</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="identityDocumentNumber">Document Number</Label>
            <Input
              id="identityDocumentNumber"
              {...form.register("identityDocumentNumber")}
              placeholder="ID number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="identityDocumentStatus">Status</Label>
            <Select
              value={form.watch("identityDocumentStatus")}
              onValueChange={(value) => form.setValue("identityDocumentStatus", value as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Not Submitted">Not Submitted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="identityDocumentFeedback">Feedback</Label>
            <Textarea
              id="identityDocumentFeedback"
              {...form.register("identityDocumentFeedback")}
              placeholder="Review feedback"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* Bank Details Section */}
      <div className="space-y-4 p-4 border rounded-lg">
        <h3 className="font-semibold">Bank Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name</Label>
            <Input
              id="bankName"
              {...form.register("bankName")}
              placeholder="Bank name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              {...form.register("accountNumber")}
              placeholder="Account number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountName">Account Name</Label>
            <Input
              id="accountName"
              {...form.register("accountName")}
              placeholder="Account name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankDetailsStatus">Status</Label>
            <Select
              value={form.watch("bankDetailsStatus")}
              onValueChange={(value) => form.setValue("bankDetailsStatus", value as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Not Submitted">Not Submitted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Overall Status */}
      <div className="space-y-2">
        <Label htmlFor="overallStatus">Overall KYC Status *</Label>
        <Select
          value={form.watch("overallStatus")}
          onValueChange={(value) => form.setValue("overallStatus", value as any)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
            <SelectItem value="Incomplete">Incomplete</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Update KYC" : "Submit KYC Review"}
        </Button>
      </div>
    </form>
  )
}
