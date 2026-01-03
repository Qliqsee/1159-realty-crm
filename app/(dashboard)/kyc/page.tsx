"use client"

import { useState } from "react"
import { Plus, FileCheck, Eye } from "lucide-react"
import { Button } from "@/components/buttons/button"
import { Card } from "@/components/cards/card"
import { Badge } from "@/components/badges/badge"
import { Progress } from "@/components/feedback/progress"
import { PageHeader } from "@/components/layout/page-header"
import { DataTable } from "@/components/data/data-table"
import { ActionMenu } from "@/components/overlays/action-menu"
import type { KYCSubmission } from "@/types"

export default function KYCPage() {
  const [submissions] = useState<KYCSubmission[]>([
    {
      id: "1",
      clientId: "client-1",
      clientName: "Sarah Johnson",
      identityDocumentStatus: "Approved",
      bankDetailsStatus: "Pending",
      employmentStatus_DocumentStatus: "Approved",
      nextOfKinStatus: "Approved",
      guarantorStatus: "Not Submitted",
      overallStatus: "Pending",
      completionPercentage: 75,
      resubmissionCount: 0,
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-20"),
    },
  ])

  const columns = [
    {
      header: "Client",
      accessorKey: "clientName",
    },
    {
      header: "Completion",
      cell: ({ row }: { row: { original: KYCSubmission } }) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Progress value={row.original.completionPercentage} className="w-24" />
            <span className="text-sm">{row.original.completionPercentage}%</span>
          </div>
        </div>
      ),
    },
    {
      header: "Identity",
      cell: ({ row }: { row: { original: KYCSubmission } }) =>
        <Badge variant="outline">{row.original.identityDocumentStatus}</Badge>,
    },
    {
      header: "Bank",
      cell: ({ row }: { row: { original: KYCSubmission } }) =>
        <Badge variant="outline">{row.original.bankDetailsStatus}</Badge>,
    },
    {
      header: "Employment",
      cell: ({ row }: { row: { original: KYCSubmission } }) =>
        <Badge variant="outline">{row.original.employmentStatus_DocumentStatus}</Badge>,
    },
    {
      header: "Overall Status",
      cell: ({ row }: { row: { original: KYCSubmission } }) => {
        const kyc = row.original
        const colors = {
          Pending: "bg-yellow-500",
          Approved: "bg-green-500",
          Rejected: "bg-red-500",
          Incomplete: "bg-orange-500",
        }
        return <Badge className={colors[kyc.overallStatus]}>{kyc.overallStatus}</Badge>
      },
    },
    {
      header: "Actions",
      cell: ({ row }: { row: { original: KYCSubmission } }) => (
        <ActionMenu
          items={[
            { label: "Review", icon: Eye, onClick: () => {}, permission: "view:kyc" },
            { label: "Approve", icon: FileCheck, onClick: () => {}, permission: "approve:kyc" },
          ]}
        />
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="KYC Review"
        description="Review and approve client KYC submissions"
      />

      <Card>
        <DataTable
          columns={columns}
          data={submissions}
          searchKey="clientName"
          searchPlaceholder="Search by client name..."
        />
      </Card>
    </div>
  )
}
