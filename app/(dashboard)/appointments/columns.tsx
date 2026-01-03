"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Calendar, Clock, MapPin, Video, User, Building2, AlertCircle } from "lucide-react"
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

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Urgent":
      return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
    case "High":
      return "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20"
    case "Medium":
      return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20"
    case "Low":
      return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
    default:
      return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20"
  }
}

export const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Appointment" />
    ),
    cell: ({ row }) => {
      const appointment = row.original
      return (
        <div className="flex flex-col min-w-[250px]">
          <div className="flex items-center gap-2">
            <span className="font-medium">{appointment.title}</span>
            {appointment.priority && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPriorityColor(appointment.priority)}`}>
                {appointment.priority}
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground mt-1">{appointment.type}</span>
          {appointment.propertyName && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <Building2 className="h-3 w-3" />
              <span>{appointment.propertyName}</span>
            </div>
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
              {format(new Date(appointment.startTime), "hh:mm a")} - {format(new Date(appointment.endTime), "hh:mm a")}
            </span>
          </div>
          {isPast && appointment.status === "Scheduled" && (
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
    accessorKey: "clientName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client" />
    ),
    cell: ({ row }) => {
      const appointment = row.original
      return (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{appointment.clientName}</span>
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
    accessorKey: "duration",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Duration" />
    ),
    cell: ({ row }) => {
      const duration = row.getValue("duration") as number
      const hours = Math.floor(duration / 60)
      const minutes = duration % 60
      return (
        <span className="text-sm">
          {hours > 0 && `${hours}h `}{minutes > 0 && `${minutes}m`}
        </span>
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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(appointment.id)}>
              Copy appointment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit appointment</DropdownMenuItem>
            {appointment.isVirtual && appointment.meetingLink && (
              <DropdownMenuItem>Join meeting</DropdownMenuItem>
            )}
            <DropdownMenuItem>Send reminder</DropdownMenuItem>
            <DropdownMenuSeparator />
            {appointment.status === "Scheduled" && (
              <>
                <DropdownMenuItem>Confirm appointment</DropdownMenuItem>
                <DropdownMenuItem>Reschedule</DropdownMenuItem>
              </>
            )}
            {appointment.status === "Confirmed" && (
              <DropdownMenuItem>Mark as completed</DropdownMenuItem>
            )}
            {appointment.status === "Completed" && appointment.followUpRequired && (
              <DropdownMenuItem>Schedule follow-up</DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Cancel appointment</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
