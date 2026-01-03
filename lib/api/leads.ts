import type { Lead, LeadStatus, LeadSource } from "@/types"

// Mock data generator
export const generateMockLeads = (count: number = 50): Lead[] => {
  const firstNames = ["John", "Jane", "Michael", "Sarah", "David", "Emily", "James", "Lisa", "Robert", "Mary"]
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"]
  const statuses: LeadStatus[] = ["New", "Contacted", "Qualified", "Converted", "Lost"]
  const sources: LeadSource[] = ["Website", "Social Media", "Referral", "Agent", "Partner", "Walk-in", "Phone Call", "Email"]

  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const source = sources[Math.floor(Math.random() * sources.length)]

    return {
      id: `lead-${i + 1}`,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: `+234${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      status,
      source,
      assignedAgentId: Math.random() > 0.3 ? `agent-${Math.floor(Math.random() * 5) + 1}` : undefined,
      assignedAgentName: Math.random() > 0.3 ? `Agent ${Math.floor(Math.random() * 5) + 1}` : undefined,
      notes: [],
      tags: [],
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      followUpDate: Math.random() > 0.5 ? new Date(Date.now() + Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000) : undefined,
      followUpCompleted: Math.random() > 0.7,
      interestedProperties: [],
      paymentLinkGenerated: Math.random() > 0.6,
      hasPaid: Math.random() > 0.8,
    }
  })
}

export const mockLeads = generateMockLeads(50)

// Mock API functions
export const getLeads = async (): Promise<Lead[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockLeads
}

export const getLead = async (id: string): Promise<Lead | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockLeads.find((lead) => lead.id === id)
}

export const createLead = async (lead: Partial<Lead>): Promise<Lead> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const newLead: Lead = {
    id: `lead-${mockLeads.length + 1}`,
    firstName: lead.firstName || "",
    lastName: lead.lastName || "",
    fullName: `${lead.firstName} ${lead.lastName}`,
    email: lead.email || "",
    phone: lead.phone || "",
    status: lead.status || "New",
    source: lead.source || "Website",
    notes: [],
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    followUpCompleted: false,
    interestedProperties: [],
    paymentLinkGenerated: false,
    hasPaid: false,
  }
  mockLeads.push(newLead)
  return newLead
}

export const updateLead = async (id: string, data: Partial<Lead>): Promise<Lead> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const index = mockLeads.findIndex((lead) => lead.id === id)
  if (index !== -1) {
    mockLeads[index] = { ...mockLeads[index], ...data, updatedAt: new Date() }
    return mockLeads[index]
  }
  throw new Error("Lead not found")
}

export const deleteLead = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const index = mockLeads.findIndex((lead) => lead.id === id)
  if (index !== -1) {
    mockLeads.splice(index, 1)
  }
}
