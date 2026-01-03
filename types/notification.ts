export type NotificationType = "Info" | "Success" | "Warning" | "Error";

export type NotificationChannel = "In-App" | "Email" | "SMS" | "WhatsApp";

export type NotificationStatus = "Draft" | "Scheduled" | "Sent" | "Failed";

export interface Notification {
  id: string;

  // Content
  title: string;
  message: string;
  type: NotificationType;

  // Channels
  channels: NotificationChannel[];

  // Recipients
  recipientType: "Roles" | "Users" | "Segment" | "All";
  recipientRoles?: string[];
  recipientUserIds?: string[];
  recipientSegmentId?: string;
  totalRecipients: number;

  // Template
  templateId?: string;
  useTemplate: boolean;

  // Scheduling
  status: NotificationStatus;
  scheduledFor?: Date;
  sentAt?: Date;

  // Delivery tracking
  delivered: number;
  read: number;
  failed: number;
  deliveryRate: number;
  openRate: number;

  // Metadata
  createdBy: string;
  createdByName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  description?: string;
  type: NotificationType;
  titleTemplate: string;
  messageTemplate: string;
  variables: string[]; // e.g., ["clientName", "propertyName", "amount"]
  category: string;
  createdBy: string;
  createdByName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationFilters {
  type?: NotificationType[];
  status?: NotificationStatus[];
  channel?: NotificationChannel[];
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export interface UserNotificationPreference {
  userId: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  whatsappNotifications: boolean;
  inAppNotifications: boolean;
  categories: {
    [category: string]: boolean;
  };
}
