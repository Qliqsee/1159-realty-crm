export type LeadStatus = "New" | "Contacted" | "Qualified" | "Converted" | "Lost";

export type LeadSource =
  | "Website"
  | "Social Media"
  | "Referral"
  | "Agent"
  | "Partner"
  | "Walk-in"
  | "Phone Call"
  | "Email"
  | "Advertisement"
  | "Event"
  | "Other";

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  status: LeadStatus;
  source: LeadSource;
  sourceDetails?: string;
  assignedAgentId?: string;
  assignedAgentName?: string;
  notes: LeadNote[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  convertedAt?: Date;
  convertedToClientId?: string;
  followUpDate?: Date;
  followUpCompleted: boolean;
  interestedProperties: string[]; // Property IDs
  paymentLinkGenerated: boolean;
  paymentLinkId?: string;
  hasPaid: boolean;
}

export interface LeadNote {
  id: string;
  leadId: string;
  userId: string;
  userName: string;
  note: string;
  createdAt: Date;
}

export interface LeadActivity {
  id: string;
  leadId: string;
  type: LeadActivityType;
  description: string;
  userId?: string;
  userName?: string;
  createdAt: Date;
  metadata?: Record<string, unknown>;
}

export type LeadActivityType =
  | "Created"
  | "Assigned"
  | "Reassigned"
  | "Status Changed"
  | "Note Added"
  | "Follow-up Set"
  | "Follow-up Completed"
  | "Payment Link Generated"
  | "Payment Received"
  | "Converted"
  | "Lost";

export interface LeadImportRow {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source?: string;
  notes?: string;
}

export interface LeadFilters {
  status?: LeadStatus[];
  source?: LeadSource[];
  assignedAgentId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
  hasFollowUp?: boolean;
  overduFollowUp?: boolean;
}
