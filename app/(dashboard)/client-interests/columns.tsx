"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, User, Building2, MessageSquare, ExternalLink } from "lucide-react"
import type { ClientInterest } from "@/types"
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
import Link from "next/link"

export const columns: ColumnDef<ClientInterest>[] = [
  {
    accessorKey: "clientName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client" />
    ),
    cell: ({ row }) => {
      const interest = row.original
      return (
        <div className="flex items-center gap-2 min-w-[180px]">
          <div className="p-2 rounded-lg bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <Link
              href={`/clients/${interest.clientId}`}
              className="font-medium hover:underline"
              target="_blank"
            >
              {interest.clientName}
            </Link>
            <span className="text-xs text-muted-foreground">ID: {interest.clientId}</span>
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
      const interest = row.original
      return (
        <div className="flex items-center gap-2 min-w-[200px]">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex flex-col">
            <Link
              href={`/properties/${interest.propertyId}`}
              className="font-medium hover:underline"
              target="_blank"
            >
              {interest.propertyName}
            </Link>
            <span className="text-xs text-muted-foreground">ID: {interest.propertyId}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => {
      const message = row.original.message
      return message ? (
        <div className="flex items-start gap-2 max-w-[300px]">
          <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
          <span className="text-sm text-muted-foreground line-clamp-2">{message}</span>
        </div>
      ) : (
        <span className="text-xs text-muted-foreground italic">No message</span>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status
      const statusColors = {
        New: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
        Contacted: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
        Converted: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
        Lost: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
      }
      return (
        <StatusBadge
          status={status}
          className={statusColors[status]}
        />
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expressed On" />
    ),
    cell: ({ row }) => {
      const date = row.original.createdAt
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{format(new Date(date), "MMM dd, yyyy")}</span>
          <span className="text-xs text-muted-foreground">{format(new Date(date), "hh:mm a")}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "contactedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contacted" />
    ),
    cell: ({ row }) => {
      const date = row.original.contactedAt
      return date ? (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{format(new Date(date), "MMM dd, yyyy")}</span>
          <span className="text-xs text-muted-foreground">{format(new Date(date), "hh:mm a")}</span>
        </div>
      ) : (
        <span className="text-xs text-muted-foreground italic">Not contacted</span>
      )
    },
  },
  {
    accessorKey: "convertedToEnrollmentId",
    header: "Enrollment",
    cell: ({ row }) => {
      const enrollmentId = row.original.convertedToEnrollmentId
      return enrollmentId ? (
        <Link
          href={`/enrollments/${enrollmentId}`}
          className="flex items-center gap-1 text-sm text-primary hover:underline"
          target="_blank"
        >
          {enrollmentId}
          <ExternalLink className="h-3 w-3" />
        </Link>
      ) : (
        <span className="text-xs text-muted-foreground italic">N/A</span>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const interest = row.original

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(interest.id)}>
              Copy Interest ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Client</DropdownMenuItem>
            <DropdownMenuItem>View Property</DropdownMenuItem>
            <DropdownMenuItem>Mark as Contacted</DropdownMenuItem>
            <DropdownMenuItem>Mark as Converted</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Mark as Lost</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
