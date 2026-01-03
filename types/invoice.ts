export type InvoiceStatus = "Pending" | "Paid" | "Overdue" | "Resolved";

export interface Invoice {
  id: string;
  invoiceNumber: string; // Auto-generated

  // Links
  enrollmentId: string;
  enrollmentNumber: string;
  clientId: string;
  clientName: string;
  propertyId: string;
  propertyName: string;

  // Amounts
  amount: number;
  penaltyAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;

  // Dates
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
  resolvedDate?: Date;

  // Status
  status: InvoiceStatus;
  isResolved: boolean;
  isOverdue: boolean;
  overdueDays: number;

  // Payment
  paymentMethod?: string;
  paymentReference?: string;
  installmentNumber?: number; // Which installment this invoice is for

  // Metadata
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  resolvedBy?: string;
}

export interface InvoiceFilters {
  status?: InvoiceStatus[];
  clientId?: string;
  propertyId?: string;
  enrollmentId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
  isOverdue?: boolean;
  agingDays?: number; // e.g., 30, 60, 90 days overdue
}
