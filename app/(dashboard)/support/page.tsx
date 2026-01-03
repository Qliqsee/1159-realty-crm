"use client"

import { useState } from "react"
import { Plus, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/common/page-header"
import { DataTable } from "@/components/common/data-table"
import { ActionMenu } from "@/components/common/action-menu"
import { format } from "date-fns"
import type { SupportTicket } from "@/types"

export default function SupportPage() {
  const [tickets] = useState<SupportTicket[]>([
    {
      id: "1",
      ticketNumber: "TKT-001",
      clientId: "client-1",
      clientName: "Sarah Johnson",
      clientEmail: "sarah.j@example.com",
      clientPhone: "+234-803-234-5678",
      subject: "Payment issue",
      description: "Unable to complete payment for enrollment",
      category: "Payment",
      priority: "High",
      status: "Open",
      messages: [],
      attachments: [],
      createdAt: new Date("2024-01-22"),
      updatedAt: new Date("2024-01-22"),
    },
  ])

  const columns = [
    {
      header: "Ticket #",
      accessorKey: "ticketNumber",
    },
    {
      header: "Client",
      accessorKey: "clientName",
    },
    {
      header: "Subject",
      accessorKey: "subject",
    },
    {
      header: "Category",
      cell: ({ row }: { row: { original: SupportTicket } }) => (
        <Badge variant="outline">{row.original.category}</Badge>
      ),
    },
    {
      header: "Priority",
      cell: ({ row }: { row: { original: SupportTicket } }) => {
        const ticket = row.original
        const colors = {
          Low: "bg-gray-500",
          Medium: "bg-blue-500",
          High: "bg-orange-500",
          Urgent: "bg-red-500",
        }
        return <Badge className={colors[ticket.priority]}>{ticket.priority}</Badge>
      },
    },
    {
      header: "Status",
      cell: ({ row }: { row: { original: SupportTicket } }) => {
        const ticket = row.original
        const colors = {
          Open: "bg-blue-500",
          "In Progress": "bg-yellow-500",
          Resolved: "bg-green-500",
          Closed: "bg-gray-500",
        }
        return <Badge className={colors[ticket.status]}>{ticket.status}</Badge>
      },
    },
    {
      header: "Created",
      cell: ({ row }: { row: { original: SupportTicket } }) =>
        format(row.original.createdAt, "PP"),
    },
    {
      header: "Actions",
      cell: ({ row }: { row: { original: SupportTicket } }) => (
        <ActionMenu
          items={[
            { label: "View Details", onClick: () => {} },
            { label: "Reply", icon: MessageSquare, onClick: () => {}, permission: "update:support" },
            { label: "Assign to Me", onClick: () => {}, permission: "update:support" },
            { label: "Close", onClick: () => {}, permission: "update:support" },
          ]}
        />
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support Tickets"
        description="Manage customer support tickets and inquiries"
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </Button>
        }
      />

      <Card>
        <DataTable
          columns={columns}
          data={tickets}
          searchKey="subject"
          searchPlaceholder="Search tickets..."
        />
      </Card>
    </div>
  )
}
