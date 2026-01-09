"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Calendar, Clock, MapPin, Video, AlertCircle } from "lucide-react"
import type { Appointment } from "@/types"
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

interface ColumnsProps {
  onCancelAppointment: (appointment: Appointment) => void
  onSendReminder: (appointment: Appointment) => void
}

export const columns = ({ onCancelAppointment, onSendReminder }: ColumnsProps): ColumnDef<Appointment>[] => [
  {
    accessorKey: "interestedClients",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Interested Clients" />
    ),
    cell: ({ row }) => {
      const appointment = row.original
      const count = appointment.interestedClients?.length || 0
      return (
        <span className="text-sm font-medium">
          {count} {count === 1 ? 'client' : 'clients'}
        </span>
      )
    },
  },
  {
    accessorKey: "propertyName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Property" />
    ),
    cell: ({ row }) => {
      return <span className="text-sm">{row.getValue("propertyName")}</span>
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
    accessorKey: "scheduledDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date & Time" />
    ),
    cell: ({ row }) => {
      const appointment = row.original
      const isPast = new Date(appointment.scheduledDate) < new Date()
      const isToday = format(new Date(appointment.scheduledDate), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")

      return (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span className={`text-sm font-medium ${isToday ? "text-primary" : ""}`}>
              {format(new Date(appointment.scheduledDate), "MMM dd, yyyy")}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {appointment.inspectionTime}
            </span>
          </div>
          {isPast && appointment.status === "Active" && (
            <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 mt-1">
              <AlertCircle className="h-3 w-3" />
              <span>Past due</span>
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => {
      const appointment = row.original
      return (
        <div className="flex items-center gap-2 min-w-[180px]">
          {appointment.isVirtual ? (
            <>
              <Video className="h-4 w-4 text-primary" />
              <span className="text-sm">Virtual Meeting</span>
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{appointment.location}</span>
            </>
          )}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const appointment = row.original

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
            <DropdownMenuItem>Edit appointment</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSendReminder(appointment)}>
              Send reminder
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {appointment.status === "Active" && (
              <>
                <DropdownMenuItem>Reschedule</DropdownMenuItem>
                <DropdownMenuItem>Mark as completed</DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onCancelAppointment(appointment)}
            >
              Cancel appointment
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
