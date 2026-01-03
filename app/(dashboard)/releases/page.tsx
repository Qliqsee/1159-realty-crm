"use client"

import { useState } from "react"
import { Plus, DollarSign, Check } from "lucide-react"
import { Button } from "@/components/buttons/button"
import { Card } from "@/components/cards/card"
import { Badge } from "@/components/badges/badge"
import { PageHeader } from "@/components/layout/page-header"
import { DataTable } from "@/components/data/data-table"
import { ActionMenu } from "@/components/overlays/action-menu"
import { format } from "date-fns"
import type { Release } from "@/types"

export default function ReleasesPage() {
  const [releases] = useState<Release[]>([
    {
      id: "1",
      releaseNumber: "REL-001",
      type: "Commission",
      recipientId: "agent-1",
      recipientName: "Michael Chen",
      amount: 350000,
      currency: "NGN",
      reason: "Commission payment for 5 enrollments",
      status: "Pending",
      requestedBy: "user-1",
      requestedByName: "Admin User",
      requestedAt: new Date("2024-01-20"),
      createdAt: new Date("2024-01-20"),
      updatedAt: new Date("2024-01-20"),
    },
  ])

  const columns = [
    {
      header: "Release #",
      accessorKey: "releaseNumber",
    },
    {
      header: "Type",
      accessorKey: "type",
    },
    {
      header: "Recipient",
      accessorKey: "recipientName",
    },
    {
      header: "Amount",
      cell: ({ row }: { row: { original: Release } }) =>
        `${row.original.currency} ${row.original.amount?.toLocaleString() || '0'}`,
    },
    {
      header: "Reason",
      accessorKey: "reason",
    },
    {
      header: "Requested",
      cell: ({ row }: { row: { original: Release } }) =>
        format(row.original.requestedAt, "PP"),
    },
    {
      header: "Status",
      cell: ({ row }: { row: { original: Release } }) => {
        const release = row.original
        const colors = {
          Submitted: "bg-blue-500",
          Pending: "bg-yellow-500",
          Paid: "bg-green-500",
        }
        return <Badge className={colors[release.status]}>{release.status}</Badge>
      },
    },
    {
      header: "Actions",
      cell: ({ row }: { row: { original: Release } }) => (
        <ActionMenu
          items={[
            { label: "View Details", onClick: () => {} },
            { label: "Approve", icon: Check, onClick: () => {}, permission: "approve:release" },
            { label: "Mark as Paid", icon: DollarSign, onClick: () => {}, permission: "approve:release" },
          ]}
        />
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Releases"
        description="Manage commission releases and refunds"
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Release
          </Button>
        }
      />

      <Card>
        <DataTable
          columns={columns}
          data={releases}
          searchKey="recipientName"
          searchPlaceholder="Search by recipient..."
        />
      </Card>
    </div>
  )
}
