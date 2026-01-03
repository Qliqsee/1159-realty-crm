"use client"

import { useState } from "react"
import { Plus, FileText, Video } from "lucide-react"
import { Button } from "@/components/buttons/button"
import { Card } from "@/components/cards/card"
import { Badge } from "@/components/badges/badge"
import { PageHeader } from "@/components/layout/page-header"
import { DataTable } from "@/components/data/data-table"
import { ActionMenu } from "@/components/overlays/action-menu"
import type { DocumentGroup } from "@/types"

export default function DocumentsPage() {
  const [groups] = useState<DocumentGroup[]>([
    {
      id: "1",
      name: "Property Legal Documents",
      description: "Legal documents for all properties",
      type: "General",
      referenceDocuments: [],
      tutorialVideos: [],
      requiredClientDocuments: [],
      totalDocuments: 12,
      totalVideos: 3,
      createdBy: "user-1",
      createdByName: "Admin User",
      createdAt: new Date("2024-01-05"),
      updatedAt: new Date("2024-01-20"),
    },
  ])

  const columns = [
    {
      header: "Group Name",
      accessorKey: "name",
    },
    {
      header: "Type",
      cell: ({ row }: { row: { original: DocumentGroup } }) => (
        <Badge variant="outline">{row.original.type}</Badge>
      ),
    },
    {
      header: "Documents",
      cell: ({ row }: { row: { original: DocumentGroup } }) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.totalDocuments}</span>
        </div>
      ),
    },
    {
      header: "Videos",
      cell: ({ row }: { row: { original: DocumentGroup } }) => (
        <div className="flex items-center gap-2">
          <Video className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.totalVideos}</span>
        </div>
      ),
    },
    {
      header: "Created By",
      accessorKey: "createdByName",
    },
    {
      header: "Actions",
      cell: ({ row }: { row: { original: DocumentGroup } }) => (
        <ActionMenu
          items={[
            { label: "View Details", onClick: () => {} },
            { label: "Manage Documents", onClick: () => {}, permission: "update:document" },
            { label: "Edit", onClick: () => {}, permission: "update:document" },
            { label: "Delete", onClick: () => {}, permission: "delete:document" },
          ]}
        />
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Document Groups"
        description="Manage document groups, tutorials, and client uploads"
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Group
          </Button>
        }
      />

      <Card>
        <DataTable
          columns={columns}
          data={groups}
          searchKey="name"
          searchPlaceholder="Search groups..."
        />
      </Card>
    </div>
  )
}
