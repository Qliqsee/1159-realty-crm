export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface SortParams {
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface BaseFilters {
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
  icon?: string;
}

export interface TableColumn<T = unknown> {
  id: string;
  label: string;
  accessor: keyof T | string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  format?: (value: unknown, row: T) => React.ReactNode;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
  children?: NavItem[];
  roles?: string[]; // Allowed roles (legacy, use permission instead)
  permission?: string; // Permission required (e.g., "view:property")
}

export interface FileUpload {
  id: string;
  file?: File | Blob;
  url?: string;
  name: string;
  type: string;
  size: number;
  preview?: string;
  progress?: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  entityType?: string;
  entityId?: string;
  entityName?: string;
  changes?: Record<string, { old: unknown; new: unknown }>;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface Setting {
  key: string;
  value: unknown;
  type: "string" | "number" | "boolean" | "json";
  category: string;
  label: string;
  description?: string;
  editable: boolean;
  updatedBy?: string;
  updatedAt?: Date;
}

export interface DashboardWidget {
  id: string;
  type: "metric" | "chart" | "table" | "list";
  title: string;
  size: "small" | "medium" | "large" | "full";
  position: { x: number; y: number };
  config: Record<string, unknown>;
  refreshInterval?: number; // In seconds
}

export type ExportFormat = "excel" | "csv" | "pdf";

export interface ExportOptions {
  format: ExportFormat;
  filename?: string;
  includeHeaders?: boolean;
  selectedColumns?: string[];
}
