"use client"

import { useState } from "react"
import { Plus, FileText, Check, X } from "lucide-react"
import { Button } from "@/components/buttons/button"
import { Card } from "@/components/cards/card"
import { Badge } from "@/components/badges/badge"
import { PageHeader } from "@/components/layout/page-header"
import { DataTable } from "@/components/data/data-table"
import { ActionMenu } from "@/components/overlays/action-menu"
import { format } from "date-fns"
import type { ManualPayment } from "@/types"

export default function PaymentsPage() {
  const [payments] = useState<ManualPayment[]>([
    {
      id: "1",
      clientId: "client-1",
      clientName: "Sarah Johnson",
      enrollmentId: "enrollment-1",
      enrollmentNumber: "ENR-001",
      amount: 500000,
      paymentDate: new Date("2024-01-20"),
      paymentMethod: "Bank Transfer",
      transactionReference: "TXN-12345",
      status: "Pending",
      submittedAt: new Date("2024-01-20"),
      resubmissionCount: 0,
      createdAt: new Date("2024-01-20"),
      updatedAt: new Date("2024-01-20"),
    },
  ])

  const columns = [
    {
      header: "Client",
      accessorKey: "clientName",
    },
    {
      header: "Enrollment",
      accessorKey: "enrollmentNumber",
    },
    {
      header: "Amount",
      cell: ({ row }: { row: { original: ManualPayment } }) =>
        `₦${row.original.amount?.toLocaleString() || '0'}`,
    },
    {
      header: "Payment Date",
      cell: ({ row }: { row: { original: ManualPayment } }) =>
        format(row.original.paymentDate, "PP"),
    },
    {
      header: "Method",
      accessorKey: "paymentMethod",
    },
    {
      header: "Reference",
      accessorKey: "transactionReference",
    },
    {
      header: "Status",
      cell: ({ row }: { row: { original: ManualPayment } }) => {
        const payment = row.original
        const colors = {
          Pending: "bg-yellow-500",
          Approved: "bg-green-500",
          Rejected: "bg-red-500",
        }
        return <Badge className={colors[payment.status]}>{payment.status}</Badge>
      },
    },
    {
      header: "Actions",
      cell: ({ row }: { row: { original: ManualPayment } }) => (
        <ActionMenu
          items={[
            { label: "View Details", onClick: () => {} },
            { label: "Approve", icon: Check, onClick: () => {}, permission: "approve:payment" },
            { label: "Reject", icon: X, onClick: () => {}, permission: "approve:payment" },
            { label: "View Receipt", icon: FileText, onClick: () => {} },
          ]}
        />
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manual Payments"
        description="Review and approve manual payment submissions"
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Payment
          </Button>
        }
      />

      <Card>
        <DataTable
          columns={columns}
          data={payments}
          searchKey="clientName"
          searchPlaceholder="Search by client name..."
          searchVariant="gold"
        />
      </Card>
    </div>
  )
}
