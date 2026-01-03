export type SegmentFilterType = "Property" | "Location" | "Gender" | "Source" | "Agent" | "Partner" | "Channel" | "UserType";

export interface ContactSegment {
  id: string;
  name: string;
  description?: string;

  // Filters
  filters: SegmentFilter[];
  filterLogic: "AND" | "OR"; // How to combine filters

  // Manual contacts
  manualContacts: ContactInfo[];

  // Stats
  totalContacts: number;
  lastUsedAt?: Date;
  usageCount: number;

  // Metadata
  tags: string[];
  createdBy: string;
  createdByName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SegmentFilter {
  id: string;
  type: SegmentFilterType;
  operator: "equals" | "not-equals" | "in" | "not-in" | "contains";
  value: string | string[]; // Property ID, Location ID, Gender value, etc.
  displayValue?: string; // For UI display
}

export interface ContactInfo {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  type: "Client" | "Partner" | "Lead" | "Manual";
  typeId?: string; // Client/Partner/Lead ID if applicable
  source?: string;
  tags?: string[];
}

export interface SegmentFilters {
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  createdBy?: string;
  tags?: string[];
}

export interface CampaignStatistics {
  totalSegments: number;
  totalContacts: number;
  activeSegments: number;
  mostUsedSegments: ContactSegment[];
  recentSegments: ContactSegment[];
}
