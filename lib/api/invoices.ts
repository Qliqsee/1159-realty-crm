import type { Invoice, InvoiceStatus, InvoiceType } from "@/types"

// Mock data generator for invoices
export const generateMockInvoices = (count: number = 80): Invoice[] => {
  const statuses: InvoiceStatus[] = ["Draft", "Sent", "Paid", "Overdue", "Cancelled", "Partially Paid"]
  const types: InvoiceType[] = ["Down Payment", "Monthly Payment", "Final Payment", "Penalty", "Service Charge"]

  const clientNames = ["John Smith", "Jane Doe", "Michael Johnson", "Sarah Williams", "David Brown", "Emily Davis", "Ahmed Adeyemi", "Fatima Okafor"]

  return Array.from({ length: count }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const type = types[Math.floor(Math.random() * types.length)]

    const amount = type === "Down Payment" ? Math.floor(Math.random() * 10000000) + 5000000 :
                   type === "Monthly Payment" ? Math.floor(Math.random() * 500000) + 100000 :
                   type === "Final Payment" ? Math.floor(Math.random() * 2000000) + 500000 :
                   type === "Penalty" ? Math.floor(Math.random() * 50000) + 10000 :
                   Math.floor(Math.random() * 100000) + 20000

    const taxRate = 7.5
    const tax = (amount * taxRate) / 100
    const total = amount + tax

    const amountPaid = status === "Paid" ? total :
                       status === "Partially Paid" ? total * (Math.random() * 0.5 + 0.3) :
                       0

    const issueDate = new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000)
    const dueDate = new Date(issueDate.getTime() + 30 * 24 * 60 * 60 * 1000)
    const isOverdue = status === "Sent" && dueDate < new Date()

    return {
      id: `inv-${i + 1}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(i + 1).padStart(5, "0")}`,
      type,
      status: isOverdue ? "Overdue" : status,
      clientId: `client-${Math.floor(Math.random() * 40) + 1}`,
      clientName: clientNames[Math.floor(Math.random() * clientNames.length)],
      clientEmail: `client${i}@example.com`,
      enrollmentId: Math.random() > 0.2 ? `enroll-${Math.floor(Math.random() * 60) + 1}` : undefined,
      enrollmentNumber: Math.random() > 0.2 ? `EN-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 60) + 1).padStart(5, "0")}` : undefined,
      propertyId: Math.random() > 0.2 ? `prop-${Math.floor(Math.random() * 30) + 1}` : undefined,
      propertyName: Math.random() > 0.2 ? "Land at Phase 1, Lekki" : undefined,
      amount,
      tax,
      discount: 0,
      total,
      amountPaid,
      amountDue: total - amountPaid,
      currency: "NGN",
      issueDate,
      dueDate,
      paidDate: status === "Paid" ? new Date(dueDate.getTime() - Math.floor(Math.random() * 20) * 24 * 60 * 60 * 1000) : undefined,
      items: [
        {
          id: `item-${i}-1`,
          description: `${type} for property`,
          quantity: 1,
          unitPrice: amount,
          total: amount,
        },
      ],
      notes: Math.random() > 0.7 ? "Payment due within 30 days of invoice date" : undefined,
      paymentInstructions: "Bank Transfer to Account: 0123456789, Bank: First Bank",
      termsAndConditions: "Payment is due within 30 days. Late payments may incur penalty charges.",
      sentDate: status !== "Draft" ? issueDate : undefined,
      sentTo: status !== "Draft" ? [`client${i}@example.com`] : undefined,
      lastReminderSent: status === "Overdue" && Math.random() > 0.5 ? new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000) : undefined,
      reminderCount: status === "Overdue" ? Math.floor(Math.random() * 3) : 0,
      createdBy: `agent-${Math.floor(Math.random() * 5) + 1}`,
      createdByName: `Agent ${Math.floor(Math.random() * 5) + 1}`,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 120) * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
    }
  })
}

export const mockInvoices = generateMockInvoices(80)

// Mock API functions
export const getInvoices = async (): Promise<Invoice[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockInvoices
}

export const getInvoice = async (id: string): Promise<Invoice | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockInvoices.find((invoice) => invoice.id === id)
}

export const createInvoice = async (invoice: Partial<Invoice>): Promise<Invoice> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const amount = invoice.amount || 0
  const taxRate = 7.5
  const tax = (amount * taxRate) / 100
  const discount = invoice.discount || 0
  const total = amount + tax - discount

  const newInvoice: Invoice = {
    id: `inv-${mockInvoices.length + 1}`,
    invoiceNumber: `INV-${new Date().getFullYear()}-${String(mockInvoices.length + 1).padStart(5, "0")}`,
    type: invoice.type || "Monthly Payment",
    status: "Draft",
    clientId: invoice.clientId || "",
    clientName: invoice.clientName || "",
    clientEmail: invoice.clientEmail || "",
    enrollmentId: invoice.enrollmentId,
    enrollmentNumber: invoice.enrollmentNumber,
    propertyId: invoice.propertyId,
    propertyName: invoice.propertyName,
    amount,
    tax,
    discount,
    total,
    amountPaid: 0,
    amountDue: total,
    currency: "NGN",
    issueDate: new Date(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    items: invoice.items || [],
    paymentInstructions: "Bank Transfer to Account: 0123456789, Bank: First Bank",
    termsAndConditions: "Payment is due within 30 days. Late payments may incur penalty charges.",
    reminderCount: 0,
    createdBy: "current-user",
    createdByName: "Current User",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  mockInvoices.push(newInvoice)
  return newInvoice
}

export const updateInvoice = async (id: string, data: Partial<Invoice>): Promise<Invoice> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const index = mockInvoices.findIndex((invoice) => invoice.id === id)
  if (index !== -1) {
    mockInvoices[index] = { ...mockInvoices[index], ...data, updatedAt: new Date() }
    return mockInvoices[index]
  }
  throw new Error("Invoice not found")
}

export const deleteInvoice = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const index = mockInvoices.findIndex((invoice) => invoice.id === id)
  if (index !== -1) {
    mockInvoices.splice(index, 1)
  }
}
