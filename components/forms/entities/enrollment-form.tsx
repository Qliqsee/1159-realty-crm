"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState, useEffect } from "react"
import { Button } from "@/components/buttons/button"
import { Input } from "@/components/inputs/input"
import { Label } from "@/components/layout/label"
import { Select } from "@/components/inputs/select"
import { EntitySelect, type EntityOption } from "@/components/inputs/entity-select"
import { Separator } from "@/components/display/separator"
import { toast } from "sonner"
import { searchClients, searchPartners } from "@/lib/api/clients"
import { searchProperties } from "@/lib/api/properties"
import { searchAgents } from "@/lib/api/users"
import type { Client, Property, User, PropertyStatus } from "@/types"

// Validation Schema
const enrollmentSchema = z.object({
  // Lead Source
  leadType: z.enum(["Company Lead", "Private Lead"], {
    required_error: "Lead source is required",
  }),

  // Client
  clientId: z.string().min(1, "Client is required"),

  // Agent (conditional visibility, always sent)
  agentId: z.string().min(1, "Agent is required"),

  // Partner
  partnerId: z.string().optional(),

  // Property
  propertyId: z.string().min(1, "Property is required"),

  // Enrollment Date
  enrollmentDate: z.date().optional(),

  // Payment Type
  paymentType: z.enum(["Outright", "Installment"], {
    required_error: "Payment type is required",
  }),

  // Payment Plan Duration (in months)
  paymentPlanDuration: z.number().min(1, "Payment plan is required"),

  // Unit Configuration
  unit: z.string().min(1, "Unit is required"),

  // Quantity
  quantity: z.number().min(1, "Quantity must be at least 1"),

  // Auto-populated fields (disabled)
  overdueInterestRate: z.number(),
  propertyStatus: z.enum(["Available", "Pre-launch", "Sold Out", "Reserved", "Disabled"]),
  price: z.number(),
  paymentInterest: z.number(),
})

type EnrollmentFormData = z.infer<typeof enrollmentSchema>

interface EnrollmentFormProps {
  initialData?: Partial<EnrollmentFormData>
  onSubmit: (data: EnrollmentFormData) => void | Promise<void>
  onCancel?: () => void
  isLoading?: boolean
  selectAgent?: boolean
  currentUserId?: string
}

export function EnrollmentForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  selectAgent = false,
  currentUserId = "current-user-id",
}: EnrollmentFormProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

  const form = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentSchema) as any,
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      leadType: initialData?.leadType || "Private Lead",
      clientId: initialData?.clientId || "",
      agentId: initialData?.agentId || (selectAgent ? "" : currentUserId),
      partnerId: initialData?.partnerId || "",
      propertyId: initialData?.propertyId || "",
      enrollmentDate: initialData?.enrollmentDate || new Date(),
      paymentType: initialData?.paymentType || "Installment",
      paymentPlanDuration: initialData?.paymentPlanDuration || 0,
      unit: initialData?.unit || "",
      quantity: initialData?.quantity || 1,
      overdueInterestRate: initialData?.overdueInterestRate || 0,
      propertyStatus: initialData?.propertyStatus || "Available",
      price: initialData?.price || 0,
      paymentInterest: initialData?.paymentInterest || 0,
    },
  })

  const watchPropertyId = form.watch("propertyId")
  const watchUnit = form.watch("unit")
  const watchQuantity = form.watch("quantity")
  const watchPaymentPlanDuration = form.watch("paymentPlanDuration")
  const watchPropertyStatus = form.watch("propertyStatus")

  // Fetch property when propertyId changes
  useEffect(() => {
    const fetchProperty = async () => {
      if (!watchPropertyId) {
        setSelectedProperty(null)
        form.setValue("unit", "")
        form.setValue("paymentPlanDuration", 0)
        form.setValue("overdueInterestRate", 0)
        form.setValue("propertyStatus", "Available")
        form.setValue("price", 0)
        form.setValue("paymentInterest", 0)
        return
      }

      try {
        const properties = await searchProperties("")
        const property = properties.find((p) => p.id === watchPropertyId)
        if (property) {
          setSelectedProperty(property)
          form.setValue("overdueInterestRate", property.overdueInterestRate)
          form.setValue("propertyStatus", property.status)
        }
      } catch (error) {
        console.error("Failed to fetch property:", error)
      }
    }

    fetchProperty()
  }, [watchPropertyId])

  // Reset dependent fields when property changes
  useEffect(() => {
    if (selectedProperty) {
      form.setValue("unit", "")
      form.setValue("paymentPlanDuration", 0)
      form.setValue("price", 0)
      form.setValue("paymentInterest", 0)
    }
  }, [selectedProperty?.id])

  // Calculate price when unit or quantity changes
  useEffect(() => {
    if (!selectedProperty || !watchUnit) {
      form.setValue("price", 0)
      return
    }

    const unitConfig = selectedProperty.unitPricing.find((u) => u.unit === watchUnit)
    if (unitConfig) {
      const unitPrice =
        watchPropertyStatus === "Pre-launch"
          ? unitConfig.prelaunchPrice
          : unitConfig.regularPrice
      const totalPrice = unitPrice * watchQuantity
      form.setValue("price", totalPrice)
    }
  }, [watchUnit, watchQuantity, watchPropertyStatus, selectedProperty])

  // Update payment interest when payment plan changes
  useEffect(() => {
    if (!selectedProperty || !watchPaymentPlanDuration) {
      form.setValue("paymentInterest", 0)
      return
    }

    const paymentPlan = selectedProperty.paymentPlans.find(
      (p) => p.durationMonths === watchPaymentPlanDuration
    )
    if (paymentPlan) {
      form.setValue("paymentInterest", paymentPlan.interestRate)
    }
  }, [watchPaymentPlanDuration, selectedProperty])

  const handleFormSubmit = async (data: EnrollmentFormData) => {
    try {
      await onSubmit(data)
    } catch (error) {
      toast.error("Failed to create enrollment")
    }
  }

  const handleInvalidSubmit = (errors: any) => {
    console.log("Form validation errors:", errors)
    toast.error("Please complete all required fields")
  }

  // Transform functions for EntitySelect
  const transformClient = (client: Client): EntityOption => ({
    id: client.id,
    label: client.fullName,
    sublabel: client.email,
  })

  const transformAgent = (agent: User): EntityOption => ({
    id: agent.id,
    label: agent.fullName,
    sublabel: `${agent.email} • ${agent.role}`,
  })

  const transformProperty = (property: Property): EntityOption => ({
    id: property.id,
    label: property.name,
    sublabel: `${property.type} • ${property.state || property.address}`,
  })

  const handleSearchClients = async (query: string): Promise<EntityOption[]> => {
    const clients = await searchClients(query)
    return clients.map(transformClient)
  }

  const handleSearchAgents = async (query: string): Promise<EntityOption[]> => {
    const agents = await searchAgents(query)
    return agents.map(transformAgent)
  }

  const handleSearchPartners = async (query: string): Promise<EntityOption[]> => {
    const partners = await searchPartners(query)
    return partners.map(transformClient)
  }

  const handleSearchProperties = async (query: string): Promise<EntityOption[]> => {
    const properties = await searchProperties(query)
    return properties.map(transformProperty)
  }

  const leadTypeOptions = [
    { value: "Company Lead", label: "Company Assigned" },
    { value: "Private Lead", label: "Self Generated" },
  ]

  const paymentTypeOptions = [
    { value: "Outright", label: "Outright" },
    { value: "Installment", label: "Installment" },
  ]

  const unitOptions =
    selectedProperty?.unitPricing.map((u) => ({
      value: u.unit,
      label: u.unit,
    })) || []

  const paymentPlanOptions =
    selectedProperty?.paymentPlans.map((p) => ({
      value: p.durationMonths.toString(),
      label: `${p.durationMonths} months (${p.interestRate}% interest)`,
    })) || []

  return (
    <form
      onSubmit={form.handleSubmit(handleFormSubmit, handleInvalidSubmit)}
      noValidate
      className="space-y-6"
    >
      {/* Client & Assignment Information */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Client & Assignment</h3>

        <div className="space-y-2">
          <Label htmlFor="leadType">Lead Source *</Label>
          <Controller
            name="leadType"
            control={form.control}
            render={({ field }) => (
              <Select
                id="leadType"
                value={field.value}
                onValueChange={field.onChange}
                options={leadTypeOptions}
                error={form.formState.errors.leadType?.message}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientId">Client *</Label>
          <Controller
            name="clientId"
            control={form.control}
            render={({ field }) => (
              <EntitySelect
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Search by name or email..."
                searchPlaceholder="Search clients..."
                emptyText="No client found."
                onSearch={handleSearchClients}
                error={form.formState.errors.clientId?.message}
              />
            )}
          />
        </div>

        {selectAgent && (
          <div className="space-y-2">
            <Label htmlFor="agentId">Agent *</Label>
            <Controller
              name="agentId"
              control={form.control}
              render={({ field }) => (
                <EntitySelect
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Search by name or email..."
                  searchPlaceholder="Search agents..."
                  emptyText="No agent found."
                  onSearch={handleSearchAgents}
                  error={form.formState.errors.agentId?.message}
                />
              )}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="partnerId">Partner</Label>
          <Controller
            name="partnerId"
            control={form.control}
            render={({ field }) => (
              <EntitySelect
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Search by name or email..."
                searchPlaceholder="Search partners..."
                emptyText="No partner found."
                onSearch={handleSearchPartners}
                error={form.formState.errors.partnerId?.message}
              />
            )}
          />
        </div>
      </div>

      <Separator />

      {/* Property Information */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Property Details</h3>

        <div className="space-y-2">
          <Label htmlFor="propertyId">Property *</Label>
          <Controller
            name="propertyId"
            control={form.control}
            render={({ field }) => (
              <EntitySelect
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Search by name or location..."
                searchPlaceholder="Search properties..."
                emptyText="No property found."
                onSearch={handleSearchProperties}
                error={form.formState.errors.propertyId?.message}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Unit Type *</Label>
          <Controller
            name="unit"
            control={form.control}
            render={({ field }) => (
              <Select
                id="unit"
                value={field.value}
                onValueChange={field.onChange}
                options={unitOptions}
                placeholder="Select unit"
                disabled={!selectedProperty}
                error={form.formState.errors.unit?.message}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Units *</Label>
          <Controller
            name="quantity"
            control={form.control}
            render={({ field }) => (
              <Input
                id="quantity"
                type="number"
                min="1"
                value={field.value}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                error={form.formState.errors.quantity?.message}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="propertyStatus">Property Status</Label>
          <Input
            id="propertyStatus"
            value={form.watch("propertyStatus")}
            disabled
            className="bg-muted"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            value={form.watch("price").toLocaleString()}
            disabled
            className="bg-muted"
          />
        </div>
      </div>

      <Separator />

      {/* Payment Information */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Payment Details</h3>

        <div className="space-y-2">
          <Label htmlFor="enrollmentDate">Enrollment Date</Label>
          <Controller
            name="enrollmentDate"
            control={form.control}
            render={({ field }) => (
              <Input
                id="enrollmentDate"
                type="date"
                value={field.value?.toISOString().split("T")[0] || ""}
                onChange={(e) => field.onChange(new Date(e.target.value))}
                error={form.formState.errors.enrollmentDate?.message}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentType">Payment Type *</Label>
          <Controller
            name="paymentType"
            control={form.control}
            render={({ field }) => (
              <Select
                id="paymentType"
                value={field.value}
                onValueChange={field.onChange}
                options={paymentTypeOptions}
                error={form.formState.errors.paymentType?.message}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentPlanDuration">Payment Plan *</Label>
          <Controller
            name="paymentPlanDuration"
            control={form.control}
            render={({ field }) => (
              <Select
                id="paymentPlanDuration"
                value={field.value.toString()}
                onValueChange={(value) => field.onChange(parseInt(value))}
                options={paymentPlanOptions}
                placeholder="Select payment plan"
                disabled={!selectedProperty}
                error={form.formState.errors.paymentPlanDuration?.message}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentInterest">Payment Interest Rate (%)</Label>
          <Input
            id="paymentInterest"
            value={form.watch("paymentInterest")}
            disabled
            className="bg-muted"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="overdueInterestRate">Overdue Interest Rate (%)</Label>
          <Input
            id="overdueInterestRate"
            value={form.watch("overdueInterestRate")}
            disabled
            className="bg-muted"
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Enrollment"}
        </Button>
      </div>
    </form>
  )
}
