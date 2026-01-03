export type ManualPaymentStatus = "Pending" | "Approved" | "Rejected";

export interface ManualPayment {
  id: string;

  // Links
  clientId: string;
  clientName: string;
  enrollmentId: string;
  enrollmentNumber: string;
  invoiceId?: string;
  invoiceNumber?: string;

  // Payment details
  amount: number;
  paymentDate: Date;
  paymentMethod: string;
  transactionReference: string;
  receiptUrl?: string;
  receiptFile?: File | Blob;

  // Review
  status: ManualPaymentStatus;
  reviewedBy?: string;
  reviewedByName?: string;
  reviewedAt?: Date;
  feedback?: string;
  rejectionReason?: string;

  // Submission
  submittedAt: Date;
  resubmittedAt?: Date;
  resubmissionCount: number;

  // Metadata
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ManualPaymentFilters {
  status?: ManualPaymentStatus[];
  clientId?: string;
  enrollmentId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  amountMin?: number;
  amountMax?: number;
  search?: string;
}
