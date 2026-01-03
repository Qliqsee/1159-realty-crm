import type { Client, ClientStatus, KYCStatus, Gender } from "@/types"

// Mock data generator for clients
export const generateMockClients = (count: number = 40): Client[] => {
  const firstNames = ["John", "Jane", "Michael", "Sarah", "David", "Emily", "James", "Lisa", "Robert", "Mary", "Ahmed", "Fatima", "Ibrahim", "Aisha"]
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Adeyemi", "Okafor", "Bello", "Musa"]
  const statuses: ClientStatus[] = ["Active", "Inactive", "Suspended"]
  const kycStatuses: KYCStatus[] = ["Pending", "Approved", "Rejected", "Incomplete"]
  const genders: Gender[] = ["Male", "Female"]
  const sources = ["Website", "Agent Referral", "Partner Referral", "Social Media", "Walk-in"]

  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const gender = genders[Math.floor(Math.random() * genders.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const kycStatus = kycStatuses[Math.floor(Math.random() * kycStatuses.length)]
    const source = sources[Math.floor(Math.random() * sources.length)]
    const isPartner = Math.random() > 0.85

    const kycCompletion = kycStatus === "Approved" ? 100 :
                         kycStatus === "Pending" ? Math.floor(Math.random() * 40) + 50 :
                         kycStatus === "Rejected" ? Math.floor(Math.random() * 60) + 20 :
                         Math.floor(Math.random() * 50)

    return {
      id: `client-${i + 1}`,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: `+234${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      gender,
      status,
      kycStatus,
      kycCompletionPercentage: kycCompletion,
      assignedAgentId: `agent-${Math.floor(Math.random() * 5) + 1}`,
      assignedAgentName: `Agent ${Math.floor(Math.random() * 5) + 1}`,
      source,
      referredBy: Math.random() > 0.5 ? `ref-${Math.floor(Math.random() * 10) + 1}` : undefined,
      referredByName: Math.random() > 0.5 ? `Referrer ${Math.floor(Math.random() * 10) + 1}` : undefined,
      referredByType: Math.random() > 0.5 ? (Math.random() > 0.5 ? "Agent" : "Partner") : undefined,
      isPartner,
      partnershipStatus: isPartner ? (Math.random() > 0.3 ? "Approved" : "Pending") : undefined,
      partnershipApprovedAt: isPartner && Math.random() > 0.3 ? new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000) : undefined,
      totalPropertiesOwned: Math.floor(Math.random() * 5),
      totalSpent: Math.floor(Math.random() * 50000000),
      totalCommissionGenerated: isPartner ? Math.floor(Math.random() * 5000000) : 0,
      tags: [],
      notes: [],
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      joinedAt: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000),
      lastActivity: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000),
    }
  })
}

export const mockClients = generateMockClients(40)

// Mock API functions
export const getClients = async (): Promise<Client[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockClients
}

export const getClient = async (id: string): Promise<Client | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockClients.find((client) => client.id === id)
}

export const createClient = async (client: Partial<Client>): Promise<Client> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const newClient: Client = {
    id: `client-${mockClients.length + 1}`,
    firstName: client.firstName || "",
    lastName: client.lastName || "",
    fullName: `${client.firstName} ${client.lastName}`,
    email: client.email || "",
    phone: client.phone || "",
    status: client.status || "Active",
    kycStatus: "Incomplete",
    kycCompletionPercentage: 0,
    assignedAgentId: client.assignedAgentId || "",
    assignedAgentName: client.assignedAgentName || "",
    source: client.source || "Website",
    isPartner: false,
    totalPropertiesOwned: 0,
    totalSpent: 0,
    totalCommissionGenerated: 0,
    tags: [],
    notes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    joinedAt: new Date(),
  }
  mockClients.push(newClient)
  return newClient
}

export const updateClient = async (id: string, data: Partial<Client>): Promise<Client> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const index = mockClients.findIndex((client) => client.id === id)
  if (index !== -1) {
    mockClients[index] = { ...mockClients[index], ...data, updatedAt: new Date() }
    return mockClients[index]
  }
  throw new Error("Client not found")
}

export const deleteClient = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const index = mockClients.findIndex((client) => client.id === id)
  if (index !== -1) {
    mockClients.splice(index, 1)
  }
}
