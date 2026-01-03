import type { Permission } from "./types";
import type { UserRole } from "@/types";

/**
 * Admin Permissions - Full access to everything
 */
export const ADMIN_PERMISSIONS: Permission[] = [
  // Leads
  "view:lead",
  "create:lead",
  "update:lead",
  "delete:lead",
  "assign:lead",
  "export:lead",

  // Properties
  "view:property",
  "create:property",
  "update:property",
  "delete:property",
  "export:property",

  // Appointments
  "view:appointment",
  "create:appointment",
  "update:appointment",
  "delete:appointment",
  "export:appointment",

  // Clients
  "view:client",
  "create:client",
  "update:client",
  "delete:client",
  "export:client",

  // Interests
  "view:interest",
  "create:interest",
  "update:interest",
  "delete:interest",
  "export:interest",

  // Partnerships
  "view:partnership",
  "approve:partnership",
  "reject:partnership",
  "export:partnership",

  // Partners
  "view:partner",
  "create:partner",
  "update:partner",
  "delete:partner",
  "export:partner",

  // Enrollments
  "view:enrollment",
  "create:enrollment",
  "update:enrollment",
  "delete:enrollment",
  "request-cancel:enrollment",
  "export:enrollment",

  // Invoices
  "view:invoice",
  "create:invoice",
  "update:invoice",
  "delete:invoice",
  "download:invoice",
  "view-commission:invoice",
  "clear:invoice",
  "export:invoice",

  // Payments
  "view:payment",
  "approve:payment",
  "reject:payment",
  "export:payment",

  // KYC
  "view:kyc",
  "approve:kyc",
  "reject:kyc",
  "export:kyc",

  // Commissions
  "view:commission",
  "create:commission",
  "update:commission",
  "delete:commission",
  "export:commission",

  // Releases
  "view:release",
  "create:release",
  "approve:release",
  "reject:release",
  "export:release",

  // Campaigns
  "view:campaign",
  "create:campaign",
  "update:campaign",
  "delete:campaign",
  "export:campaign",

  // Notifications
  "view:notification",
  "create:notification",
  "update:notification",
  "delete:notification",

  // Documents
  "view:document",
  "create:document",
  "update:document",
  "delete:document",
  "approve:document",
  "reject:document",

  // Support
  "view:support",
  "create:support",
  "update:support",
  "delete:support",
  "assign:support",

  // Analytics
  "view:analytics",
  "export:analytics",

  // Team
  "view:team",
  "create:team",
  "update:team",
  "delete:team",

  // Locations
  "view:location",
  "create:location",
  "update:location",
  "delete:location",

  // Settings
  "view:settings",
  "update:settings",
];

/**
 * Manager Permissions - Most permissions except some critical ones
 */
export const MANAGER_PERMISSIONS: Permission[] = [
  // Leads
  "view:lead",
  "create:lead",
  "update:lead",
  "assign:lead",
  "export:lead",

  // Properties (Manager can create/edit properties)
  "view:property",
  "create:property",
  "update:property",
  "export:property",

  // Appointments
  "view:appointment",
  "create:appointment",
  "update:appointment",
  "delete:appointment",
  "export:appointment",

  // Clients
  "view:client",
  "update:client",
  "export:client",

  // Interests
  "view:interest",
  "update:interest",
  "export:interest",

  // Partnerships
  "view:partnership",
  "approve:partnership",
  "reject:partnership",
  "export:partnership",

  // Partners
  "view:partner",
  "update:partner",
  "export:partner",

  // Enrollments
  "view:enrollment",
  "update:enrollment",
  "export:enrollment",

  // Invoices
  "view:invoice",
  "update:invoice",
  "download:invoice",
  "clear:invoice",
  "export:invoice",

  // Payments
  "view:payment",
  "approve:payment",
  "reject:payment",
  "export:payment",

  // KYC
  "view:kyc",
  "approve:kyc",
  "reject:kyc",
  "export:kyc",

  // Commissions
  "view:commission",
  "export:commission",

  // Releases
  "view:release",
  "approve:release",
  "export:release",

  // Campaigns
  "view:campaign",
  "create:campaign",
  "update:campaign",
  "export:campaign",

  // Notifications
  "view:notification",
  "create:notification",

  // Documents
  "view:document",
  "create:document",
  "update:document",
  "approve:document",
  "reject:document",

  // Support
  "view:support",
  "update:support",
  "assign:support",

  // Analytics
  "view:analytics",
  "export:analytics",

  // Team
  "view:team",
  "create:team",
  "update:team",

  // Locations
  "view:location",
  "create:location",
  "update:location",

  // Settings
  "view:settings",
  "update:settings",
];

/**
 * Agent Permissions - Limited to client management and commission tracking
 */
export const AGENT_PERMISSIONS: Permission[] = [
  // Interests
  "view:interest",
  "create:interest",
  "update:interest",
  "delete:interest",

  // Appointments
  "view:appointment",
  "create:appointment",
  "update:appointment",
  "delete:appointment",

  // Enrollments
  "view:enrollment",
  "create:enrollment",
  "request-cancel:enrollment",

  // Invoices
  "view:invoice",
  "download:invoice",
  "view-commission:invoice",
  "clear:invoice",

  // Clients
  "view:client",

  // Commissions
  "view:commission",

  // Leads (can view assigned leads)
  "view:lead",
];

/**
 * CST (Customer Service Team) Permissions
 */
export const CST_PERMISSIONS: Permission[] = [
  // Clients
  "view:client",
  "update:client",

  // Support
  "view:support",
  "create:support",
  "update:support",

  // Appointments
  "view:appointment",
  "update:appointment",

  // Enrollments
  "view:enrollment",

  // KYC
  "view:kyc",

  // Invoices
  "view:invoice",

  // Interests
  "view:interest",
];

/**
 * CST Manager Permissions
 */
export const CST_MANAGER_PERMISSIONS: Permission[] = [
  ...CST_PERMISSIONS,
  "assign:support",
  "delete:support",
  "view:analytics",
];

/**
 * Accounting Permissions
 */
export const ACCOUNTING_PERMISSIONS: Permission[] = [
  // Invoices
  "view:invoice",
  "create:invoice",
  "update:invoice",
  "download:invoice",
  "export:invoice",

  // Payments
  "view:payment",
  "approve:payment",
  "reject:payment",
  "export:payment",

  // Releases
  "view:release",
  "export:release",

  // Commissions
  "view:commission",
  "export:commission",

  // Enrollments
  "view:enrollment",
  "export:enrollment",

  // Properties (can update market price)
  "view:property",
  "update:property",

  // Clients
  "view:client",
];

/**
 * Accounting Manager Permissions
 */
export const ACCOUNTING_MANAGER_PERMISSIONS: Permission[] = [
  ...ACCOUNTING_PERMISSIONS,
  "approve:release",
  "create:release",
  "view:analytics",
  "export:analytics",
];

/**
 * HR Permissions
 */
export const HR_PERMISSIONS: Permission[] = [
  // Team
  "view:team",
  "create:team",
  "update:team",
  "delete:team",

  // Documents
  "view:document",
  "create:document",
];

/**
 * Sales Permissions
 */
export const SALES_PERMISSIONS: Permission[] = [
  // Leads
  "view:lead",
  "create:lead",
  "update:lead",
  "assign:lead",
  "export:lead",

  // Clients
  "view:client",
  "create:client",

  // Interests
  "view:interest",

  // Properties
  "view:property",
];

/**
 * Sales Manager Permissions
 */
export const SALES_MANAGER_PERMISSIONS: Permission[] = [
  ...SALES_PERMISSIONS,
  "delete:lead",
  "view:analytics",
  "export:analytics",
];

/**
 * Operations Manager Permissions
 */
export const OPERATIONS_MANAGER_PERMISSIONS: Permission[] = [
  // Properties
  "view:property",
  "create:property",
  "update:property",
  "export:property",

  // Appointments
  "view:appointment",
  "create:appointment",
  "update:appointment",
  "delete:appointment",
  "export:appointment",

  // Enrollments
  "view:enrollment",
  "export:enrollment",

  // Locations
  "view:location",
  "create:location",
  "update:location",

  // Clients
  "view:client",

  // Analytics
  "view:analytics",
];

/**
 * Media Manager Permissions
 */
export const MEDIA_MANAGER_PERMISSIONS: Permission[] = [
  // Campaigns
  "view:campaign",
  "create:campaign",
  "update:campaign",
  "delete:campaign",
  "export:campaign",

  // Notifications
  "view:notification",
  "create:notification",
  "update:notification",
  "delete:notification",

  // Documents
  "view:document",
  "create:document",
  "update:document",

  // Analytics
  "view:analytics",
];

/**
 * Role to Permissions Mapping
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  Admin: ADMIN_PERMISSIONS,
  Manager: MANAGER_PERMISSIONS,
  Agent: AGENT_PERMISSIONS,
  CST: CST_PERMISSIONS,
  "CST Manager": CST_MANAGER_PERMISSIONS,
  Accounting: ACCOUNTING_PERMISSIONS,
  "Accounting Manager": ACCOUNTING_MANAGER_PERMISSIONS,
  HR: HR_PERMISSIONS,
  Sales: SALES_PERMISSIONS,
  "Sales Manager": SALES_MANAGER_PERMISSIONS,
  "Operations Manager": OPERATIONS_MANAGER_PERMISSIONS,
  "Media Manager": MEDIA_MANAGER_PERMISSIONS,
};
