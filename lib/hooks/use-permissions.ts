import { useMemo } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { PermissionManager } from "@/lib/permissions/permission-manager";
import type { Permission, Action, Resource } from "@/lib/permissions/types";
import type { UserRole } from "@/types";

/**
 * usePermissions Hook
 *
 * React hook for checking permissions in components
 * Provides convenient methods for common permission checks
 *
 * @example
 * const { canCreate, canUpdate, hasPermission } = usePermissions();
 *
 * if (canCreate('property')) {
 *   // Show create button
 * }
 */
export const usePermissions = () => {
  const user = useAuthStore((state) => state.user);

  // Memoize permissions and permission level to prevent recalculation on every render
  const permissions = useMemo(
    () => PermissionManager.getUserPermissions(user),
    [user]
  );

  const permissionLevel = useMemo(
    () => PermissionManager.getPermissionLevel(user),
    [user]
  );

  // Memoize the entire return object to prevent new references on every render
  return useMemo(
    () => ({
      /**
       * Direct permission check
       */
      hasPermission: (permission: Permission): boolean =>
        PermissionManager.hasPermission(user, permission),

      /**
       * Check if user has ANY of the permissions
       */
      hasAnyPermission: (permissions: Permission[]): boolean =>
        PermissionManager.hasAnyPermission(user, permissions),

      /**
       * Check if user has ALL of the permissions
       */
      hasAllPermissions: (permissions: Permission[]): boolean =>
        PermissionManager.hasAllPermissions(user, permissions),

      /**
       * Convenience methods for common actions
       */
      canView: (resource: Resource): boolean =>
        PermissionManager.can(user, "view", resource),

      canCreate: (resource: Resource): boolean =>
        PermissionManager.can(user, "create", resource),

      canUpdate: (resource: Resource): boolean =>
        PermissionManager.can(user, "update", resource),

      canDelete: (resource: Resource): boolean =>
        PermissionManager.can(user, "delete", resource),

      canApprove: (resource: Resource): boolean =>
        PermissionManager.can(user, "approve", resource),

      canReject: (resource: Resource): boolean =>
        PermissionManager.can(user, "reject", resource),

      canAssign: (resource: Resource): boolean =>
        PermissionManager.can(user, "assign", resource),

      canExport: (resource: Resource): boolean =>
        PermissionManager.can(user, "export", resource),

      canDownload: (resource: Resource): boolean =>
        PermissionManager.can(user, "download", resource),

      /**
       * Get all allowed actions for a resource
       */
      getAllowedActions: (resource: Resource): Action[] =>
        PermissionManager.getAllowedActions(user, resource),

      /**
       * Role checks
       */
      hasRole: (roles: UserRole | UserRole[]): boolean =>
        PermissionManager.hasRole(user, roles),

      isAdmin: (): boolean => PermissionManager.isAdmin(user),

      isManagerOrHigher: (): boolean => PermissionManager.isManagerOrHigher(user),

      /**
       * Generic action check
       */
      can: (action: Action, resource: Resource): boolean =>
        PermissionManager.can(user, action, resource),

      /**
       * Get current user
       */
      user,

      /**
       * Get all user permissions
       */
      permissions,

      /**
       * Get permission level description
       */
      permissionLevel,
    }),
    [user, permissions, permissionLevel]
  );
};
