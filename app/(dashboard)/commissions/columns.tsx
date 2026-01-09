"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, DollarSign, TrendingUp, Calendar, User } from "lucide-react"
import type { Commission } from "@/types"
import { Button } from "@/components/buttons/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/overlays/dropdown-menu"
import { StatusBadge } from "@/components/badges/status-badge"
import { DataTableColumnHeader } from "@/components/data/data-table-column-header"
import { format } from "date-fns"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount)
}

export const columns: ColumnDef<Commission>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Commission" />
    ),
    cell: ({ row }) => {
      const commission = row.original
      return (
        <div className="flex flex-col min-w-[180px]">
          <span className="font-medium">{commission.id}</span>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              commission.recipientType === "Agent"
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                : "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
            }`}>
              {commission.recipientType}
            </span>
            <span className="text-xs text-muted-foreground">{commission.commissionPercentage}%</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "recipientName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Recipient" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 min-w-[150px]">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{row.getValue("recipientName")}</span>
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
    accessorKey: "saleAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sales Value" />
    ),
    cell: ({ row }) => {
      return (
        <span className="text-sm font-medium">{formatCurrency(row.getValue("saleAmount"))}</span>
      )
    },
  },
  {
    accessorKey: "commissionAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Commission" />
    ),
    cell: ({ row }) => {
      const commission = row.original
      return (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-primary" />
            <span className="font-semibold text-sm">{formatCurrency(commission.commissionAmount)}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "commissionAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Net Amount" />
    ),
    cell: ({ row }) => {
      const commission = row.original
      return (
        <div className="flex flex-col">
          <span className="font-bold text-sm text-primary">{formatCurrency(commission.commissionAmount)}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "enrollmentNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Enrollment" />
    ),
    cell: ({ row }) => {
      return (
        <span className="text-sm text-muted-foreground">{row.getValue("enrollmentNumber")}</span>
      )
    },
  },
  {
    accessorKey: "earnedDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Earned Date" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm">
            {format(new Date(row.getValue("earnedDate")), "MMM dd, yyyy")}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const commission = row.original

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(commission.id)}>
              Copy commission ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Download statement</DropdownMenuItem>
            <DropdownMenuItem>View enrollment</DropdownMenuItem>
            <DropdownMenuItem>View recipient</DropdownMenuItem>
            <DropdownMenuSeparator />
            {commission.status === "Pending" && (
              <>
                <DropdownMenuItem>Mark as paid</DropdownMenuItem>
                <DropdownMenuItem>Edit commission</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Cancel commission</DropdownMenuItem>
              </>
            )}
            {commission.status === "Paid" && (
              <DropdownMenuItem>View payment receipt</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
