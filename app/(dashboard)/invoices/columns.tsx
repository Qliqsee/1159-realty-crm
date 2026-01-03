"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, User, FileText, Calendar, AlertCircle, Send } from "lucide-react"
import type { Invoice } from "@/types"
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

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "invoiceNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Invoice" />
    ),
    cell: ({ row }) => {
      const invoice = row.original
      return (
        <div className="flex flex-col min-w-[180px]">
          <div className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-medium">{invoice.invoiceNumber}</span>
          </div>
          <span className="text-xs text-muted-foreground mt-1">{invoice.type}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "clientName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client" />
    ),
    cell: ({ row }) => {
      const invoice = row.original
      return (
        <div className="flex items-center gap-2 min-w-[150px]">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{invoice.clientName}</span>
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
      const invoice = row.original
      return (
        <div className="flex flex-col gap-1">
          <StatusBadge status={row.getValue("status")} />
          {invoice.status === "Overdue" && invoice.dueDate && (
            <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="h-3 w-3" />
              <span>
                {Math.ceil((Date.now() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24))}d overdue
              </span>
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
    accessorKey: "total",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const invoice = row.original
      return (
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{formatCurrency(invoice.total)}</span>
          {invoice.status === "Partially Paid" && (
            <span className="text-xs text-muted-foreground">
              {formatCurrency(invoice.amountPaid)} paid
            </span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "amountDue",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount Due" />
    ),
    cell: ({ row }) => {
      const invoice = row.original

      if (invoice.status === "Paid") {
        return <span className="text-sm text-green-600 dark:text-green-400 font-medium">Paid</span>
      }

      return (
        <span className={`font-semibold text-sm ${invoice.status === "Overdue" ? "text-red-600 dark:text-red-400" : ""}`}>
          {formatCurrency(invoice.amountDue)}
        </span>
      )
    },
  },
  {
    accessorKey: "issueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Issue Date" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm">
            {format(new Date(row.getValue("issueDate")), "MMM dd, yyyy")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) => {
      const invoice = row.original
      const isOverdue = invoice.status === "Overdue"
      const daysUntil = Math.ceil((new Date(invoice.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

      return (
        <div className="flex flex-col">
          <span className={`text-sm ${isOverdue ? "text-red-600 dark:text-red-400 font-medium" : ""}`}>
            {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
          </span>
          {!isOverdue && daysUntil > 0 && daysUntil <= 7 && invoice.status === "Sent" && (
            <span className="text-xs text-orange-600 dark:text-orange-400 mt-0.5">
              Due in {daysUntil}d
            </span>
          )}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const invoice = row.original

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(invoice.id)}>
              Copy invoice ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View invoice</DropdownMenuItem>
            <DropdownMenuItem>Download PDF</DropdownMenuItem>
            <DropdownMenuItem>Print invoice</DropdownMenuItem>
            <DropdownMenuSeparator />
            {invoice.status === "Draft" && (
              <>
                <DropdownMenuItem>Edit invoice</DropdownMenuItem>
                <DropdownMenuItem>Send invoice</DropdownMenuItem>
              </>
            )}
            {(invoice.status === "Sent" || invoice.status === "Overdue") && (
              <>
                <DropdownMenuItem>Send reminder</DropdownMenuItem>
                <DropdownMenuItem>Record payment</DropdownMenuItem>
              </>
            )}
            {invoice.status === "Partially Paid" && (
              <DropdownMenuItem>Record payment</DropdownMenuItem>
            )}
            <DropdownMenuItem>View client</DropdownMenuItem>
            {invoice.enrollmentId && (
              <DropdownMenuItem>View enrollment</DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {invoice.status !== "Paid" && invoice.status !== "Cancelled" && (
              <DropdownMenuItem className="text-destructive">Cancel invoice</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
