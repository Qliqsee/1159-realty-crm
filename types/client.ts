export type ClientStatus = "Active" | "Inactive" | "Suspended";

export type KYCStatus = "Pending" | "Approved" | "Rejected" | "Incomplete";

export type Gender = "Male" | "Female" | "Other" | "Prefer not to say";

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  gender?: Gender;
  dateOfBirth?: Date;
  avatar?: string;

  // Status
  status: ClientStatus;
  kycStatus: KYCStatus;
  kycCompletionPercentage: number;

  // Assignment
  assignedAgentId: string;
  assignedAgentName: string;
  source: string; // How they joined
  referralCode?: string;
  referredBy?: string; // Agent or Partner ID
  referredByName?: string;
  referredByType?: "Agent" | "Partner";

  // Address
  address?: string;
  city?: string;
  state?: string;
  country?: string;

  // Partnership
  isPartner: boolean;
  partnershipStatus?: "Pending" | "Approved" | "Rejected";
  partnershipApprovedAt?: Date;

  // Stats
  totalPropertiesOwned: number;
  totalSpent: number;
  totalCommissionGenerated: number; // For agents

  // Metadata
  tags: string[];
  notes: ClientNote[];
  createdAt: Date;
  updatedAt: Date;
  joinedAt: Date;
  lastActivity?: Date;
}

export interface ClientNote {
  id: string;
  clientId: string;
  userId: string;
  userName: string;
  note: string;
  createdAt: Date;
}

export interface ClientInterest {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  propertyId: string;
  propertyName: string;
  message?: string;
  status: "New" | "Contacted" | "Converted" | "Lost";
  contactedAt?: Date;
  convertedToEnrollmentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientFilters {
  status?: ClientStatus[];
  kycStatus?: KYCStatus[];
  agentId?: string;
  partnerId?: string;
  stateId?: string;
  lgaId?: string;
  areaId?: string;
  isPartner?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}
