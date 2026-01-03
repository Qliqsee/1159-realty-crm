"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/buttons/button"
import { Input } from "@/components/inputs/input"
import { Label } from "@/components/layout/label"
import { Select } from "@/components/inputs/select"
import { PhoneInput } from "@/components/inputs/phone-input"
import type { User, UserRole, UserStatus } from "@/types"

const teamMemberSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  role: z.enum(["Agent", "CST", "CST Manager", "Accounting", "Accounting Manager", "HR", "Sales", "Sales Manager", "Operations Manager", "Media Manager", "Manager", "Admin"]),
  status: z.enum(["Active", "Inactive", "Suspended"]),
  department: z.string().optional(),
})

type TeamMemberFormData = z.infer<typeof teamMemberSchema>

interface TeamMemberFormProps {
  initialData?: Partial<User>
  onSubmit: (data: TeamMemberFormData) => void | Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export function TeamMemberForm({ initialData, onSubmit, onCancel, isLoading }: TeamMemberFormProps) {
  const form = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      role: initialData?.role || "Agent",
      status: initialData?.status || "Active",
      department: initialData?.department || "",
    },
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            {...form.register("firstName")}
            placeholder="Enter first name"
          />
          {form.formState.errors.firstName && (
            <p className="text-sm text-destructive">{form.formState.errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            {...form.register("lastName")}
            placeholder="Enter last name"
          />
          {form.formState.errors.lastName && (
            <p className="text-sm text-destructive">{form.formState.errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...form.register("email")}
            placeholder="email@1159realty.com"
          />
          {form.formState.errors.email && (
            <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <PhoneInput
            value={form.watch("phone")}
            onChange={(value) => form.setValue("phone", value)}
          />
          {form.formState.errors.phone && (
            <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="role">Role *</Label>
          <Select
            id="role"
            value={form.watch("role")}
            onValueChange={(value) => form.setValue("role", value as UserRole)}
            options={[
              { value: "Admin", label: "Admin" },
              { value: "Manager", label: "Manager" },
              { value: "Agent", label: "Agent" },
              { value: "CST", label: "CST (Customer Service)" },
              { value: "CST Manager", label: "CST Manager" },
              { value: "Accounting", label: "Accounting" },
              { value: "Accounting Manager", label: "Accounting Manager" },
              { value: "HR", label: "HR" },
              { value: "Sales", label: "Sales" },
              { value: "Sales Manager", label: "Sales Manager" },
              { value: "Operations Manager", label: "Operations Manager" },
              { value: "Media Manager", label: "Media Manager" },
            ]}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select
            id="status"
            value={form.watch("status")}
            onValueChange={(value) => form.setValue("status", value as UserStatus)}
            options={[
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
              { value: "Suspended", label: "Suspended" },
            ]}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="department">Department</Label>
        <Input
          id="department"
          {...form.register("department")}
          placeholder="e.g., Sales, Customer Service"
        />
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Update Team Member" : "Add Team Member"}
        </Button>
      </div>
    </form>
  )
}
