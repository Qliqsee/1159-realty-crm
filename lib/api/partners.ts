import type { Partner, PartnerStatus } from "@/types"

// Mock data generator for partners (approved partners only)
export const generateMockPartners = (count: number = 25): Partner[] => {
  const statuses: PartnerStatus[] = ["Active", "Inactive", "Suspended"]

  const names = [
    "Ahmed Ibrahim", "Sarah Okafor", "David Adeyemi", "Fatima Bello",
    "Michael Eze", "Aisha Musa", "John Adeleke", "Grace Nwosu",
    "Chidi Okoro", "Blessing Adegoke", "Ibrahim Suleiman", "Mary Okonkwo",
    "Tunde Williams", "Chioma Nnamdi", "Yusuf Abdullahi"
  ]

  const agents = [
    { id: "agent-1", name: "Alex Johnson" },
    { id: "agent-2", name: "James Wilson" },
    { id: "agent-3", name: "Lisa Anderson" },
    { id: "agent-4", name: "Robert Brown" },
    { id: "agent-5", name: "Jennifer Davis" },
  ]

  return Array.from({ length: count }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const agent = agents[Math.floor(Math.random() * agents.length)]
    const approvedAt = new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000)

    const totalReferrals = Math.floor(Math.random() * 30)
    const activeReferrals = status === "Active" ? Math.floor(totalReferrals * (Math.random() * 0.4 + 0.3)) : 0

    const avgSaleValue = 15000000 // Average ₦15M per sale
    const totalSales = activeReferrals * avgSaleValue
    const commissionRate = 0.30 // 30% commission
    const totalCommissionEarned = totalSales * commissionRate

    const paidCommission = totalCommissionEarned * (Math.random() * 0.4 + 0.4) // 40-80% paid
    const pendingCommission = totalCommissionEarned - paidCommission

    return {
      id: `partner-${i + 1}`,
      clientId: `client-${Math.floor(Math.random() * 100) + 100}`, // Different range to avoid conflicts
      clientName: names[Math.floor(Math.random() * names.length)],
      clientEmail: `partner${i + 1}@example.com`,
      clientPhone: `+234${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      status,
      referralCode: `REF${String(i + 1).padStart(4, "0")}`,
      referralLink: `https://1159realty.com/signup?ref=REF${String(i + 1).padStart(4, "0")}`,
      linkedAgentId: agent.id,
      linkedAgentName: agent.name,
      totalReferrals,
      activeReferrals,
      totalCommissionEarned,
      pendingCommission,
      paidCommission,
      approvedAt,
      activatedAt: status === "Active" ? approvedAt : undefined,
      deactivatedAt: status === "Inactive" ? new Date(approvedAt.getTime() + Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000) : undefined,
      suspendedAt: status === "Suspended" ? new Date(approvedAt.getTime() + Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000) : undefined,
      suspensionReason: status === "Suspended" ? "Violation of partnership terms" : undefined,
      createdAt: new Date(approvedAt.getTime() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000),
    }
  })
}

export const mockPartners = generateMockPartners(25)

// Mock API functions
export const getPartners = async (): Promise<Partner[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockPartners
}

export const getPartner = async (id: string): Promise<Partner | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockPartners.find((partner) => partner.id === id)
}

export const updatePartner = async (id: string, data: Partial<Partner>): Promise<Partner> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const index = mockPartners.findIndex((partner) => partner.id === id)
  if (index !== -1) {
    mockPartners[index] = { ...mockPartners[index], ...data, updatedAt: new Date() }
    return mockPartners[index]
  }
  throw new Error("Partner not found")
}

export const deletePartner = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const index = mockPartners.findIndex((partner) => partner.id === id)
  if (index !== -1) {
    mockPartners.splice(index, 1)
  }
}

export const activatePartner = async (id: string): Promise<Partner> => {
  return updatePartner(id, {
    status: "Active",
    activatedAt: new Date(),
    deactivatedAt: undefined,
    suspendedAt: undefined,
    suspensionReason: undefined,
  })
}

export const deactivatePartner = async (id: string): Promise<Partner> => {
  return updatePartner(id, {
    status: "Inactive",
    deactivatedAt: new Date(),
  })
}

export const suspendPartner = async (id: string, reason: string): Promise<Partner> => {
  return updatePartner(id, {
    status: "Suspended",
    suspendedAt: new Date(),
    suspensionReason: reason,
  })
}
