export type EnrollmentStatus = "Ongoing" | "Completed" | "Cancelled" | "Frozen";

export type PaymentType = "Outright" | "Installment";

export type EnrollmentType = "Company Lead" | "Private Lead";

export interface Enrollment {
  id: string;
  enrollmentNumber: string; // Auto-generated unique ID

  // Client & Property
  clientId: string;
  clientName: string;
  propertyId: string;
  propertyName: string;
  propertyType: string;

  // Land size selection (if property is land)
  selectedSizeId?: string;
  selectedSize?: number;
  selectedSizeUnit?: string;

  // Plot assignment
  plotId?: string;
  plotNumber?: string;

  // Agent & Assignment
  agentId: string;
  agentName: string;
  enrollmentType: EnrollmentType;

  // Pricing
  totalAmount: number;
  amountPaid: number;
  amountPending: number;
  interestAmount: number;
  penaltyAmount: number;
  discountAmount: number;
  finalAmount: number;

  // Payment
  paymentType: PaymentType;
  installmentDuration?: number; // In months
  installmentMonthlyAmount?: number;
  interestRate: number; // Percentage
  overduepenaltyRate: number; // Percentage

  // Progress
  status: EnrollmentStatus;
  progressPercentage: number;
  startDate: Date;
  expectedCompletionDate?: Date;
  completionDate?: Date;
  cancelledDate?: Date;
  cancellationReason?: string;
  frozenDate?: Date;
  frozenReason?: string;

  // Interest linkage
  linkedInterestId?: string; // If created from a property interest

  // Metadata
  notes: EnrollmentNote[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastModifiedBy?: string;
}

export interface EnrollmentNote {
  id: string;
  enrollmentId: string;
  userId: string;
  userName: string;
  note: string;
  createdAt: Date;
}

export interface EnrollmentTimeline {
  id: string;
  enrollmentId: string;
  type: EnrollmentTimelineType;
  description: string;
  userId?: string;
  userName?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export type EnrollmentTimelineType =
  | "Created"
  | "Plot Assigned"
  | "Plot Changed"
  | "Payment Received"
  | "Invoice Generated"
  | "Overdue"
  | "Penalty Applied"
  | "Status Changed"
  | "Frozen"
  | "Unfrozen"
  | "Completed"
  | "Cancelled"
  | "Modified";

export interface EnrollmentFilters {
  status?: EnrollmentStatus[];
  paymentType?: PaymentType[];
  propertyId?: string;
  clientId?: string;
  agentId?: string;
  enrollmentType?: EnrollmentType[];
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export interface EnrollmentPaymentSchedule {
  id: string;
  enrollmentId: string;
  installmentNumber: number;
  dueDate: Date;
  amount: number;
  isPaid: boolean;
  paidDate?: Date;
  paidAmount?: number;
  invoiceId?: string;
  isOverdue: boolean;
  penaltyAmount: number;
}
