/**
 * Permission System Types
 *
 * Granular permission system using "action:resource" format
 * Example: "view:property", "create:enrollment", "approve:kyc"
 */

export const ACTIONS = [
  "view",
  "create",
  "update",
  "delete",
  "approve",
  "reject",
  "assign",
  "export",
  "download",
  "request-cancel",
  "clear",
  "view-commission",
] as const;

export const RESOURCES = [
  "lead",
  "property",
  "appointment",
  "client",
  "interest",
  "partnership",
  "partner",
  "enrollment",
  "invoice",
  "payment",
  "kyc",
  "commission",
  "release",
  "campaign",
  "notification",
  "document",
  "support",
  "analytics",
  "team",
  "location",
  "settings",
] as const;

export type Action = (typeof ACTIONS)[number];
export type Resource = (typeof RESOURCES)[number];
export type Permission = `${Action}:${Resource}`;

// Helper type for role-based menu items
export interface PermissionCheck {
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean; // If true, user must have ALL permissions. If false, user needs ANY permission
}
