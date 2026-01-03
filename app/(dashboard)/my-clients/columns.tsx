"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Mail, Phone, Building2, TrendingUp, UserCheck, UserCog } from "lucide-react"
import type { Client } from "@/types"
import { StatusBadge } from "@/components/badges/status-badge"
import { DataTableColumnHeader } from "@/components/data/data-table-column-header"
import { format } from "date-fns"
import Link from "next/link"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount)
}

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client" />
    ),
    cell: ({ row }) => {
      const client = row.original
      return (
        <div className="flex flex-col min-w-[200px]">
          <Link
            href={`/clients/${client.id}`}
            className="font-medium hover:underline text-primary"
          >
            {client.fullName}
          </Link>
          <div className="flex flex-col gap-0.5 mt-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span>{client.email}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span>{client.phone}</span>
            </div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "kycStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="KYC Status" />
    ),
    cell: ({ row }) => {
      const client = row.original
      const kycStatus = client.kycStatus
      const completion = client.kycCompletionPercentage || 0

      return (
        <div className="flex flex-col gap-1">
          <StatusBadge status={kycStatus} />
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${completion}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{completion}%</span>
          </div>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "assignedAgentName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assigned Agent" />
    ),
    cell: ({ row }) => {
      const client = row.original
      return (
        <div className="flex items-center gap-2">
          <UserCog className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{client.assignedAgentName || "Unassigned"}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "isPartner",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Partnership" />
    ),
    cell: ({ row }) => {
      const client = row.original

      if (!client.isPartner) {
        return <span className="text-sm text-muted-foreground">N/A</span>
      }

      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <UserCheck className="h-3.5 w-3.5 text-primary" />
            <span className="text-sm font-medium">Partner</span>
          </div>
          {client.partnershipStatus && (
            <StatusBadge status={client.partnershipStatus} />
          )}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "totalPropertiesOwned",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Enrollments" />
    ),
    cell: ({ row }) => {
      const client = row.original
      return (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{client.totalPropertiesOwned}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "totalSpent",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Spent" />
    ),
    cell: ({ row }) => {
      const client = row.original
      return (
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{formatCurrency(client.totalSpent)}</span>
          {client.isPartner && client.totalCommissionGenerated > 0 && (
            <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
              <TrendingUp className="h-3 w-3" />
              <span>{formatCurrency(client.totalCommissionGenerated)} earned</span>
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "joinedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Joined" />
    ),
    cell: ({ row }) => {
      return (
        <span className="text-sm text-muted-foreground">
          {format(new Date(row.getValue("joinedAt")), "MMM dd, yyyy")}
        </span>
      )
    },
  },
]
