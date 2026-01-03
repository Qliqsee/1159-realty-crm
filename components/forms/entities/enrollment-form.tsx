"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/buttons/button"
import { Input } from "@/components/inputs/input"
import { Label } from "@/components/layout/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/inputs/select"
import { CurrencyInput } from "@/components/inputs/currency-input"
import type { Enrollment, EnrollmentStatus, PaymentType, EnrollmentType } from "@/types"

const enrollmentSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  propertyId: z.string().min(1, "Property is required"),
  agentId: z.string().min(1, "Agent is required"),
  enrollmentType: z.enum(["Company Lead", "Private Lead"]),
  totalAmount: z.number().min(1, "Total amount is required"),
  paymentType: z.enum(["Outright", "Installment"]),
  installmentDuration: z.number().optional(),
  interestRate: z.number().min(0).max(100),
  overduepenaltyRate: z.number().min(0).max(100),
  discountAmount: z.number().min(0).default(0),
  status: z.enum(["Ongoing", "Completed", "Cancelled", "Frozen"]),
  plotId: z.string().optional(),
  selectedSizeId: z.string().optional(),
})

type EnrollmentFormData = z.infer<typeof enrollmentSchema>

interface EnrollmentFormProps {
  initialData?: Partial<Enrollment>
  onSubmit: (data: EnrollmentFormData) => void | Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export function EnrollmentForm({ initialData, onSubmit, onCancel, isLoading }: EnrollmentFormProps) {
  const form = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      clientId: initialData?.clientId || "",
      propertyId: initialData?.propertyId || "",
      agentId: initialData?.agentId || "",
      enrollmentType: initialData?.enrollmentType || "Company Lead",
      totalAmount: initialData?.totalAmount || 0,
      paymentType: initialData?.paymentType || "Installment",
      installmentDuration: initialData?.installmentDuration,
      interestRate: initialData?.interestRate || 0,
      overduepenaltyRate: initialData?.overduepenaltyRate || 0,
      discountAmount: initialData?.discountAmount || 0,
      status: initialData?.status || "Ongoing",
      plotId: initialData?.plotId || "",
      selectedSizeId: initialData?.selectedSizeId || "",
    },
  })

  const paymentType = form.watch("paymentType")

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div className="space-y-2">
          <Label htmlFor="propertyId">Property *</Label>
          <Select
            value={form.watch("propertyId")}
            onValueChange={(value) => form.setValue("propertyId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select property" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="property-1">Sample Property 1</SelectItem>
              <SelectItem value="property-2">Sample Property 2</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.propertyId && (
            <p className="text-sm text-destructive">{form.formState.errors.propertyId.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="agentId">Agent *</Label>
          <Select
            value={form.watch("agentId")}
            onValueChange={(value) => form.setValue("agentId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="agent-1">Sample Agent 1</SelectItem>
              <SelectItem value="agent-2">Sample Agent 2</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.agentId && (
            <p className="text-sm text-destructive">{form.formState.errors.agentId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="enrollmentType">Enrollment Type *</Label>
          <Select
            value={form.watch("enrollmentType")}
            onValueChange={(value) => form.setValue("enrollmentType", value as EnrollmentType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Company Lead">Company Lead</SelectItem>
              <SelectItem value="Private Lead">Private Lead</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="paymentType">Payment Type *</Label>
          <Select
            value={form.watch("paymentType")}
            onValueChange={(value) => form.setValue("paymentType", value as PaymentType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Outright">Outright</SelectItem>
              <SelectItem value="Installment">Installment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {paymentType === "Installment" && (
          <div className="space-y-2">
            <Label htmlFor="installmentDuration">Installment Duration (months) *</Label>
            <Input
              id="installmentDuration"
              type="number"
              min="1"
              {...form.register("installmentDuration", { valueAsNumber: true })}
              placeholder="e.g., 12"
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="totalAmount">Total Amount *</Label>
        <CurrencyInput
          value={form.watch("totalAmount")}
          onChange={(value) => form.setValue("totalAmount", value)}
        />
        {form.formState.errors.totalAmount && (
          <p className="text-sm text-destructive">{form.formState.errors.totalAmount.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="interestRate">Interest Rate (%)</Label>
          <Input
            id="interestRate"
            type="number"
            step="0.01"
            min="0"
            max="100"
            {...form.register("interestRate", { valueAsNumber: true })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="overduepenaltyRate">Penalty Rate (%)</Label>
          <Input
            id="overduepenaltyRate"
            type="number"
            step="0.01"
            min="0"
            max="100"
            {...form.register("overduepenaltyRate", { valueAsNumber: true })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="discountAmount">Discount Amount</Label>
          <CurrencyInput
            value={form.watch("discountAmount")}
            onChange={(value) => form.setValue("discountAmount", value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <Select
          value={form.watch("status")}
          onValueChange={(value) => form.setValue("status", value as EnrollmentStatus)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Ongoing">Ongoing</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
            <SelectItem value="Frozen">Frozen</SelectItem>
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
          {isLoading ? "Saving..." : initialData ? "Update Enrollment" : "Create Enrollment"}
        </Button>
      </div>
    </form>
  )
}
