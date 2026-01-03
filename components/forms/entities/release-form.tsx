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
import type { Release, ReleaseType, ReleaseStatus } from "@/types"

const releaseSchema = z.object({
  type: z.enum(["Commission", "Revocation"]),
  recipientId: z.string().min(1, "Recipient is required"),
  recipientType: z.enum(["Agent", "Partner", "Client"]).optional(),
  amount: z.number().min(0.01, "Amount is required"),
  currency: z.string().default("NGN"),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  reason: z.string().min(1, "Reason is required"),
  description: z.string().optional(),
  status: z.enum(["Submitted", "Pending", "Paid"]),
  paymentMethod: z.string().optional(),
  paymentReference: z.string().optional(),
  notes: z.string().optional(),
})

type ReleaseFormData = z.infer<typeof releaseSchema>

interface ReleaseFormProps {
  initialData?: Partial<Release>
  onSubmit: (data: ReleaseFormData) => void | Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export function ReleaseForm({ initialData, onSubmit, onCancel, isLoading }: ReleaseFormProps) {
  const form = useForm<ReleaseFormData>({
    resolver: zodResolver(releaseSchema),
    defaultValues: {
      type: initialData?.type || "Commission",
      recipientId: initialData?.recipientId || "",
      recipientType: initialData?.recipientType,
      amount: initialData?.amount || 0,
      currency: initialData?.currency || "NGN",
      bankName: initialData?.bankName || "",
      accountNumber: initialData?.accountNumber || "",
      accountName: initialData?.accountName || "",
      reason: initialData?.reason || "",
      description: initialData?.description || "",
      status: initialData?.status || "Submitted",
      paymentMethod: initialData?.paymentMethod || "",
      paymentReference: initialData?.paymentReference || "",
      notes: initialData?.notes || "",
    },
  })

  const releaseType = form.watch("type")
  const status = form.watch("status")

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Release Type *</Label>
          <Select
            value={form.watch("type")}
            onValueChange={(value) => form.setValue("type", value as ReleaseType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Commission">Commission Release</SelectItem>
              <SelectItem value="Revocation">Revocation (Refund)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipientType">Recipient Type</Label>
          <Select
            value={form.watch("recipientType")}
            onValueChange={(value) => form.setValue("recipientType", value as "Agent" | "Partner" | "Client")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {releaseType === "Commission" ? (
                <>
                  <SelectItem value="Agent">Agent</SelectItem>
                  <SelectItem value="Partner">Partner</SelectItem>
                </>
              ) : (
                <SelectItem value="Client">Client</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="recipientId">Recipient *</Label>
        <Select
          value={form.watch("recipientId")}
          onValueChange={(value) => form.setValue("recipientId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select recipient" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recipient-1">Sample Recipient 1</SelectItem>
            <SelectItem value="recipient-2">Sample Recipient 2</SelectItem>
          </SelectContent>
        </Select>
        {form.formState.errors.recipientId && (
          <p className="text-sm text-destructive">{form.formState.errors.recipientId.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount *</Label>
          <CurrencyInput
            value={form.watch("amount")}
            onChange={(value) => form.setValue("amount", value)}
          />
          {form.formState.errors.amount && (
            <p className="text-sm text-destructive">{form.formState.errors.amount.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select
            value={form.watch("currency")}
            onValueChange={(value) => form.setValue("currency", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
              <SelectItem value="USD">USD - US Dollar</SelectItem>
              <SelectItem value="GBP">GBP - British Pound</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bank Details */}
      <div className="space-y-4 p-4 border rounded-lg">
        <h3 className="font-semibold">Bank Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Reason *</Label>
        <Input
          id="reason"
          {...form.register("reason")}
          placeholder="Reason for release"
        />
        {form.formState.errors.reason && (
          <p className="text-sm text-destructive">{form.formState.errors.reason.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...form.register("description")}
          placeholder="Additional details"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <Select
          value={form.watch("status")}
          onValueChange={(value) => form.setValue("status", value as ReleaseStatus)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Submitted">Submitted</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {status === "Paid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select
              value={form.watch("paymentMethod")}
              onValueChange={(value) => form.setValue("paymentMethod", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Cheque">Cheque</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentReference">Payment Reference</Label>
            <Input
              id="paymentReference"
              {...form.register("paymentReference")}
              placeholder="Reference number"
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...form.register("notes")}
          placeholder="Additional notes"
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
          {isLoading ? "Saving..." : initialData ? "Update Release" : "Create Release"}
        </Button>
      </div>
    </form>
  )
}
