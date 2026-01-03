"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, User, Building2, TrendingUp, AlertTriangle, Calendar } from "lucide-react"
import type { Enrollment } from "@/types"
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

export const columns: ColumnDef<Enrollment>[] = [
  {
    accessorKey: "enrollmentNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Enrollment" />
    ),
    cell: ({ row }) => {
      const enrollment = row.original
      return (
        <div className="flex flex-col min-w-[180px]">
          <span className="font-medium">{enrollment.enrollmentNumber}</span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <User className="h-3 w-3" />
            <span>{enrollment.clientName}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "propertyName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Property" />
    ),
    cell: ({ row }) => {
      const enrollment = row.original
      return (
        <div className="flex flex-col min-w-[200px]">
          <div className="flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm font-medium">{enrollment.propertyName}</span>
          </div>
          {enrollment.plotNumber && (
            <span className="text-xs text-muted-foreground mt-1">Plot: {enrollment.plotNumber}</span>
          )}
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
      const enrollment = row.original
      return (
        <div className="flex flex-col gap-1">
          <StatusBadge status={row.getValue("status")} />
          {enrollment.daysOverdue > 0 && (
            <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
              <AlertTriangle className="h-3 w-3" />
              <span>{enrollment.daysOverdue}d overdue</span>
            </div>
          )}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "propertyPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Property Value" />
    ),
    cell: ({ row }) => {
      return (
        <span className="text-sm font-semibold">{formatCurrency(row.getValue("propertyPrice"))}</span>
      )
    },
  },
  {
    accessorKey: "totalPaid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Progress" />
    ),
    cell: ({ row }) => {
      const enrollment = row.original
      const percentage = enrollment.completionPercentage || 0

      return (
        <div className="flex flex-col gap-1.5 min-w-[150px]">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-primary">{formatCurrency(enrollment.totalPaid)}</span>
            <span className="text-muted-foreground">{percentage}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-yellow-600 rounded-full transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">
            {formatCurrency(enrollment.outstandingBalance)} remaining
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "monthlyPayment",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Monthly Payment" />
    ),
    cell: ({ row }) => {
      const enrollment = row.original
      return (
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{formatCurrency(enrollment.monthlyPayment)}</span>
          <span className="text-xs text-muted-foreground">{enrollment.paymentDuration} months</span>
        </div>
      )
    },
  },
  {
    accessorKey: "nextPaymentDue",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Next Payment" />
    ),
    cell: ({ row }) => {
      const enrollment = row.original

      if (!enrollment.nextPaymentDue) {
        return <span className="text-sm text-muted-foreground">N/A</span>
      }

      const isOverdue = new Date(enrollment.nextPaymentDue) < new Date()
      const daysUntil = Math.ceil((new Date(enrollment.nextPaymentDue).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

      return (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span className={`text-sm ${isOverdue ? "text-red-600 dark:text-red-400 font-medium" : ""}`}>
              {format(new Date(enrollment.nextPaymentDue), "MMM dd, yyyy")}
            </span>
          </div>
          {!isOverdue && daysUntil <= 7 && (
            <span className="text-xs text-orange-600 dark:text-orange-400 mt-1">
              Due in {daysUntil} days
            </span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "agentName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Agent" />
    ),
    cell: ({ row }) => {
      return <span className="text-sm">{row.getValue("agentName")}</span>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const enrollment = row.original

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(enrollment.id)}>
              Copy enrollment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit enrollment</DropdownMenuItem>
            <DropdownMenuItem>View client profile</DropdownMenuItem>
            <DropdownMenuItem>View property</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View payment history</DropdownMenuItem>
            <DropdownMenuItem>Record payment</DropdownMenuItem>
            <DropdownMenuItem>Generate invoice</DropdownMenuItem>
            <DropdownMenuItem>Send reminder</DropdownMenuItem>
            <DropdownMenuSeparator />
            {enrollment.status === "Active" && (
              <>
                <DropdownMenuItem>Suspend enrollment</DropdownMenuItem>
                <DropdownMenuItem>Mark as completed</DropdownMenuItem>
              </>
            )}
            {enrollment.status === "Suspended" && (
              <DropdownMenuItem>Reactivate enrollment</DropdownMenuItem>
            )}
            <DropdownMenuItem className="text-destructive">Cancel enrollment</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
