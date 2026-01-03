"use client"

import { ReactNode } from "react"
import { usePermissions } from "@/lib/hooks/use-permissions"
import type { Permission } from "@/lib/permissions/types"

interface CanProps {
  permission: Permission | Permission[]
  children: ReactNode
  fallback?: ReactNode
  requireAll?: boolean // If true, user must have ALL permissions
}

/**
 * Can component - Conditionally render based on permissions
 *
 * Usage:
 * <Can permission="create:lead">
 *   <Button>Create Lead</Button>
 * </Can>
 *
 * <Can permission={["update:lead", "delete:lead"]} requireAll>
 *   <AdvancedActions />
 * </Can>
 *
 * <Can permission="delete:lead" fallback={<p>No permission</p>}>
 *   <DeleteButton />
 * </Can>
 */
export function Can({
  permission,
  children,
  fallback = null,
  requireAll = false,
}: CanProps) {
  const { hasPermission, hasAllPermissions, hasAnyPermission } =
    usePermissions()

  const hasAccess = Array.isArray(permission)
    ? requireAll
      ? hasAllPermissions(permission)
      : hasAnyPermission(permission)
    : hasPermission(permission)

  return hasAccess ? <>{children}</> : <>{fallback}</>
}
