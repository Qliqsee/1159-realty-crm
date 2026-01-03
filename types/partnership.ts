export type PartnershipApplicationStatus = "Pending" | "Under Review" | "Approved" | "Rejected";

export type PartnerStatus = "Active" | "Inactive" | "Suspended";

export interface PartnershipApplication {
  id: string;

  // Applicant (already a client)
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;

  // Application details
  status: PartnershipApplicationStatus;
  motivation?: string; // Why they want to be a partner
  experience?: string;
  referralNetwork?: string;

  // Documents
  documents: PartnershipDocument[];
  documentsComplete: boolean;

  // Review
  reviewedBy?: string;
  reviewedByName?: string;
  reviewedAt?: Date;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: Date;
  rejectedBy?: string;
  rejectedByName?: string;
  rejectedAt?: Date;
  rejectionReason?: string;

  // Agent linkage
  linkedAgentId?: string; // Agent assigned to this partner
  linkedAgentName?: string;

  // Metadata
  appliedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PartnershipDocument {
  id: string;
  applicationId: string;
  documentType: string;
  documentUrl?: string;
  documentFile?: File | Blob;
  uploadedAt: Date;
  status: "Pending" | "Approved" | "Rejected";
  feedback?: string;
}

export interface Partner {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;

  // Partnership details
  status: PartnerStatus;
  referralCode: string;
  referralLink: string;

  // Linked agent
  linkedAgentId: string;
  linkedAgentName: string;

  // Performance
  totalReferrals: number;
  activeReferrals: number;
  totalCommissionEarned: number;
  pendingCommission: number;
  paidCommission: number;

  // Dates
  approvedAt: Date;
  activatedAt?: Date;
  deactivatedAt?: Date;
  suspendedAt?: Date;
  suspensionReason?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface PartnershipFilters {
  status?: PartnershipApplicationStatus[];
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export interface PartnerFilters {
  status?: PartnerStatus[];
  agentId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}
