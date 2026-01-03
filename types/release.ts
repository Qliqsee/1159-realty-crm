export type ReleaseType = "Commission" | "Revocation"; // Revocation = Refund

export type ReleaseStatus = "Submitted" | "Pending" | "Paid";

export interface Release {
  id: string;
  releaseNumber: string; // Auto-generated

  // Type & Recipient
  type: ReleaseType;
  recipientId: string;
  recipientName: string;
  recipientType?: "Agent" | "Partner" | "Client";

  // Amount
  amount: number;
  currency: string;

  // Bank Details
  bankName?: string;
  accountNumber?: string;
  accountName?: string;

  // Reason & Description
  reason: string;
  description?: string;

  // Linked entities
  commissionIds?: string[]; // If release type is Commission
  enrollmentId?: string; // If release type is Revocation (refund)

  // Status
  status: ReleaseStatus;

  // Approval & Payment
  requestedBy: string;
  requestedByName: string;
  requestedAt: Date;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: Date;
  paidBy?: string;
  paidByName?: string;
  paidAt?: Date;
  paymentReference?: string;
  paymentMethod?: string;

  // Rejection
  rejectedBy?: string;
  rejectedByName?: string;
  rejectedAt?: Date;
  rejectionReason?: string;

  // Metadata
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReleaseFilters {
  type?: ReleaseType[];
  status?: ReleaseStatus[];
  recipientId?: string;
  recipientType?: ("Agent" | "Partner" | "Client")[];
  dateFrom?: Date;
  dateTo?: Date;
  amountMin?: number;
  amountMax?: number;
  search?: string;
}

export interface ReleaseConfig {
  autoReleaseEnabled: boolean;
  autoReleaseMode: "all-except" | "only-specified" | "manual";
  autoReleaseExceptUsers: string[]; // User IDs
  autoReleaseOnlyUsers: string[]; // User IDs
  requiresApproval: boolean;
  approverRoles: string[];
}
