"use client"

import { useState } from "react"
import { Plus, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/common/page-header"
import { DataTable } from "@/components/common/data-table"
import { ActionMenu } from "@/components/common/action-menu"
import type { User } from "@/types"

export default function TeamPage() {
  const [teamMembers] = useState<User[]>([
    {
      id: "1",
      email: "michael.chen@1159realty.com",
      firstName: "Michael",
      lastName: "Chen",
      fullName: "Michael Chen",
      phone: "+234-803-345-6789",
      role: "Agent",
      status: "Active",
      permissions: [],
      createdAt: new Date("2024-01-05"),
    },
  ])

  const columns = [
    {
      header: "Name",
      accessorKey: "fullName",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Phone",
      accessorKey: "phone",
    },
    {
      header: "Role",
      cell: ({ row }: { row: { original: User } }) => (
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <Badge variant="outline">{row.original.role}</Badge>
        </div>
      ),
    },
    {
      header: "Status",
      cell: ({ row }: { row: { original: User } }) => {
        const user = row.original
        const colors = {
          Active: "bg-green-500",
          Inactive: "bg-gray-500",
          Suspended: "bg-red-500",
        }
        return <Badge className={colors[user.status]}>{user.status}</Badge>
      },
    },
    {
      header: "Actions",
      cell: ({ row }: { row: { original: User } }) => (
        <ActionMenu
          items={[
            { label: "View Profile", onClick: () => {} },
            { label: "Edit", onClick: () => {}, permission: "update:user" },
            { label: "Manage Permissions", onClick: () => {}, permission: "update:user" },
            { label: "Deactivate", onClick: () => {}, permission: "delete:user" },
          ]}
        />
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Members"
        description="Manage team members, roles, and permissions"
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        }
      />

      <Card>
        <DataTable
          columns={columns}
          data={teamMembers}
          searchKey="fullName"
          searchPlaceholder="Search team members..."
        />
      </Card>
    </div>
  )
}
