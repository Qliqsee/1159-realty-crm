"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/buttons/button"
import { Input } from "@/components/inputs/input"
import { Label } from "@/components/layout/label"
import { Select } from "@/components/inputs/select"
import { Textarea } from "@/components/inputs/textarea"
import { CurrencyInput } from "@/components/inputs/currency-input"
import type { Commission, CommissionType, CommissionStatus } from "@/types"

const commissionSchema = z.object({
  recipientId: z.string().min(1, "Recipient is required"),
  recipientType: z.enum(["Agent", "Partner"]),
  enrollmentId: z.string().min(1, "Enrollment is required"),
  saleAmount: z.number().min(0.01, "Sale amount is required"),
  commissionPercentage: z.number().min(0).max(100),
  status: z.enum(["Pending", "Paid", "Cancelled"]),
  paymentMethod: z.string().optional(),
  paymentReference: z.string().optional(),
  notes: z.string().optional(),
})

type CommissionFormData = z.infer<typeof commissionSchema>

interface CommissionFormProps {
  initialData?: Partial<Commission>
  onSubmit: (data: CommissionFormData) => void | Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export function CommissionForm({ initialData, onSubmit, onCancel, isLoading }: CommissionFormProps) {
  const form = useForm<CommissionFormData>({
    resolver: zodResolver(commissionSchema),
    defaultValues: {
      recipientId: initialData?.recipientId || "",
      recipientType: initialData?.recipientType || "Agent",
      enrollmentId: initialData?.enrollmentId || "",
      saleAmount: initialData?.saleAmount || 0,
      commissionPercentage: initialData?.commissionPercentage || 70,
      status: initialData?.status || "Pending",
      paymentMethod: initialData?.paymentMethod || "",
      paymentReference: initialData?.paymentReference || "",
      notes: initialData?.notes || "",
    },
  })

  const recipientType = form.watch("recipientType")
  const saleAmount = form.watch("saleAmount")
  const commissionPercentage = form.watch("commissionPercentage")
  const commissionAmount = (saleAmount * commissionPercentage) / 100

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="recipientType">Recipient Type *</Label>
          <Select
            id="recipientType"
            value={form.watch("recipientType")}
            onValueChange={(value) => {
              form.setValue("recipientType", value as CommissionType)
              form.setValue("commissionPercentage", value === "Agent" ? 70 : 30)
            }}
            options={[
              { value: "Agent", label: "Agent (70%)" },
              { value: "Partner", label: "Partner (30%)" },
            ]}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipientId">
            {recipientType === "Agent" ? "Agent" : "Partner"} *
          </Label>
          <Select
            id="recipientId"
            value={form.watch("recipientId")}
            onValueChange={(value) => form.setValue("recipientId", value)}
            placeholder={`Select ${recipientType.toLowerCase()}`}
            options={[
              { value: "recipient-1", label: `Sample ${recipientType} 1` },
              { value: "recipient-2", label: `Sample ${recipientType} 2` },
            ]}
            error={form.formState.errors.recipientId?.message}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="enrollmentId">Enrollment *</Label>
        <Select
          id="enrollmentId"
          value={form.watch("enrollmentId")}
          onValueChange={(value) => form.setValue("enrollmentId", value)}
          placeholder="Select enrollment"
          options={[
            { value: "enrollment-1", label: "ENR-001" },
            { value: "enrollment-2", label: "ENR-002" },
          ]}
          error={form.formState.errors.enrollmentId?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="saleAmount">Sale Amount *</Label>
          <CurrencyInput
            value={form.watch("saleAmount")}
            onChange={(value) => form.setValue("saleAmount", value)}
          />
          {form.formState.errors.saleAmount && (
            <p className="text-sm text-destructive">{form.formState.errors.saleAmount.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="commissionPercentage">Commission % *</Label>
          <Input
            id="commissionPercentage"
            type="number"
            step="0.01"
            min="0"
            max="100"
            {...form.register("commissionPercentage", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="p-4 bg-muted rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Commission Amount:</span>
          <span className="text-lg font-bold">₦{commissionAmount.toLocaleString()}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <Select
          id="status"
          value={form.watch("status")}
          onValueChange={(value) => form.setValue("status", value as CommissionStatus)}
          options={[
            { value: "Pending", label: "Pending" },
            { value: "Paid", label: "Paid" },
            { value: "Cancelled", label: "Cancelled" },
          ]}
        />
      </div>

      {form.watch("status") === "Paid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select
              id="paymentMethod"
              value={form.watch("paymentMethod")}
              onValueChange={(value) => form.setValue("paymentMethod", value)}
              placeholder="Select method"
              options={[
                { value: "Bank Transfer", label: "Bank Transfer" },
                { value: "Cash", label: "Cash" },
                { value: "Cheque", label: "Cheque" },
              ]}
            />
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
          {isLoading ? "Saving..." : initialData ? "Update Commission" : "Create Commission"}
        </Button>
      </div>
    </form>
  )
}
