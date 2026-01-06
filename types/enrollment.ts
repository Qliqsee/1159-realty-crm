export type EnrollmentStatus = "Pending" | "Active" | "Completed" | "Suspended" | "Cancelled" | "Frozen";

export type PaymentType = "Outright" | "Installment";

export type PaymentMethod = "Bank Transfer" | "Cash" | "Card" | "Cheque" | "Mobile Money";

export type EnrollmentType = "Company Lead" | "Private Lead";

export interface Enrollment {
  id: string;
  enrollmentNumber: string; // Auto-generated unique ID

  // Client & Property
  clientId: string;
  clientName: string;
  propertyId: string;
  propertyName: string;
  propertyType?: string;

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
  partnerId?: string;
  partnerName?: string;
  enrollmentType?: EnrollmentType;

  // Pricing
  propertyPrice: number;
  downPayment: number;
  downPaymentPercentage: number;
  balance: number;
  totalPaid: number;
  outstandingBalance: number;
  totalAmount?: number;
  amountPaid?: number;
  amountPending?: number;
  interestAmount?: number;
  penaltyAmount: number;
  discountAmount?: number;
  finalAmount?: number;

  // Payment
  paymentType?: PaymentType;
  paymentDuration: number; // In months
  monthlyPayment: number;
  installmentDuration?: number; // In months
  installmentMonthlyAmount?: number;
  interestRate: number; // Percentage
  totalInterest: number;
  totalPayable: number;
  overduepenaltyRate?: number; // Percentage
  paymentMethod: PaymentMethod;
  paymentFrequency: string;
  nextPaymentDue?: Date;
  nextPaymentAmount?: number;
  lastPaymentDate?: Date;
  lastPaymentAmount?: number;
  paymentsCount: number;
  missedPayments: number;
  daysOverdue: number;

  // Progress
  status: EnrollmentStatus;
  progressPercentage?: number;
  completionPercentage: number;
  startDate: Date;
  expectedCompletionDate: Date;
  completionDate?: Date;
  actualCompletionDate?: Date;
  cancelledDate?: Date;
  cancellationReason?: string;
  frozenDate?: Date;
  frozenReason?: string;

  // Additional Details
  notes?: string;
  documents: any[];
  isCoOwnership: boolean;
  coOwners?: Array<{
    id: string;
    name: string;
    relationship: string;
    percentage: number;
  }>;
  hasInsurance: boolean;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;

  // Interest linkage
  linkedInterestId?: string; // If created from a property interest

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByName: string;
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
