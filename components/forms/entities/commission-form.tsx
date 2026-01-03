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
            value={form.watch("recipientType")}
            onValueChange={(value) => {
              form.setValue("recipientType", value as CommissionType)
              form.setValue("commissionPercentage", value === "Agent" ? 70 : 30)
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Agent">Agent (70%)</SelectItem>
              <SelectItem value="Partner">Partner (30%)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipientId">
            {recipientType === "Agent" ? "Agent" : "Partner"} *
          </Label>
          <Select
            value={form.watch("recipientId")}
            onValueChange={(value) => form.setValue("recipientId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${recipientType.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recipient-1">Sample {recipientType} 1</SelectItem>
              <SelectItem value="recipient-2">Sample {recipientType} 2</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.recipientId && (
            <p className="text-sm text-destructive">{form.formState.errors.recipientId.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="enrollmentId">Enrollment *</Label>
        <Select
          value={form.watch("enrollmentId")}
          onValueChange={(value) => form.setValue("enrollmentId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select enrollment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="enrollment-1">ENR-001</SelectItem>
            <SelectItem value="enrollment-2">ENR-002</SelectItem>
          </SelectContent>
        </Select>
        {form.formState.errors.enrollmentId && (
          <p className="text-sm text-destructive">{form.formState.errors.enrollmentId.message}</p>
        )}
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
          value={form.watch("status")}
          onValueChange={(value) => form.setValue("status", value as CommissionStatus)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {form.watch("status") === "Paid" && (
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
          {isLoading ? "Saving..." : initialData ? "Update Commission" : "Create Commission"}
        </Button>
      </div>
    </form>
  )
}
