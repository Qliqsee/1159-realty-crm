import type { Partnership, PartnershipStatus, PartnershipType } from "@/types"

// Mock data generator for partnerships
export const generateMockPartnerships = (count: number = 35): Partnership[] => {
  const statuses: PartnershipStatus[] = ["Pending", "Approved", "Rejected", "Suspended", "Terminated"]
  const types: PartnershipType[] = ["Individual", "Corporate", "Realtor", "Influencer"]

  const partnerNames = [
    "Ahmed Ibrahim", "Sarah Okafor", "David Adeyemi", "Fatima Bello",
    "Michael Eze", "Aisha Musa", "John Adeleke", "Grace Nwosu",
    "Tech Solutions Ltd", "Prime Realtors", "Urban Properties Inc"
  ]

  return Array.from({ length: count }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const type = types[Math.floor(Math.random() * types.length)]

    const totalReferrals = Math.floor(Math.random() * 50)
    const successfulReferrals = Math.floor(totalReferrals * (Math.random() * 0.4 + 0.3))
    const pendingReferrals = Math.floor((totalReferrals - successfulReferrals) * Math.random())
    const rejectedReferrals = totalReferrals - successfulReferrals - pendingReferrals

    const totalSalesValue = successfulReferrals * (Math.floor(Math.random() * 30000000) + 10000000)
    const commissionRate = 30
    const totalCommissionEarned = (totalSalesValue * commissionRate) / 100
    const commissionPaid = status === "Approved" ? totalCommissionEarned * (Math.random() * 0.3 + 0.5) : 0
    const commissionPending = totalCommissionEarned - commissionPaid

    return {
      id: `partner-${i + 1}`,
      partnershipNumber: `PTR-${new Date().getFullYear()}-${String(i + 1).padStart(5, "0")}`,
      status,
      type,
      clientId: `client-${Math.floor(Math.random() * 40) + 1}`,
      partnerName: partnerNames[Math.floor(Math.random() * partnerNames.length)],
      partnerEmail: `partner${i + 1}@example.com`,
      partnerPhone: `+234${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      businessName: type === "Corporate" ? `${partnerNames[Math.floor(Math.random() * partnerNames.length)]} Ltd` : undefined,
      businessRegistrationNumber: type === "Corporate" ? `RC-${Math.floor(Math.random() * 1000000)}` : undefined,
      commissionRate,
      paymentTerms: "Monthly",
      bankAccountName: partnerNames[Math.floor(Math.random() * partnerNames.length)],
      bankAccountNumber: String(Math.floor(Math.random() * 9000000000 + 1000000000)),
      bankName: ["First Bank", "GTBank", "Access Bank", "Zenith Bank"][Math.floor(Math.random() * 4)],
      totalReferrals,
      successfulReferrals,
      pendingReferrals,
      rejectedReferrals,
      conversionRate: totalReferrals > 0 ? Math.round((successfulReferrals / totalReferrals) * 100) : 0,
      totalSalesValue,
      totalCommissionEarned,
      commissionPaid,
      commissionPending,
      lastReferralDate: totalReferrals > 0 ? new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000) : undefined,
      lastPaymentDate: commissionPaid > 0 ? new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000) : undefined,
      lastPaymentAmount: commissionPaid > 0 ? Math.floor(Math.random() * 1000000) + 100000 : undefined,
      documents: [],
      agreementSigned: status !== "Pending",
      agreementSignedDate: status !== "Pending" ? new Date(Date.now() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000) : undefined,
      notes: Math.random() > 0.7 ? "High performing partner with excellent conversion rate" : undefined,
      rating: status === "Approved" ? Math.floor(Math.random() * 2) + 4 : undefined,
      isActive: status === "Approved",
      createdBy: `agent-${Math.floor(Math.random() * 5) + 1}`,
      createdByName: `Agent ${Math.floor(Math.random() * 5) + 1}`,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      approvedAt: status === "Approved" ? new Date(Date.now() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000) : undefined,
      approvedBy: status === "Approved" ? `manager-${Math.floor(Math.random() * 3) + 1}` : undefined,
      approvedByName: status === "Approved" ? `Manager ${Math.floor(Math.random() * 3) + 1}` : undefined,
    }
  })
}

export const mockPartnerships = generateMockPartnerships(35)

// Mock API functions
export const getPartnerships = async (): Promise<Partnership[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockPartnerships
}

export const getPartnership = async (id: string): Promise<Partnership | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockPartnerships.find((partnership) => partnership.id === id)
}

export const createPartnership = async (partnership: Partial<Partnership>): Promise<Partnership> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const newPartnership: Partnership = {
    id: `partner-${mockPartnerships.length + 1}`,
    partnershipNumber: `PTR-${new Date().getFullYear()}-${String(mockPartnerships.length + 1).padStart(5, "0")}`,
    status: "Pending",
    type: partnership.type || "Individual",
    clientId: partnership.clientId || "",
    partnerName: partnership.partnerName || "",
    partnerEmail: partnership.partnerEmail || "",
    partnerPhone: partnership.partnerPhone || "",
    commissionRate: partnership.commissionRate || 30,
    paymentTerms: partnership.paymentTerms || "Monthly",
    bankAccountName: partnership.bankAccountName || "",
    bankAccountNumber: partnership.bankAccountNumber || "",
    bankName: partnership.bankName || "",
    totalReferrals: 0,
    successfulReferrals: 0,
    pendingReferrals: 0,
    rejectedReferrals: 0,
    conversionRate: 0,
    totalSalesValue: 0,
    totalCommissionEarned: 0,
    commissionPaid: 0,
    commissionPending: 0,
    documents: [],
    agreementSigned: false,
    isActive: false,
    createdBy: "current-user",
    createdByName: "Current User",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  mockPartnerships.push(newPartnership)
  return newPartnership
}

export const updatePartnership = async (id: string, data: Partial<Partnership>): Promise<Partnership> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const index = mockPartnerships.findIndex((partnership) => partnership.id === id)
  if (index !== -1) {
    mockPartnerships[index] = { ...mockPartnerships[index], ...data, updatedAt: new Date() }
    return mockPartnerships[index]
  }
  throw new Error("Partnership not found")
}

export const deletePartnership = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const index = mockPartnerships.findIndex((partnership) => partnership.id === id)
  if (index !== -1) {
    mockPartnerships.splice(index, 1)
  }
}
