import type { User, UserRole } from "@/types";
import type { Permission, Action, Resource } from "./types";
import { ROLE_PERMISSIONS } from "./role-permissions";

/**
 * PermissionManager - Centralized permission checking utility
 *
 * Can be used on client-side, server-side, in hooks, and middleware
 * Provides granular permission checks using "action:resource" format
 */
export class PermissionManager {
  /**
   * Check if user has a specific permission
   */
  static hasPermission(user: User | null, permission: Permission): boolean {
    if (!user) return false;

    const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
    return rolePermissions.includes(permission);
  }

  /**
   * Check if user has ANY of the given permissions
   */
  static hasAnyPermission(
    user: User | null,
    permissions: Permission[]
  ): boolean {
    if (!user || permissions.length === 0) return false;

    return permissions.some((permission) =>
      this.hasPermission(user, permission)
    );
  }

  /**
   * Check if user has ALL of the given permissions
   */
  static hasAllPermissions(
    user: User | null,
    permissions: Permission[]
  ): boolean {
    if (!user || permissions.length === 0) return false;

    return permissions.every((permission) =>
      this.hasPermission(user, permission)
    );
  }

  /**
   * Check if user has role-level access (simple role check)
   */
  static hasRole(
    user: User | null,
    roles: UserRole | UserRole[]
  ): boolean {
    if (!user) return false;

    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    return allowedRoles.includes(user.role);
  }

  /**
   * Get all permissions for a user's role
   */
  static getUserPermissions(user: User | null): Permission[] {
    if (!user) return [];
    return ROLE_PERMISSIONS[user.role] || [];
  }

  /**
   * Check if user can access a route based on required permission
   */
  static canAccessRoute(user: User | null, route: string): boolean {
    if (!user) return false;

    // Map routes to required permissions
    const routePermissions: Record<string, Permission> = {
      "/leads": "view:lead",
      "/properties": "view:property",
      "/appointments": "view:appointment",
      "/clients": "view:client",
      "/client-interests": "view:interest",
      "/partnerships": "view:partnership",
      "/partners": "view:partner",
      "/agent": "view:commission", // Agent dashboard
      "/enrollments": "view:enrollment",
      "/invoices": "view:invoice",
      "/payments": "view:payment",
      "/kyc": "view:kyc",
      "/commissions": "view:commission",
      "/releases": "view:release",
      "/campaigns": "view:campaign",
      "/notifications": "view:notification",
      "/documents": "view:document",
      "/support": "view:support",
      "/analytics": "view:analytics",
      "/team": "view:team",
      "/locations": "view:location",
      "/settings": "view:settings",
    };

    const requiredPermission = routePermissions[route];

    // If no specific permission required, allow access
    if (!requiredPermission) return true;

    return this.hasPermission(user, requiredPermission);
  }

  /**
   * Get allowed actions for a resource
   */
  static getAllowedActions(user: User | null, resource: Resource): Action[] {
    if (!user) return [];

    const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
    const resourcePermissions = rolePermissions.filter((p) =>
      p.endsWith(`:${resource}`)
    );

    return resourcePermissions.map((p) => p.split(":")[0] as Action);
  }

  /**
   * Check if user can perform action on resource
   * Convenience method for building permission string
   */
  static can(
    user: User | null,
    action: Action,
    resource: Resource
  ): boolean {
    return this.hasPermission(user, `${action}:${resource}` as Permission);
  }

  /**
   * Filter items based on permissions
   * Generic utility for filtering any array of items with permission requirements
   */
  static filterByPermission<T extends { permission?: Permission }>(
    user: User | null,
    items: T[]
  ): T[] {
    if (!user) return [];

    return items.filter((item) => {
      if (!item.permission) return true;
      return this.hasPermission(user, item.permission);
    });
  }

  /**
   * Check if user is admin (convenience method)
   */
  static isAdmin(user: User | null): boolean {
    return user?.role === "Admin";
  }

  /**
   * Check if user is manager or higher (convenience method)
   */
  static isManagerOrHigher(user: User | null): boolean {
    if (!user) return false;
    return ["Admin", "Manager"].includes(user.role);
  }

  /**
   * Get user's permission level for UI display
   */
  static getPermissionLevel(user: User | null): string {
    if (!user) return "None";

    const permissionCount = this.getUserPermissions(user).length;
    const totalPermissions = ROLE_PERMISSIONS.Admin.length;
    const percentage = (permissionCount / totalPermissions) * 100;

    if (percentage === 100) return "Full Access";
    if (percentage >= 75) return "High Access";
    if (percentage >= 50) return "Moderate Access";
    if (percentage >= 25) return "Limited Access";
    return "Restricted Access";
  }
}

/**
 * Export a default instance for convenience
 */
export default PermissionManager;
