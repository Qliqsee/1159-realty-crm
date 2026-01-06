"use client"

import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/buttons/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/overlays/dropdown-menu"
import { cn } from "@/lib/utils"
import { usePermissions } from "@/lib/hooks/use-permissions"
import type { Permission } from "@/lib/permissions/types"

export interface ActionMenuItem {
  label: string
  icon?: React.ComponentType<{ className?: string }>
  onClick: () => void
  variant?: "default" | "destructive"
  disabled?: boolean
  separator?: boolean
  permission?: Permission // Optional permission requirement
}

interface ActionMenuProps {
  items: ActionMenuItem[]
  align?: "start" | "end"
}

/**
 * ActionMenu component with permission-based filtering
 *
 * Usage:
 * const actions: ActionMenuItem[] = [
 *   {
 *     label: "Edit",
 *     icon: Edit,
 *     onClick: handleEdit,
 *     permission: "update:lead"
 *   },
 *   {
 *     label: "Delete",
 *     icon: Trash,
 *     onClick: handleDelete,
 *     permission: "delete:lead",
 *     variant: "destructive"
 *   }
 * ]
 *
 * <ActionMenu items={actions} />
 */
export function ActionMenu({ items, align = "end" }: ActionMenuProps) {
  const { hasPermission, user } = usePermissions()

  // Don't render menu while user is loading to prevent flicker
  if (user === null) {
    return null
  }

  // Filter items based on permissions
  const visibleItems = items.filter((item) => {
    // If no permission specified, show the item
    if (!item.permission) return true

    // Check if user has the required permission
    return hasPermission(item.permission)
  })

  // Don't render menu if no items are visible
  if (visibleItems.length === 0) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-48">
        {visibleItems.map((item, index) => (
          <div key={index}>
            {item.separator && index > 0 && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onClick={item.onClick}
              disabled={item.disabled}
              className={cn(
                item.variant === "destructive" &&
                  "text-destructive focus:text-destructive"
              )}
            >
              {item.icon && <item.icon className="mr-2 h-4 w-4" />}
              <span>{item.label}</span>
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
