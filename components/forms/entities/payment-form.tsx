"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/buttons/button"
import { Input } from "@/components/inputs/input"
import { Label } from "@/components/layout/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/inputs/select"
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

        <div className="space-y-2">
          <Label htmlFor="invoiceId">Invoice (Optional)</Label>
          <Select
            value={form.watch("invoiceId")}
            onValueChange={(value) => form.setValue("invoiceId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select invoice" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="invoice-1">INV-001</SelectItem>
              <SelectItem value="invoice-2">INV-002</SelectItem>
            </SelectContent>
          </Select>
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
              <SelectItem value="Card">Card</SelectItem>
              <SelectItem value="Online">Online Payment</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.paymentMethod && (
            <p className="text-sm text-destructive">{form.formState.errors.paymentMethod.message}</p>
          )}
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
          value={form.watch("status")}
          onValueChange={(value) => form.setValue("status", value as ManualPaymentStatus)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
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
