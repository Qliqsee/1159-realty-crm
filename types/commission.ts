export type CommissionStatus = "Pending" | "Paid" | "Cancelled";

export type CommissionType = "Agent" | "Partner";

export interface Commission {
  id: string;

  // Recipient
  recipientId: string;
  recipientName: string;
  recipientType: CommissionType;

  // Source
  enrollmentId: string;
  enrollmentNumber: string;
  clientId: string;
  clientName: string;
  propertyId: string;
  propertyName: string;

  // Commission details
  saleAmount: number; // Total enrollment amount
  commissionPercentage: number; // 70% for agents, 30% for partners
  commissionAmount: number;
  status: CommissionStatus;

  // Payment
  paidDate?: Date;
  paidBy?: string;
  paidByName?: string;
  paymentReference?: string;
  paymentMethod?: string;

  // Cancellation
  cancelledDate?: Date;
  cancelledBy?: string;
  cancelledByName?: string;
  cancellationReason?: string;

  // Metadata
  earnedDate: Date; // When the enrollment payment was made
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommissionFilters {
  type?: CommissionType[];
  status?: CommissionStatus[];
  recipientId?: string;
  enrollmentId?: string;
  propertyId?: string;
  clientId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  amountMin?: number;
  amountMax?: number;
  search?: string;
}

export interface CommissionSummary {
  totalCommissions: number;
  totalPaid: number;
  totalPending: number;
  totalCancelled: number;
  agentCommissions: number;
  partnerCommissions: number;
  commissionsThisMonth: number;
  commissionsThisYear: number;
}

export interface AgentCommissionBreakdown {
  agentId: string;
  agentName: string;
  totalEarned: number;
  totalPaid: number;
  totalPending: number;
  directSales: number;
  treeCommissions: number; // From downline
  numberOfClients: number;
  numberOfEnrollments: number;
}

export interface PartnerCommissionBreakdown {
  partnerId: string;
  partnerName: string;
  totalEarned: number;
  totalPaid: number;
  totalPending: number;
  directReferrals: number;
  numberOfClients: number;
  numberOfEnrollments: number;
}
