import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { PermissionManager } from "./permission-manager"
import type { Permission } from "./types"
import type { User, UserRole } from "@/types"

/**
 * Server-side authentication and permission utilities
 * Use these in Server Components and Server Actions
 */

/**
 * Get current user from server-side context
 */
export async function getServerUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const userCookie = cookieStore.get("user")

    if (!userCookie?.value) return null

    return JSON.parse(userCookie.value) as User
  } catch (error) {
    console.error("Failed to get server user:", error)
    return null
  }
}

/**
 * Require authentication on server-side
 * Redirects to login if not authenticated
 */
export async function requireAuth(): Promise<User> {
  const user = await getServerUser()

  if (!user) {
    redirect("/login")
  }

  return user
}

/**
 * Require specific permission on server-side
 * Redirects to root if permission not granted
 */
export async function requirePermission(
  permission: Permission,
  redirectTo = "/"
): Promise<User> {
  const user = await requireAuth()

  if (!PermissionManager.hasPermission(user, permission)) {
    redirect(redirectTo)
  }

  return user
}

/**
 * Require any of multiple permissions
 */
export async function requireAnyPermission(
  permissions: Permission[],
  redirectTo = "/"
): Promise<User> {
  const user = await requireAuth()

  if (!PermissionManager.hasAnyPermission(user, permissions)) {
    redirect(redirectTo)
  }

  return user
}

/**
 * Require all of multiple permissions
 */
export async function requireAllPermissions(
  permissions: Permission[],
  redirectTo = "/"
): Promise<User> {
  const user = await requireAuth()

  if (!PermissionManager.hasAllPermissions(user, permissions)) {
    redirect(redirectTo)
  }

  return user
}

/**
 * Require specific role on server-side
 */
export async function requireRole(
  role: UserRole | UserRole[],
  redirectTo = "/"
): Promise<User> {
  const user = await requireAuth()

  if (!PermissionManager.hasRole(user, role)) {
    redirect(redirectTo)
  }

  return user
}

/**
 * Check permission on server-side (non-blocking)
 * Returns boolean instead of redirecting
 */
export async function checkServerPermission(
  permission: Permission
): Promise<boolean> {
  const user = await getServerUser()
  if (!user) return false

  return PermissionManager.hasPermission(user, permission)
}

/**
 * Check role on server-side (non-blocking)
 */
export async function checkServerRole(
  role: UserRole | UserRole[]
): Promise<boolean> {
  const user = await getServerUser()
  if (!user) return false

  return PermissionManager.hasRole(user, role)
}

/**
 * Get user permissions on server-side
 */
export async function getServerPermissions(): Promise<Permission[]> {
  const user = await getServerUser()
  return PermissionManager.getUserPermissions(user)
}

/**
 * Check if current user is admin (server-side)
 */
export async function isServerAdmin(): Promise<boolean> {
  const user = await getServerUser()
  return PermissionManager.isAdmin(user)
}

/**
 * Check if current user is manager or higher (server-side)
 */
export async function isServerManagerOrHigher(): Promise<boolean> {
  const user = await getServerUser()
  return PermissionManager.isManagerOrHigher(user)
}
