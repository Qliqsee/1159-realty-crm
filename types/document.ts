export type DocumentGroupType = "Property" | "Client" | "General";

export type DocumentStatus = "Pending" | "Approved" | "Rejected";

export interface DocumentGroup {
  id: string;
  name: string;
  description?: string;
  type: DocumentGroupType;

  // Links
  propertyId?: string;
  propertyName?: string;
  clientId?: string;
  clientName?: string;

  // Contents
  referenceDocuments: ReferenceDocument[];
  tutorialVideos: TutorialVideo[];
  requiredClientDocuments: RequiredDocument[];

  // Stats
  totalDocuments: number;
  totalVideos: number;

  // Metadata
  createdBy: string;
  createdByName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReferenceDocument {
  id: string;
  groupId: string;
  name: string;
  description?: string;
  fileUrl?: string;
  file?: File | Blob;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: Date;
}

export interface TutorialVideo {
  id: string;
  groupId: string;
  title: string;
  description?: string;
  videoUrl?: string;
  videoFile?: File | Blob;
  thumbnail?: string;
  duration?: number; // In seconds
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: Date;
}

export interface RequiredDocument {
  id: string;
  groupId: string;
  documentName: string;
  documentDescription?: string;
  isRequired: boolean;
  displayOrder: number;
  createdAt: Date;
}

export interface ClientUploadedDocument {
  id: string;
  groupId: string;
  requiredDocumentId?: string;
  clientId: string;
  clientName: string;
  documentName: string;
  fileUrl?: string;
  file?: File | Blob;
  fileType: string;
  fileSize: number;
  status: DocumentStatus;
  reviewedBy?: string;
  reviewedByName?: string;
  reviewedAt?: Date;
  feedback?: string;
  uploadedAt: Date;
  updatedAt: Date;
}

export interface DocumentFilters {
  type?: DocumentGroupType[];
  propertyId?: string;
  clientId?: string;
  search?: string;
}
