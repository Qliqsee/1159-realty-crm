"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/buttons/button"
import { Input } from "@/components/inputs/input"
import { Label } from "@/components/layout/label"
import { Select } from "@/components/inputs/select"
import { Textarea } from "@/components/inputs/textarea"
import { Calendar } from "@/components/inputs/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/overlays/popover"
import { CalendarIcon, Upload } from "lucide-react"
import { format } from "date-fns"
import { CurrencyInput } from "@/components/inputs/currency-input"
import type { ManualPayment, ManualPaymentStatus } from "@/types"

const paymentSchema = z.object({
  enrollmentId: z.string().min(1, "Enrollment is required"),
  invoiceId: z.string().optional(),
  amount: z.number().min(0.01, "Amount is required"),
  paymentDate: z.date({
    required_error: "Payment date is required",
  }),
  paymentMethod: z.string().min(1, "Payment method is required"),
  transactionReference: z.string().min(1, "Transaction reference is required"),
  status: z.enum(["Pending", "Approved", "Rejected"]),
  notes: z.string().optional(),
})

type PaymentFormData = z.infer<typeof paymentSchema>

interface PaymentFormProps {
  initialData?: Partial<ManualPayment>
  onSubmit: (data: PaymentFormData) => void | Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export function PaymentForm({ initialData, onSubmit, onCancel, isLoading }: PaymentFormProps) {
  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      enrollmentId: initialData?.enrollmentId || "",
      invoiceId: initialData?.invoiceId || "",
      amount: initialData?.amount || 0,
      paymentDate: initialData?.paymentDate,
      paymentMethod: initialData?.paymentMethod || "",
      transactionReference: initialData?.transactionReference || "",
      status: initialData?.status || "Pending",
      notes: initialData?.notes || "",
    },
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div className="space-y-2">
          <Label htmlFor="invoiceId">Invoice (Optional)</Label>
          <Select
            id="invoiceId"
            value={form.watch("invoiceId")}
            onValueChange={(value) => form.setValue("invoiceId", value)}
            placeholder="Select invoice"
            options={[
              { value: "invoice-1", label: "INV-001" },
              { value: "invoice-2", label: "INV-002" },
            ]}
          />
        </div>
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
          <Label htmlFor="paymentDate">Payment Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.watch("paymentDate") ? (
                  format(form.watch("paymentDate"), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={form.watch("paymentDate")}
                onSelect={(date) => form.setValue("paymentDate", date!)}
              />
            </PopoverContent>
          </Popover>
          {form.formState.errors.paymentDate && (
            <p className="text-sm text-destructive">{form.formState.errors.paymentDate.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Payment Method *</Label>
          <Select
            id="paymentMethod"
            value={form.watch("paymentMethod")}
            onValueChange={(value) => form.setValue("paymentMethod", value)}
            placeholder="Select method"
            options={[
              { value: "Bank Transfer", label: "Bank Transfer" },
              { value: "Cash", label: "Cash" },
              { value: "Cheque", label: "Cheque" },
              { value: "Card", label: "Card" },
              { value: "Online", label: "Online Payment" },
            ]}
            error={form.formState.errors.paymentMethod?.message}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="transactionReference">Transaction Reference *</Label>
          <Input
            id="transactionReference"
            {...form.register("transactionReference")}
            placeholder="Transaction ID or reference"
          />
          {form.formState.errors.transactionReference && (
            <p className="text-sm text-destructive">{form.formState.errors.transactionReference.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="receipt">Payment Receipt</Label>
        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Click to upload or drag and drop</p>
          <p className="text-xs text-muted-foreground">PDF, PNG, JPG (max 5MB)</p>
          <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <Select
          id="status"
          value={form.watch("status")}
          onValueChange={(value) => form.setValue("status", value as ManualPaymentStatus)}
          options={[
            { value: "Pending", label: "Pending" },
            { value: "Approved", label: "Approved" },
            { value: "Rejected", label: "Rejected" },
          ]}
        />
      </div>

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
          {isLoading ? "Saving..." : initialData ? "Update Payment" : "Submit Payment"}
        </Button>
      </div>
    </form>
  )
}
