import type { User } from "@/types";
import { ROLE_PERMISSIONS } from "@/lib/permissions/role-permissions";

/**
 * Mock User Data with Passwords
 *
 * These users can be used for login testing
 * Default password for all users: "password123"
 *
 * Password field is NOT included in User type, only for validation
 */

interface MockUser extends User {
  password: string;
}

export const MOCK_USERS: MockUser[] = [
  // ADMIN
  {
    id: "user-admin-001",
    email: "admin@1159realty.com",
    password: "password123",
    firstName: "Admin",
    lastName: "User",
    fullName: "Admin User",
    phone: "+234-803-123-4567",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    role: "Admin",
    status: "Active",
    createdAt: new Date("2024-01-01"),
    permissions: ROLE_PERMISSIONS.Admin,
  },

  // MANAGER
  {
    id: "user-manager-001",
    email: "manager@1159realty.com",
    password: "password123",
    firstName: "Sarah",
    lastName: "Johnson",
    fullName: "Sarah Johnson",
    phone: "+234-803-234-5678",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    role: "Manager",
    status: "Active",
    createdAt: new Date("2024-01-15"),
    permissions: ROLE_PERMISSIONS.Manager,
  },

  // AGENT
  {
    id: "user-agent-001",
    email: "agent@1159realty.com",
    password: "password123",
    firstName: "Michael",
    lastName: "Chen",
    fullName: "Michael Chen",
    phone: "+234-803-345-6789",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
    role: "Agent",
    status: "Active",
    createdAt: new Date("2024-02-01"),
    permissions: ROLE_PERMISSIONS.Agent,
  },
  {
    id: "user-agent-002",
    email: "amina.bello@1159realty.com",
    password: "password123",
    firstName: "Amina",
    lastName: "Bello",
    fullName: "Amina Bello",
    phone: "+234-803-456-7890",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=amina",
    role: "Agent",
    status: "Active",
    createdAt: new Date("2024-02-10"),
    permissions: ROLE_PERMISSIONS.Agent,
  },

  // CST (Customer Service Team)
  {
    id: "user-cst-001",
    email: "cst@1159realty.com",
    password: "password123",
    firstName: "David",
    lastName: "Okafor",
    fullName: "David Okafor",
    phone: "+234-803-567-8901",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
    role: "CST",
    status: "Active",
    createdAt: new Date("2024-03-01"),
    permissions: ROLE_PERMISSIONS.CST,
  },

  // CST MANAGER
  {
    id: "user-cst-manager-001",
    email: "cst.manager@1159realty.com",
    password: "password123",
    firstName: "Grace",
    lastName: "Adeleke",
    fullName: "Grace Adeleke",
    phone: "+234-803-678-9012",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=grace",
    role: "CST Manager",
    status: "Active",
    createdAt: new Date("2024-02-20"),
    permissions: ROLE_PERMISSIONS["CST Manager"],
  },

  // ACCOUNTING
  {
    id: "user-accounting-001",
    email: "accounting@1159realty.com",
    password: "password123",
    firstName: "Ibrahim",
    lastName: "Yusuf",
    fullName: "Ibrahim Yusuf",
    phone: "+234-803-789-0123",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=ibrahim",
    role: "Accounting",
    status: "Active",
    createdAt: new Date("2024-01-20"),
    permissions: ROLE_PERMISSIONS.Accounting,
  },

  // ACCOUNTING MANAGER
  {
    id: "user-accounting-manager-001",
    email: "accounting.manager@1159realty.com",
    password: "password123",
    firstName: "Fatima",
    lastName: "Abdullahi",
    fullName: "Fatima Abdullahi",
    phone: "+234-803-890-1234",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=fatima",
    role: "Accounting Manager",
    status: "Active",
    createdAt: new Date("2024-01-10"),
    permissions: ROLE_PERMISSIONS["Accounting Manager"],
  },

  // HR
  {
    id: "user-hr-001",
    email: "hr@1159realty.com",
    password: "password123",
    firstName: "Chioma",
    lastName: "Eze",
    fullName: "Chioma Eze",
    phone: "+234-803-901-2345",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=chioma",
    role: "HR",
    status: "Active",
    createdAt: new Date("2024-01-25"),
    permissions: ROLE_PERMISSIONS.HR,
  },

  // SALES
  {
    id: "user-sales-001",
    email: "sales@1159realty.com",
    password: "password123",
    firstName: "Tunde",
    lastName: "Williams",
    fullName: "Tunde Williams",
    phone: "+234-803-012-3456",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=tunde",
    role: "Sales",
    status: "Active",
    createdAt: new Date("2024-03-05"),
    permissions: ROLE_PERMISSIONS.Sales,
  },

  // SALES MANAGER
  {
    id: "user-sales-manager-001",
    email: "sales.manager@1159realty.com",
    password: "password123",
    firstName: "Ngozi",
    lastName: "Okonkwo",
    fullName: "Ngozi Okonkwo",
    phone: "+234-803-123-4560",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=ngozi",
    role: "Sales Manager",
    status: "Active",
    createdAt: new Date("2024-02-05"),
    permissions: ROLE_PERMISSIONS["Sales Manager"],
  },

  // OPERATIONS MANAGER
  {
    id: "user-operations-001",
    email: "operations@1159realty.com",
    password: "password123",
    firstName: "Emeka",
    lastName: "Nwosu",
    fullName: "Emeka Nwosu",
    phone: "+234-803-234-5601",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=emeka",
    role: "Operations Manager",
    status: "Active",
    createdAt: new Date("2024-01-30"),
    permissions: ROLE_PERMISSIONS["Operations Manager"],
  },

  // MEDIA MANAGER
  {
    id: "user-media-001",
    email: "media@1159realty.com",
    password: "password123",
    firstName: "Blessing",
    lastName: "Adeyemi",
    fullName: "Blessing Adeyemi",
    phone: "+234-803-345-6012",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=blessing",
    role: "Media Manager",
    status: "Active",
    createdAt: new Date("2024-02-25"),
    permissions: ROLE_PERMISSIONS["Media Manager"],
  },
];

/**
 * Validate login credentials
 *
 * @param email - User email
 * @param password - User password
 * @returns User object without password if valid, null otherwise
 */
export const validateLogin = (
  email: string,
  password: string
): User | null => {
  const user = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) return null;

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * Get user by email (without password)
 */
export const getUserByEmail = (email: string): User | null => {
  const user = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (!user) return null;

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * Get user by ID (without password)
 */
export const getUserById = (id: string): User | null => {
  const user = MOCK_USERS.find((u) => u.id === id);

  if (!user) return null;

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * Get all users (without passwords) - for team management
 */
export const getAllUsers = (): User[] => {
  return MOCK_USERS.map(({ password: _, ...user }) => user);
};

/**
 * Quick login credentials for testing
 * Use these emails with password: "password123"
 */
export const QUICK_LOGIN = {
  admin: "admin@1159realty.com",
  manager: "manager@1159realty.com",
  agent: "agent@1159realty.com",
  cst: "cst@1159realty.com",
  cstManager: "cst.manager@1159realty.com",
  accounting: "accounting@1159realty.com",
  accountingManager: "accounting.manager@1159realty.com",
  hr: "hr@1159realty.com",
  sales: "sales@1159realty.com",
  salesManager: "sales.manager@1159realty.com",
  operations: "operations@1159realty.com",
  media: "media@1159realty.com",
} as const;
