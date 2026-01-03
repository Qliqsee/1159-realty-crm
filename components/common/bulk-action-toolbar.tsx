"use client"

import { Check, X, Trash2, Download, Send, Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface BulkAction {
  label: string
  icon: React.ComponentType<{ className?: string }>
  onClick: () => void
  variant?: "default" | "destructive"
  disabled?: boolean
}

interface BulkActionToolbarProps {
  selectedCount: number
  totalCount: number
  actions: BulkAction[]
  onClearSelection: () => void
  className?: string
}

/**
 * BulkActionToolbar - Toolbar for bulk operations
 *
 * Usage:
 * const bulkActions: BulkAction[] = [
 *   { label: "Delete", icon: Trash2, onClick: handleBulkDelete, variant: "destructive" },
 *   { label: "Export", icon: Download, onClick: handleBulkExport },
 *   { label: "Archive", icon: Archive, onClick: handleBulkArchive },
 * ]
 *
 * <BulkActionToolbar
 *   selectedCount={selectedIds.length}
 *   totalCount={data.length}
 *   actions={bulkActions}
 *   onClearSelection={() => setSelectedIds([])}
 * />
 */
export function BulkActionToolbar({
  selectedCount,
  totalCount,
  actions,
  onClearSelection,
  className,
}: BulkActionToolbarProps) {
  if (selectedCount === 0) return null

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
        "bg-card border rounded-lg shadow-soft-lg p-3",
        "flex items-center gap-4 min-w-[400px]",
        "animate-in slide-in-from-bottom-4 duration-200",
        className
      )}
    >
      {/* Selection Info */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="shadow-soft">
          <Check className="h-3 w-3 mr-1" />
          {selectedCount} selected
        </Badge>
        {selectedCount === totalCount && (
          <span className="text-xs text-muted-foreground">(All)</span>
        )}
      </div>

      {/* Divider */}
      <div className="h-6 w-px bg-border" />

      {/* Bulk Actions */}
      <div className="flex items-center gap-2 flex-1">
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <Button
              key={index}
              variant={action.variant === "destructive" ? "destructive" : "outline"}
              size="sm"
              onClick={action.onClick}
              disabled={action.disabled}
              className="h-8"
            >
              <Icon className="h-4 w-4 mr-2" />
              {action.label}
            </Button>
          )
        })}
      </div>

      {/* Clear Selection */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClearSelection}
        className="h-8 w-8"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Clear selection</span>
      </Button>
    </div>
  )
}
