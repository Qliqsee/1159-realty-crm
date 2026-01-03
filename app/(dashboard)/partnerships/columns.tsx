"use client"

import { ColumnDef } from "@tantml:react-table"
import { MoreHorizontal, Handshake, TrendingUp, DollarSign, Users, Star } from "lucide-react"
import type { Partnership } from "@/types"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StatusBadge } from "@/components/common/status-badge"
import { DataTableColumnHeader } from "@/components/tables/data-table-column-header"
import { format } from "date-fns"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount)
}

export const columns: ColumnDef<Partnership>[] = [
  {
    accessorKey: "partnershipNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Partnership" />
    ),
    cell: ({ row }) => {
      const partnership = row.original
      return (
        <div className="flex flex-col min-w-[200px]">
          <span className="font-medium">{partnership.partnershipNumber}</span>
          <span className="text-sm text-muted-foreground mt-1">{partnership.partnerName}</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
              {partnership.type}
            </span>
            {partnership.rating && (
              <div className="flex items-center gap-0.5">
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                <span className="text-xs font-medium">{partnership.rating}</span>
              </div>
            )}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return <StatusBadge status={row.getValue("status")} />
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "totalReferrals",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Referrals" />
    ),
    cell: ({ row }) => {
      const partnership = row.original
      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{partnership.totalReferrals}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-green-600 dark:text-green-400">{partnership.successfulReferrals} converted</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-primary" />
            <span className="text-xs font-medium">{partnership.conversionRate}%</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "totalSalesValue",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sales Value" />
    ),
    cell: ({ row }) => {
      return (
        <span className="font-semibold text-sm">{formatCurrency(row.getValue("totalSalesValue"))}</span>
      )
    },
  },
  {
    accessorKey: "totalCommissionEarned",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Commission" />
    ),
    cell: ({ row }) => {
      const partnership = row.original
      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-primary" />
            <span className="font-semibold text-sm">{formatCurrency(partnership.totalCommissionEarned)}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            Rate: {partnership.commissionRate}%
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "commissionPending",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pending Payment" />
    ),
    cell: ({ row }) => {
      const partnership = row.original

      if (partnership.commissionPending === 0) {
        return <span className="text-sm text-muted-foreground">None</span>
      }

      return (
        <div className="flex flex-col">
          <span className="font-semibold text-sm text-orange-600 dark:text-orange-400">
            {formatCurrency(partnership.commissionPending)}
          </span>
          {partnership.commissionPaid > 0 && (
            <span className="text-xs text-muted-foreground">
              {formatCurrency(partnership.commissionPaid)} paid
            </span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "lastReferralDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Activity" />
    ),
    cell: ({ row }) => {
      const lastReferralDate = row.getValue("lastReferralDate") as Date | undefined

      if (!lastReferralDate) {
        return <span className="text-sm text-muted-foreground">No activity</span>
      }

      return (
        <span className="text-sm">
          {format(new Date(lastReferralDate), "MMM dd, yyyy")}
        </span>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const partnership = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(partnership.id)}>
              Copy partnership ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit partnership</DropdownMenuItem>
            <DropdownMenuItem>View partner profile</DropdownMenuItem>
            <DropdownMenuItem>View referrals</DropdownMenuItem>
            <DropdownMenuSeparator />
            {partnership.status === "Pending" && (
              <>
                <DropdownMenuItem>Approve partnership</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Reject partnership</DropdownMenuItem>
              </>
            )}
            {partnership.status === "Approved" && (
              <>
                <DropdownMenuItem>View commission history</DropdownMenuItem>
                <DropdownMenuItem>Process payment</DropdownMenuItem>
                <DropdownMenuItem>Send statement</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Suspend partnership</DropdownMenuItem>
              </>
            )}
            {partnership.status === "Suspended" && (
              <DropdownMenuItem>Reactivate partnership</DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Terminate partnership</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
