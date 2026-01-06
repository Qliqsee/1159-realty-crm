import type { Enrollment, EnrollmentStatus, PaymentMethod, EnrollmentPaymentSchedule } from "@/types"

// Mock data generator for enrollments
export const generateMockEnrollments = (count: number = 60): Enrollment[] => {
  const statuses: EnrollmentStatus[] = ["Active", "Completed", "Suspended", "Cancelled", "Pending"]
  const paymentMethods: PaymentMethod[] = ["Bank Transfer", "Cash", "Card", "Cheque", "Mobile Money"]

  const clientNames = ["John Smith", "Jane Doe", "Michael Johnson", "Sarah Williams", "David Brown", "Emily Davis", "Ahmed Adeyemi", "Fatima Okafor", "Ibrahim Bello", "Aisha Musa"]
  const propertyNames = ["Land at Phase 1, Lekki", "Apartment at Estate A, Ikeja", "Land at Central, Ajah", "Apartment at Phase 2, Victoria Island", "Land at Estate B, Surulere"]
  const agentNames = ["Agent 1", "Agent 2", "Agent 3", "Agent 4", "Agent 5"]

  return Array.from({ length: count }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const propertyPrice = Math.floor(Math.random() * 40000000) + 10000000
    const downPaymentPercentage = [10, 20, 30, 40, 50][Math.floor(Math.random() * 5)]
    const downPayment = (propertyPrice * downPaymentPercentage) / 100
    const balance = propertyPrice - downPayment

    const paymentDuration = [6, 12, 18, 24][Math.floor(Math.random() * 4)]
    const monthlyPayment = balance / paymentDuration
    const totalPaid = status === "Completed" ? propertyPrice :
                      status === "Active" ? downPayment + (monthlyPayment * Math.floor(Math.random() * paymentDuration)) :
                      downPayment
    const outstandingBalance = propertyPrice - totalPaid

    const paymentsCount = Math.floor(totalPaid / monthlyPayment)
    const nextPaymentDue = status === "Active" ? new Date(Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000) : undefined
    const lastPaymentDate = status !== "Pending" ? new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000) : undefined

    const isDefaulting = status === "Active" && nextPaymentDue && nextPaymentDue < new Date()
    const daysOverdue = isDefaulting && nextPaymentDue ? Math.floor((Date.now() - nextPaymentDue.getTime()) / (1000 * 60 * 60 * 24)) : 0

    return {
      id: `enroll-${i + 1}`,
      enrollmentNumber: `EN-${new Date().getFullYear()}-${String(i + 1).padStart(5, "0")}`,
      status,
      clientId: `client-${Math.floor(Math.random() * 40) + 1}`,
      clientName: clientNames[Math.floor(Math.random() * clientNames.length)],
      propertyId: `prop-${Math.floor(Math.random() * 30) + 1}`,
      propertyName: propertyNames[Math.floor(Math.random() * propertyNames.length)],
      plotId: Math.random() > 0.5 ? `plot-${Math.floor(Math.random() * 100) + 1}` : undefined,
      plotNumber: Math.random() > 0.5 ? `P-${Math.floor(Math.random() * 100) + 1}` : undefined,
      agentId: `agent-${Math.floor(Math.random() * 5) + 1}`,
      agentName: agentNames[Math.floor(Math.random() * agentNames.length)],
      propertyPrice,
      downPayment,
      downPaymentPercentage,
      balance,
      totalPaid,
      outstandingBalance,
      paymentDuration,
      monthlyPayment,
      interestRate: 5,
      totalInterest: (balance * 5 * paymentDuration) / (100 * 12),
      totalPayable: propertyPrice + ((balance * 5 * paymentDuration) / (100 * 12)),
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      paymentFrequency: "Monthly",
      nextPaymentDue,
      nextPaymentAmount: status === "Active" ? monthlyPayment : undefined,
      lastPaymentDate,
      lastPaymentAmount: lastPaymentDate ? monthlyPayment : undefined,
      paymentsCount,
      missedPayments: isDefaulting ? Math.floor(daysOverdue / 30) : 0,
      daysOverdue,
      penaltyAmount: isDefaulting ? (monthlyPayment * 2 * Math.floor(daysOverdue / 30)) / 100 : 0,
      completionPercentage: Math.round((totalPaid / propertyPrice) * 100),
      startDate: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000),
      expectedCompletionDate: new Date(Date.now() + (paymentDuration - paymentsCount) * 30 * 24 * 60 * 60 * 1000),
      actualCompletionDate: status === "Completed" ? new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000) : undefined,
      notes: Math.random() > 0.7 ? "Client requested flexible payment terms" : undefined,
      documents: [],
      isCoOwnership: Math.random() > 0.8,
      coOwners: Math.random() > 0.8 ? [
        {
          id: `co-owner-${i}-1`,
          name: clientNames[Math.floor(Math.random() * clientNames.length)],
          relationship: "Spouse",
          percentage: 50,
        },
      ] : undefined,
      hasInsurance: Math.random() > 0.6,
      insuranceProvider: Math.random() > 0.6 ? "Nigeria Insurance Company" : undefined,
      insurancePolicyNumber: Math.random() > 0.6 ? `INS-${Math.floor(Math.random() * 10000)}` : undefined,
      createdBy: `agent-${Math.floor(Math.random() * 5) + 1}`,
      createdByName: agentNames[Math.floor(Math.random() * agentNames.length)],
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
    }
  })
}

export const mockEnrollments = generateMockEnrollments(60)

// Mock API functions
export const getEnrollments = async (): Promise<Enrollment[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockEnrollments
}

export const getEnrollment = async (id: string): Promise<Enrollment | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockEnrollments.find((enrollment) => enrollment.id === id)
}

export const createEnrollment = async (enrollment: Partial<Enrollment>): Promise<Enrollment> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const propertyPrice = enrollment.propertyPrice || 0
  const downPayment = enrollment.downPayment || 0
  const balance = propertyPrice - downPayment
  const paymentDuration = enrollment.paymentDuration || 12
  const monthlyPayment = balance / paymentDuration
  const interestRate = enrollment.interestRate || 5
  const totalInterest = (balance * interestRate * paymentDuration) / (100 * 12)

  const newEnrollment: Enrollment = {
    id: `enroll-${mockEnrollments.length + 1}`,
    enrollmentNumber: `EN-${new Date().getFullYear()}-${String(mockEnrollments.length + 1).padStart(5, "0")}`,
    status: "Pending",
    clientId: enrollment.clientId || "",
    clientName: enrollment.clientName || "",
    propertyId: enrollment.propertyId || "",
    propertyName: enrollment.propertyName || "",
    agentId: enrollment.agentId || "",
    agentName: enrollment.agentName || "",
    propertyPrice,
    downPayment,
    downPaymentPercentage: (downPayment / propertyPrice) * 100,
    balance,
    totalPaid: 0,
    outstandingBalance: propertyPrice,
    paymentDuration,
    monthlyPayment,
    interestRate,
    totalInterest,
    totalPayable: propertyPrice + totalInterest,
    paymentMethod: enrollment.paymentMethod || "Bank Transfer",
    paymentFrequency: "Monthly",
    paymentsCount: 0,
    missedPayments: 0,
    daysOverdue: 0,
    penaltyAmount: 0,
    completionPercentage: 0,
    startDate: new Date(),
    expectedCompletionDate: new Date(Date.now() + paymentDuration * 30 * 24 * 60 * 60 * 1000),
    documents: [],
    isCoOwnership: enrollment.isCoOwnership || false,
    hasInsurance: enrollment.hasInsurance || false,
    createdBy: "current-user",
    createdByName: "Current User",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  mockEnrollments.push(newEnrollment)
  return newEnrollment
}

export const updateEnrollment = async (id: string, data: Partial<Enrollment>): Promise<Enrollment> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const index = mockEnrollments.findIndex((enrollment) => enrollment.id === id)
  if (index !== -1) {
    mockEnrollments[index] = { ...mockEnrollments[index], ...data, updatedAt: new Date() }
    return mockEnrollments[index]
  }
  throw new Error("Enrollment not found")
}

export const deleteEnrollment = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const index = mockEnrollments.findIndex((enrollment) => enrollment.id === id)
  if (index !== -1) {
    mockEnrollments.splice(index, 1)
  }
}

// Payment Schedule Mock Data Storage
const mockPaymentSchedules: Map<string, EnrollmentPaymentSchedule[]> = new Map()

// Generate payment schedule for an enrollment
export const generatePaymentSchedule = (enrollment: Enrollment): EnrollmentPaymentSchedule[] => {
  const schedule: EnrollmentPaymentSchedule[] = []
  const monthlyAmount = enrollment.monthlyPayment
  const totalInstallments = enrollment.paymentDuration
  const startDate = new Date(enrollment.startDate)

  for (let i = 0; i < totalInstallments; i++) {
    const dueDate = new Date(startDate)
    dueDate.setMonth(dueDate.getMonth() + i + 1)

    const isPaid = i < enrollment.paymentsCount
    const isOverdue = !isPaid && dueDate < new Date()
    const daysOverdue = isOverdue ? Math.floor((Date.now() - dueDate.getTime()) / (1000 * 60 * 60 * 24)) : 0
    const penaltyAmount = isOverdue ? (monthlyAmount * (enrollment.overduepenaltyRate || 2) * Math.floor(daysOverdue / 30)) / 100 : 0

    schedule.push({
      id: `payment-${enrollment.id}-${i + 1}`,
      enrollmentId: enrollment.id,
      installmentNumber: i + 1,
      dueDate,
      amount: monthlyAmount,
      isPaid,
      paidDate: isPaid ? new Date(dueDate.getTime() - Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000) : undefined,
      paidAmount: isPaid ? monthlyAmount : undefined,
      isOverdue,
      penaltyAmount,
      invoiceId: Math.random() > 0.3 ? `inv-${Math.floor(Math.random() * 80) + 1}` : undefined,
    })
  }

  return schedule
}

// Get payment schedule for an enrollment
export const getPaymentSchedule = async (enrollmentId: string): Promise<EnrollmentPaymentSchedule[]> => {
  await new Promise((resolve) => setTimeout(resolve, 200))

  // Check if we already have a schedule for this enrollment
  if (mockPaymentSchedules.has(enrollmentId)) {
    return mockPaymentSchedules.get(enrollmentId)!
  }

  // Otherwise, generate a new one
  const enrollment = mockEnrollments.find((e) => e.id === enrollmentId)
  if (!enrollment) {
    throw new Error("Enrollment not found")
  }

  const schedule = generatePaymentSchedule(enrollment)
  mockPaymentSchedules.set(enrollmentId, schedule)
  return schedule
}

// Resolve a payment installment (mark as paid)
export const resolvePaymentInstallment = async (
  enrollmentId: string,
  installmentId: string,
  paidAmount: number,
  paidDate: Date = new Date()
): Promise<EnrollmentPaymentSchedule> => {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const schedule = await getPaymentSchedule(enrollmentId)
  const installment = schedule.find((s) => s.id === installmentId)

  if (!installment) {
    throw new Error("Payment installment not found")
  }

  installment.isPaid = true
  installment.paidDate = paidDate
  installment.paidAmount = paidAmount
  installment.isOverdue = false

  // Update enrollment totalPaid and related fields
  const enrollment = mockEnrollments.find((e) => e.id === enrollmentId)
  if (enrollment) {
    enrollment.totalPaid += paidAmount
    enrollment.outstandingBalance = enrollment.propertyPrice - enrollment.totalPaid
    enrollment.completionPercentage = Math.round((enrollment.totalPaid / enrollment.propertyPrice) * 100)
    enrollment.paymentsCount = schedule.filter((s) => s.isPaid).length
    enrollment.updatedAt = new Date()
  }

  return installment
}

// Unresolve a payment installment (mark as unpaid)
export const unresolvePaymentInstallment = async (
  enrollmentId: string,
  installmentId: string
): Promise<EnrollmentPaymentSchedule> => {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const schedule = await getPaymentSchedule(enrollmentId)
  const installment = schedule.find((s) => s.id === installmentId)

  if (!installment) {
    throw new Error("Payment installment not found")
  }

  const paidAmount = installment.paidAmount || 0

  installment.isPaid = false
  installment.paidDate = undefined
  installment.paidAmount = undefined

  // Recalculate if it's overdue
  const daysOverdue = Math.floor((Date.now() - installment.dueDate.getTime()) / (1000 * 60 * 60 * 24))
  installment.isOverdue = daysOverdue > 0
  installment.penaltyAmount = installment.isOverdue
    ? (installment.amount * 2 * Math.floor(daysOverdue / 30)) / 100
    : 0

  // Update enrollment totalPaid and related fields
  const enrollment = mockEnrollments.find((e) => e.id === enrollmentId)
  if (enrollment && paidAmount > 0) {
    enrollment.totalPaid -= paidAmount
    enrollment.outstandingBalance = enrollment.propertyPrice - enrollment.totalPaid
    enrollment.completionPercentage = Math.round((enrollment.totalPaid / enrollment.propertyPrice) * 100)
    enrollment.paymentsCount = schedule.filter((s) => s.isPaid).length
    enrollment.updatedAt = new Date()
  }

  return installment
}

// Cancel enrollment
export const cancelEnrollment = async (
  enrollmentId: string,
  reason: string
): Promise<Enrollment> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const enrollment = mockEnrollments.find((e) => e.id === enrollmentId)
  if (!enrollment) {
    throw new Error("Enrollment not found")
  }

  enrollment.status = "Cancelled"
  enrollment.cancelledDate = new Date()
  enrollment.cancellationReason = reason
  enrollment.updatedAt = new Date()

  return enrollment
}
