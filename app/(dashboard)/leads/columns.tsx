"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Mail, Phone, Calendar, Copy, ExternalLink, Edit, UserPlus, Trash2 } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import type { Lead } from "@/types"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/dialogs/dialog"
import { StatusBadge } from "@/components/badges/status-badge"
import { DataTableColumnHeader } from "@/components/data/data-table-column-header"
import { AgentSelect } from "@/components/inputs/agent-select"
import { usePermissions } from "@/lib/hooks/use-permissions"
import { updateLead } from "@/lib/api/leads"
import { format } from "date-fns"
import { toast } from "sonner"

interface ColumnsProps {
  onEdit: (lead: Lead) => void
  onDelete: (id: string) => void
  onRefresh: () => void
}

function ActionsCell({ lead, onEdit, onDelete, onRefresh }: { lead: Lead } & ColumnsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const [selectedAgentId, setSelectedAgentId] = useState(lead.assignedAgentId || "")
  const [isAssigning, setIsAssigning] = useState(false)
  const { hasPermission, hasRole } = usePermissions()

  // Check if user can assign agents (Admin, Manager, Sales Manager)
  const canAssignAgent =
    hasRole("Admin") ||
    hasRole("Manager") ||
    hasRole("Sales Manager")

  const handleCopyId = () => {
    navigator.clipboard.writeText(lead.id)
    toast.success("Lead ID copied to clipboard")
  }

  const handleViewDetail = () => {
    window.location.href = `/leads/${lead.id}`
  }

  const handleAssignAgent = async () => {
    try {
      setIsAssigning(true)
      await updateLead(lead.id, { assignedAgentId: selectedAgentId })
      toast.success("Agent assigned successfully")
      setShowAssignDialog(false)
      onRefresh()
    } catch (error) {
      toast.error("Failed to assign agent")
      console.error(error)
    } finally {
      setIsAssigning(false)
    }
  }

  const handleDelete = () => {
    onDelete(lead.id)
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
          <DropdownMenuItem onClick={handleCopyId}>
            <Copy className="mr-2 h-4 w-4" />
            Copy lead ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleViewDetail}>
            <ExternalLink className="mr-2 h-4 w-4" />
            View details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(lead)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit lead
          </DropdownMenuItem>
          {canAssignAgent && (
            <DropdownMenuItem onClick={() => setShowAssignDialog(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Assign to agent
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete lead
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the lead "{lead.fullName}". This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Assign Agent Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Agent</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Agent</label>
              <AgentSelect value={selectedAgentId} onValueChange={setSelectedAgentId} />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAssignAgent} disabled={isAssigning}>
                {isAssigning ? "Assigning..." : "Assign"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export const columns = ({ onEdit, onDelete, onRefresh }: ColumnsProps): ColumnDef<Lead>[] => [
  {
    accessorKey: "fullName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      const lead = row.original
      return (
        <Link
          href={`/leads/${lead.id}`}
          className="flex flex-col cursor-pointer hover:underline"
        >
          <span className="font-medium">{lead.fullName}</span>
          <span className="text-xs text-muted-foreground">{lead.id}</span>
        </Link>
      )
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Contact" />,
    cell: ({ row }) => {
      const lead = row.original
      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-sm">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <span>{lead.email}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Phone className="h-3 w-3" />
            <span>{lead.phone}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      return <StatusBadge status={row.getValue("status")} />
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "source",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Source" />,
    cell: ({ row }) => {
      return <span className="text-sm text-muted-foreground">{row.getValue("source")}</span>
    },
  },
  {
    accessorKey: "assignedAgentName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Agent" />,
    cell: ({ row }) => {
      const agentName = row.getValue("assignedAgentName") as string | undefined
      return (
        <span className="text-sm">
          {agentName || <span className="text-muted-foreground italic">Unassigned</span>}
        </span>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1 text-sm text-muted-foreground min-w-[140px]">
          <Calendar className="h-3 w-3" />
          <span>{format(new Date(row.getValue("createdAt")), "MMM dd, yyyy")}</span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const lead = row.original
      return <ActionsCell lead={lead} onEdit={onEdit} onDelete={onDelete} onRefresh={onRefresh} />
    },
  },
]
