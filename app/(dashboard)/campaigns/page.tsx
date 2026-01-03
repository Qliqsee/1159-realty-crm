"use client"

import { useState } from "react"
import { Plus, Send, Users } from "lucide-react"
import { Button } from "@/components/buttons/button"
import { Card } from "@/components/cards/card"
import { Badge } from "@/components/badges/badge"
import { PageHeader } from "@/components/layout/page-header"
import { DataTable } from "@/components/data/data-table"
import { ActionMenu } from "@/components/overlays/action-menu"
import { format } from "date-fns"
import type { ContactSegment } from "@/types"

export default function CampaignsPage() {
  const [segments] = useState<ContactSegment[]>([
    {
      id: "1",
      name: "High Value Clients",
      description: "Clients with total spend > ₦10M",
      filters: [],
      filterLogic: "AND",
      manualContacts: [],
      totalContacts: 45,
      usageCount: 5,
      tags: ["vip", "high-value"],
      createdBy: "user-1",
      createdByName: "Admin User",
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-15"),
    },
  ])

  const columns = [
    {
      header: "Segment Name",
      accessorKey: "name",
    },
    {
      header: "Description",
      accessorKey: "description",
    },
    {
      header: "Total Contacts",
      cell: ({ row }: { row: { original: ContactSegment } }) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.totalContacts}</span>
        </div>
      ),
    },
    {
      header: "Tags",
      cell: ({ row }: { row: { original: ContactSegment } }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
        </div>
      ),
    },
    {
      header: "Usage Count",
      accessorKey: "usageCount",
    },
    {
      header: "Created",
      cell: ({ row }: { row: { original: ContactSegment } }) =>
        format(row.original.createdAt, "PP"),
    },
    {
      header: "Actions",
      cell: ({ row }: { row: { original: ContactSegment } }) => (
        <ActionMenu
          items={[
            { label: "View Details", onClick: () => {} },
            { label: "Send Notification", icon: Send, onClick: () => {}, permission: "create:notification" },
            { label: "Edit", onClick: () => {}, permission: "update:campaign" },
            { label: "Delete", onClick: () => {}, permission: "delete:campaign" },
          ]}
        />
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contact Segments"
        description="Manage contact segments for targeted communications"
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Segment
          </Button>
        }
      />

      <Card>
        <DataTable
          columns={columns}
          data={segments}
          searchKey="name"
          searchPlaceholder="Search segments..."
          searchVariant="gold"
        />
      </Card>
    </div>
  )
}
