"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, CheckCircle, XCircle } from "lucide-react"
import type { Partnership } from "@/types"
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
import Link from "next/link"

export const columns: ColumnDef<Partnership>[] = [
  {
    accessorKey: "partnerName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const partnership = row.original
      return (
        <Link
          href={`/partnerships/${partnership.id}`}
          className="font-medium text-primary hover:underline"
        >
          {partnership.partnerName}
        </Link>
      )
    },
  },
  {
    accessorKey: "partnerEmail",
    header: "Contact",
    cell: ({ row }) => {
      const partnership = row.original
      return (
        <div className="flex flex-col gap-0.5 min-w-[200px]">
          <span className="text-sm">{partnership.partnerEmail}</span>
          <span className="text-sm text-muted-foreground">{partnership.partnerPhone}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Application Status" />
    ),
    cell: ({ row }) => {
      return <StatusBadge status={row.getValue("status")} />
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    header: "Action",
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
            {partnership.status === "Pending" && (
              <>
                <DropdownMenuItem className="text-green-600 dark:text-green-400">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </DropdownMenuItem>
              </>
            )}
            {partnership.status === "Approved" && (
              <DropdownMenuItem disabled>
                Application already approved
              </DropdownMenuItem>
            )}
            {partnership.status === "Rejected" && (
              <DropdownMenuItem disabled>
                Application already rejected
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
