import type { User } from "@/types"

// Mock users/agents data
const mockUsers: User[] = [
  {
    id: "1",
    email: "john.agent@1159realty.com",
    firstName: "John",
    lastName: "Agent",
    fullName: "John Agent",
    phone: "+234-803-111-1111",
    role: "Agent",
    status: "Active",
    department: "Sales",
    createdAt: new Date("2023-01-15"),
    lastLogin: new Date("2024-01-20"),
    permissions: [],
  },
  {
    id: "2",
    email: "sarah.sales@1159realty.com",
    firstName: "Sarah",
    lastName: "Manager",
    fullName: "Sarah Manager",
    phone: "+234-803-222-2222",
    role: "Sales Manager",
    status: "Active",
    department: "Sales",
    createdAt: new Date("2023-01-10"),
    lastLogin: new Date("2024-01-21"),
    permissions: [],
  },
  {
    id: "3",
    email: "michael.chen@1159realty.com",
    firstName: "Michael",
    lastName: "Chen",
    fullName: "Michael Chen",
    phone: "+234-803-333-3333",
    role: "Agent",
    status: "Active",
    department: "Sales",
    createdAt: new Date("2023-02-01"),
    lastLogin: new Date("2024-01-19"),
    permissions: [],
  },
  {
    id: "4",
    email: "admin@1159realty.com",
    firstName: "Admin",
    lastName: "User",
    fullName: "Admin User",
    phone: "+234-803-444-4444",
    role: "Admin",
    status: "Active",
    department: "Management",
    createdAt: new Date("2022-12-01"),
    lastLogin: new Date("2024-01-22"),
    permissions: [],
  },
  {
    id: "5",
    email: "emily.agent@1159realty.com",
    firstName: "Emily",
    lastName: "Rodriguez",
    fullName: "Emily Rodriguez",
    phone: "+234-803-555-5555",
    role: "Agent",
    status: "Active",
    department: "Sales",
    createdAt: new Date("2023-03-15"),
    lastLogin: new Date("2024-01-18"),
    permissions: [],
  },
]

export async function getUsers(): Promise<User[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockUsers
}

export async function getAgents(): Promise<User[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockUsers.filter(
    (user) => user.role === "Agent" || user.role === "Sales Manager" || user.role === "Sales"
  )
}

export async function getUserById(id: string): Promise<User | undefined> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockUsers.find((user) => user.id === id)
}

export async function searchAgents(query: string): Promise<User[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const agents = mockUsers.filter(
    (user) => user.role === "Agent" || user.role === "Sales Manager" || user.role === "Sales"
  )

  if (!query) return agents

  const lowerQuery = query.toLowerCase()
  return agents.filter(
    (agent) =>
      agent.fullName.toLowerCase().includes(lowerQuery) ||
      agent.email.toLowerCase().includes(lowerQuery) ||
      agent.firstName.toLowerCase().includes(lowerQuery) ||
      agent.lastName.toLowerCase().includes(lowerQuery)
  )
}
