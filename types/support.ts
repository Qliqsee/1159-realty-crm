export type TicketCategory = "Technical" | "Billing" | "General" | "Property" | "Payment" | "Account" | "Other";

export type TicketPriority = "Low" | "Medium" | "High" | "Urgent";

export type TicketStatus = "Open" | "In Progress" | "Resolved" | "Closed";

export interface SupportTicket {
  id: string;
  ticketNumber: string; // Auto-generated

  // Client info
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;

  // Ticket details
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;

  // Assignment
  assignedTo?: string;
  assignedToName?: string;
  assignedAt?: Date;

  // Resolution
  resolvedBy?: string;
  resolvedByName?: string;
  resolvedAt?: Date;
  resolutionTime?: number; // In minutes
  closedAt?: Date;

  // Conversation
  messages: TicketMessage[];
  attachments: TicketAttachment[];

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastResponseAt?: Date;
  lastResponseBy?: string;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderType: "Client" | "Staff";
  message: string;
  isInternal: boolean; // Internal notes not visible to client
  createdAt: Date;
}

export interface TicketAttachment {
  id: string;
  ticketId: string;
  messageId?: string;
  fileName: string;
  fileUrl?: string;
  file?: File | Blob;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: Date;
}

export interface TicketFilters {
  status?: TicketStatus[];
  category?: TicketCategory[];
  priority?: TicketPriority[];
  assignedTo?: string;
  clientId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export interface TicketTemplate {
  id: string;
  name: string;
  category: TicketCategory;
  subject: string;
  messageTemplate: string;
  createdBy: string;
  createdAt: Date;
}
