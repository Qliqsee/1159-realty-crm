export type UserRole =
  | "Agent"
  | "CST"
  | "CST Manager"
  | "Accounting"
  | "Accounting Manager"
  | "HR"
  | "Sales"
  | "Sales Manager"
  | "Operations Manager"
  | "Media Manager"
  | "Manager"
  | "Admin";

export type UserStatus = "Active" | "Inactive" | "Suspended";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  department?: string;
  createdAt: Date;
  lastLogin?: Date;
  permissions: Permission[];
}

export interface Permission {
  module: string;
  actions: PermissionAction[];
}

export type PermissionAction = "view" | "create" | "edit" | "delete" | "approve" | "export";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
