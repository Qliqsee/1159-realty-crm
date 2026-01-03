import type { UserRole, LeadStatus, LeadSource, PropertyType, PropertyStatus } from "@/types";

// User Roles
export const USER_ROLES: UserRole[] = [
  "Admin",
  "Manager",
  "Agent",
  "Sales Manager",
  "Sales",
  "Operations Manager",
  "Media Manager",
  "Accounting Manager",
  "Accounting",
  "CST Manager",
  "CST",
  "HR",
];

// Lead Statuses
export const LEAD_STATUSES: LeadStatus[] = [
  "New",
  "Contacted",
  "Qualified",
  "Converted",
  "Lost",
];

// Lead Sources
export const LEAD_SOURCES: LeadSource[] = [
  "Website",
  "Social Media",
  "Referral",
  "Agent",
  "Partner",
  "Walk-in",
  "Phone Call",
  "Email",
  "Advertisement",
  "Event",
  "Other",
];

// Property Types
export const PROPERTY_TYPES: PropertyType[] = ["Land", "Apartment"];

// Property Statuses
export const PROPERTY_STATUSES: PropertyStatus[] = [
  "Available",
  "Sold Out",
  "Reserved",
  "Disabled",
];

// Payment Durations (in months)
export const PAYMENT_DURATIONS = [3, 6, 9, 12, 18, 24, 36, 48];

// Default Interest Rates
export const DEFAULT_INTEREST_RATE = 5; // 5%
export const DEFAULT_PENALTY_RATE = 2; // 2%

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Commission Rates
export const AGENT_COMMISSION_RATE = 70; // 70%
export const PARTNER_COMMISSION_RATE = 30; // 30%

// Chart Colors
export const CHART_COLORS = {
  primary: "hsl(45, 100%, 51%)", // Gold
  blue: "hsl(221, 83%, 53%)",
  green: "hsl(142, 76%, 36%)",
  purple: "hsl(280, 67%, 50%)",
  red: "hsl(346, 77%, 50%)",
  orange: "hsl(25, 95%, 53%)",
  cyan: "hsl(189, 94%, 43%)",
  pink: "hsl(330, 81%, 60%)",
};

// Date Formats
export const DATE_FORMAT = "MMM dd, yyyy";
export const DATE_TIME_FORMAT = "MMM dd, yyyy HH:mm";
export const TIME_FORMAT = "HH:mm";

// File Upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
export const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];
export const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

// Status Colors
export const STATUS_COLORS = {
  // Lead Statuses
  New: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Contacted: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Qualified: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Converted: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Lost: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",

  // Enrollment Statuses
  Ongoing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Frozen: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",

  // Invoice Statuses
  Pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Overdue: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Resolved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",

  // Payment Statuses
  Approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",

  // Property Statuses
  Available: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "Sold Out": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Reserved: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Disabled: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",

  // General Statuses
  Active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Inactive: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  Suspended: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",

  // Ticket Statuses
  Open: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "In Progress": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Closed: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",

  // Priority
  Low: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  Medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  High: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Urgent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
} as const;

// API Base URL (mock)
export const API_BASE_URL = "/api";

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "1159_auth_token",
  USER: "1159_user",
  THEME: "1159_theme",
  SIDEBAR_STATE: "1159_sidebar_state",
} as const;
