"use client"

import { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePermissions } from "@/lib/hooks/use-permissions"
import type { UserRole } from "@/types"
import { LoadingSkeleton } from "@/components/feedback/loading-skeleton"
import { EmptyState } from "@/components/feedback/empty-state"
import { ShieldAlert } from "lucide-react"

interface RequireRoleProps {
  role: UserRole | UserRole[]
  children: ReactNode
  fallback?: ReactNode
  redirectTo?: string
}

/**
 * RequireRole component - Protect by role
 *
 * Usage:
 * <RequireRole role="Admin">
 *   <AdminPanel />
 * </RequireRole>
 *
 * <RequireRole role={["Manager", "Admin"]}>
 *   <ManagerPanel />
 * </RequireRole>
 */
export function RequireRole({
  role,
  children,
  fallback,
  redirectTo = "/",
}: RequireRoleProps) {
  const router = useRouter()
  const { user, hasRole } = usePermissions()

  const roles = Array.isArray(role) ? role : [role]
  const hasRequiredRole = hasRole(roles)

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else if (!hasRequiredRole) {
      router.push(redirectTo)
    }
  }, [user, hasRequiredRole, router, redirectTo])

  // Show loading while checking
  if (!user) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <LoadingSkeleton variant="card" count={1} />
    )
  }

  // Show unauthorized message
  if (!hasRequiredRole) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="flex items-center justify-center min-h-[400px]">
        <EmptyState
          icon={ShieldAlert}
          title="Access Denied"
          description="You don't have the required role to access this resource."
        />
      </div>
    )
  }

  return <>{children}</>
}
