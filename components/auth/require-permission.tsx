"use client"

import { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePermissions } from "@/lib/hooks/use-permissions"
import type { Permission } from "@/lib/permissions/types"
import { LoadingSkeleton } from "@/components/common/loading-skeleton"
import { EmptyState } from "@/components/common/empty-state"
import { ShieldAlert } from "lucide-react"

interface RequirePermissionProps {
  permission: Permission | Permission[]
  children: ReactNode
  fallback?: ReactNode
  redirectTo?: string
  requireAll?: boolean // If true, user must have ALL permissions
}

/**
 * RequirePermission component - Protect entire pages/sections
 * Redirects if user lacks permission
 *
 * Usage:
 * <RequirePermission permission="view:analytics">
 *   <AnalyticsPage />
 * </RequirePermission>
 *
 * <RequirePermission
 *   permission={["view:analytics", "export:analytics"]}
 *   requireAll
 * >
 *   <AdvancedAnalytics />
 * </RequirePermission>
 */
export function RequirePermission({
  permission,
  children,
  fallback,
  redirectTo = "/",
  requireAll = false,
}: RequirePermissionProps) {
  const router = useRouter()
  const { user, hasPermission, hasAllPermissions, hasAnyPermission } =
    usePermissions()

  const hasAccess = Array.isArray(permission)
    ? requireAll
      ? hasAllPermissions(permission)
      : hasAnyPermission(permission)
    : hasPermission(permission)

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else if (!hasAccess) {
      router.push(redirectTo)
    }
  }, [user, hasAccess, router, redirectTo])

  // Show loading while checking
  if (!user) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <LoadingSkeleton variant="page" count={1} />
    )
  }

  // Show unauthorized message
  if (!hasAccess) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="flex items-center justify-center min-h-[400px]">
        <EmptyState
          icon={ShieldAlert}
          title="Access Denied"
          description="You don't have permission to access this resource."
        />
      </div>
    )
  }

  return <>{children}</>
}
