"use client"

import { useState } from "react"
import { Plus, MapPin } from "lucide-react"
import { Button } from "@/components/buttons/button"
import { Card } from "@/components/cards/card"
import { Badge } from "@/components/badges/badge"
import { PageHeader } from "@/components/layout/page-header"
import { DataTable } from "@/components/data/data-table"
import { ActionMenu } from "@/components/overlays/action-menu"
import type { State } from "@/types"

export default function LocationsPage() {
  const [states] = useState<State[]>([
    {
      id: "state-1",
      name: "Lagos",
      code: "LA",
      status: "Active",
      lgas: [],
      totalProperties: 45,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
  ])

  const columns = [
    {
      header: "State Name",
      cell: ({ row }: { row: { original: State } }) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.name}</span>
        </div>
      ),
    },
    {
      header: "Code",
      accessorKey: "code",
    },
    {
      header: "Total Properties",
      accessorKey: "totalProperties",
    },
    {
      header: "Status",
      cell: ({ row }: { row: { original: State } }) => {
        const state = row.original
        const colors = {
          Active: "bg-green-500",
          Inactive: "bg-gray-500",
        }
        return <Badge className={colors[state.status]}>{state.status}</Badge>
      },
    },
    {
      header: "Actions",
      cell: ({ row }: { row: { original: State } }) => (
        <ActionMenu
          items={[
            { label: "View Details", onClick: () => {} },
            { label: "Manage LGAs", onClick: () => {}, permission: "update:location" },
            { label: "Edit", onClick: () => {}, permission: "update:location" },
            { label: "Delete", onClick: () => {}, permission: "delete:location" },
          ]}
        />
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Locations"
        description="Manage states, LGAs, and areas for property listings"
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Location
          </Button>
        }
      />

      <Card>
        <DataTable
          columns={columns}
          data={states}
          searchKey="name"
          searchPlaceholder="Search locations..."
          searchVariant="gold"
        />
      </Card>
    </div>
  )
}
