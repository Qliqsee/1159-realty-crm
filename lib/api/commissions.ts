import type { Commission, CommissionStatus, CommissionType } from "@/types"

// Mock data generator for commissions
export const generateMockCommissions = (count: number = 70): Commission[] => {
  const statuses: CommissionStatus[] = ["Pending", "Approved", "Paid", "Rejected", "On Hold"]
  const types: CommissionType[] = ["Agent", "Partner"]

  const agentNames = ["Agent 1", "Agent 2", "Agent 3", "Agent 4", "Agent 5"]
  const partnerNames = ["Ahmed Ibrahim", "Sarah Okafor", "David Adeyemi", "Tech Solutions Ltd"]

  return Array.from({ length: count }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const type = types[Math.floor(Math.random() * types.length)]

    const salesAmount = Math.floor(Math.random() * 40000000) + 10000000
    const commissionRate = type === "Agent" ? 70 : 30
    const commissionAmount = (salesAmount * commissionRate) / 100

    return {
      id: `comm-${i + 1}`,
      commissionNumber: `COM-${new Date().getFullYear()}-${String(i + 1).padStart(5, "0")}`,
      type,
      status,
      recipientId: type === "Agent" ? `agent-${Math.floor(Math.random() * 5) + 1}` : `partner-${Math.floor(Math.random() * 35) + 1}`,
      recipientName: type === "Agent" ? agentNames[Math.floor(Math.random() * agentNames.length)] : partnerNames[Math.floor(Math.random() * partnerNames.length)],
      enrollmentId: `enroll-${Math.floor(Math.random() * 60) + 1}`,
      enrollmentNumber: `EN-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 60) + 1).padStart(5, "0")}`,
      clientId: `client-${Math.floor(Math.random() * 40) + 1}`,
      clientName: `Client ${Math.floor(Math.random() * 40) + 1}`,
      propertyId: `prop-${Math.floor(Math.random() * 30) + 1}`,
      propertyName: "Land at Phase 1, Lekki",
      salesAmount,
      commissionRate,
      commissionAmount,
      taxRate: 5,
      taxAmount: (commissionAmount * 5) / 100,
      netCommission: commissionAmount - ((commissionAmount * 5) / 100),
      deductions: Math.random() > 0.8 ? Math.floor(Math.random() * 50000) : 0,
      finalAmount: commissionAmount - ((commissionAmount * 5) / 100) - (Math.random() > 0.8 ? Math.floor(Math.random() * 50000) : 0),
      saleDate: new Date(Date.now() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      approvedDate: status === "Approved" || status === "Paid" ? new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000) : undefined,
      approvedBy: status === "Approved" || status === "Paid" ? `manager-${Math.floor(Math.random() * 3) + 1}` : undefined,
      approvedByName: status === "Approved" || status === "Paid" ? `Manager ${Math.floor(Math.random() * 3) + 1}` : undefined,
      paidDate: status === "Paid" ? new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000) : undefined,
      paidBy: status === "Paid" ? "accounting-1" : undefined,
      paidByName: status === "Paid" ? "Accounting Team" : undefined,
      paymentReference: status === "Paid" ? `PAY-${Math.floor(Math.random() * 1000000)}` : undefined,
      paymentMethod: status === "Paid" ? (Math.random() > 0.5 ? "Bank Transfer" : "Cash") : undefined,
      notes: Math.random() > 0.7 ? "Commission for successful property sale" : undefined,
      rejectionReason: status === "Rejected" ? "Incomplete documentation" : undefined,
      isRecurring: false,
      createdBy: type === "Agent" ? `agent-${Math.floor(Math.random() * 5) + 1}` : "system",
      createdByName: type === "Agent" ? agentNames[Math.floor(Math.random() * agentNames.length)] : "System",
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
    }
  })
}

export const mockCommissions = generateMockCommissions(70)

// Mock API functions
export const getCommissions = async (): Promise<Commission[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockCommissions
}

export const getCommission = async (id: string): Promise<Commission | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockCommissions.find((commission) => commission.id === id)
}

export const createCommission = async (commission: Partial<Commission>): Promise<Commission> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const salesAmount = commission.salesAmount || 0
  const commissionRate = commission.commissionRate || 70
  const commissionAmount = (salesAmount * commissionRate) / 100
  const taxRate = 5
  const taxAmount = (commissionAmount * taxRate) / 100
  const deductions = commission.deductions || 0
  const finalAmount = commissionAmount - taxAmount - deductions

  const newCommission: Commission = {
    id: `comm-${mockCommissions.length + 1}`,
    commissionNumber: `COM-${new Date().getFullYear()}-${String(mockCommissions.length + 1).padStart(5, "0")}`,
    type: commission.type || "Agent",
    status: "Pending",
    recipientId: commission.recipientId || "",
    recipientName: commission.recipientName || "",
    enrollmentId: commission.enrollmentId || "",
    enrollmentNumber: commission.enrollmentNumber || "",
    clientId: commission.clientId || "",
    clientName: commission.clientName || "",
    propertyId: commission.propertyId || "",
    propertyName: commission.propertyName || "",
    salesAmount,
    commissionRate,
    commissionAmount,
    taxRate,
    taxAmount,
    netCommission: commissionAmount - taxAmount,
    deductions,
    finalAmount,
    saleDate: commission.saleDate || new Date(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isRecurring: commission.isRecurring || false,
    createdBy: "current-user",
    createdByName: "Current User",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  mockCommissions.push(newCommission)
  return newCommission
}

export const updateCommission = async (id: string, data: Partial<Commission>): Promise<Commission> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const index = mockCommissions.findIndex((commission) => commission.id === id)
  if (index !== -1) {
    mockCommissions[index] = { ...mockCommissions[index], ...data, updatedAt: new Date() }
    return mockCommissions[index]
  }
  throw new Error("Commission not found")
}

export const deleteCommission = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const index = mockCommissions.findIndex((commission) => commission.id === id)
  if (index !== -1) {
    mockCommissions.splice(index, 1)
  }
}
