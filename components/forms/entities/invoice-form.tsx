"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { CurrencyInput } from "@/components/forms/currency-input"
import type { Invoice, InvoiceStatus } from "@/types"

const invoiceSchema = z.object({
  enrollmentId: z.string().min(1, "Enrollment is required"),
  amount: z.number().min(0.01, "Amount is required"),
  penaltyAmount: z.number().min(0).default(0),
  issueDate: z.date({
    required_error: "Issue date is required",
  }),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
  status: z.enum(["Pending", "Paid", "Overdue", "Resolved"]),
  installmentNumber: z.number().optional(),
  notes: z.string().optional(),
})

type InvoiceFormData = z.infer<typeof invoiceSchema>

interface InvoiceFormProps {
  initialData?: Partial<Invoice>
  onSubmit: (data: InvoiceFormData) => void | Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export function InvoiceForm({ initialData, onSubmit, onCancel, isLoading }: InvoiceFormProps) {
  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      enrollmentId: initialData?.enrollmentId || "",
      amount: initialData?.amount || 0,
      penaltyAmount: initialData?.penaltyAmount || 0,
      issueDate: initialData?.issueDate,
      dueDate: initialData?.dueDate,
      status: initialData?.status || "Pending",
      installmentNumber: initialData?.installmentNumber,
      notes: initialData?.notes || "",
    },
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          <Label htmlFor="penaltyAmount">Penalty Amount</Label>
          <CurrencyInput
            value={form.watch("penaltyAmount")}
            onChange={(value) => form.setValue("penaltyAmount", value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="issueDate">Issue Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.watch("issueDate") ? (
                  format(form.watch("issueDate"), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={form.watch("issueDate")}
                onSelect={(date) => form.setValue("issueDate", date!)}
              />
            </PopoverContent>
          </Popover>
          {form.formState.errors.issueDate && (
            <p className="text-sm text-destructive">{form.formState.errors.issueDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.watch("dueDate") ? (
                  format(form.watch("dueDate"), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={form.watch("dueDate")}
                onSelect={(date) => form.setValue("dueDate", date!)}
              />
            </PopoverContent>
          </Popover>
          {form.formState.errors.dueDate && (
            <p className="text-sm text-destructive">{form.formState.errors.dueDate.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select
            value={form.watch("status")}
            onValueChange={(value) => form.setValue("status", value as InvoiceStatus)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="installmentNumber">Installment Number</Label>
          <Input
            id="installmentNumber"
            type="number"
            min="1"
            {...form.register("installmentNumber", { valueAsNumber: true })}
            placeholder="e.g., 1, 2, 3"
          />
        </div>
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
          {isLoading ? "Saving..." : initialData ? "Update Invoice" : "Create Invoice"}
        </Button>
      </div>
    </form>
  )
}
