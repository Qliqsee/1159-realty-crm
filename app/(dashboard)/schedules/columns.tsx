"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Calendar, Clock, MapPin, Trash2, Users } from "lucide-react"
import type { Schedule } from "@/types"
import { Button } from "@/components/buttons/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/overlays/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/dialogs/alert-dialog"
import { DataTableColumnHeader } from "@/components/data/data-table-column-header"
import { format } from "date-fns"

interface ColumnsProps {
  onDelete: (id: string) => void
}

interface ActionsCellProps {
  schedule: Schedule
  onDelete: (id: string) => void
}

function ActionsCell({ schedule, onDelete }: ActionsCellProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = () => {
    onDelete(schedule.id)
    setShowDeleteDialog(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete schedule
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Schedule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this schedule? This will cancel all{" "}
              <span className="font-semibold text-foreground">
                {schedule.appointmentCount || 0} appointment(s)
              </span>{" "}
              attached to it. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export const columns = ({ onDelete }: ColumnsProps): ColumnDef<Schedule>[] => [
  {
    accessorKey: "dateTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date & Time" />
    ),
    cell: ({ row }) => {
      const schedule = row.original
      const isToday = format(new Date(schedule.dateTime), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")

      return (
        <div className="flex flex-col min-w-[160px]">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span className={`text-sm font-medium ${isToday ? "text-primary" : ""}`}>
              {format(new Date(schedule.dateTime), "MMM dd, yyyy")}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {format(new Date(schedule.dateTime), "hh:mm a")}
            </span>
          </div>
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
      const schedule = row.original
      return (
        <div className="flex items-center gap-2 min-w-[180px]">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{schedule.location}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      return <span className="text-sm">{row.getValue("description")}</span>
    },
  },
  {
    accessorKey: "appointmentCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Appointments" />
    ),
    cell: ({ row }) => {
      const count = row.getValue("appointmentCount") as number
      return (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{count}</span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const schedule = row.original
      return <ActionsCell schedule={schedule} onDelete={onDelete} />
    },
  },
]
