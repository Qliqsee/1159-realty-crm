export type KYCDocumentStatus = "Pending" | "Approved" | "Rejected" | "Not Submitted";

export interface KYCSubmission {
  id: string;
  clientId: string;
  clientName: string;

  // Identity Documents
  identityDocumentType?: "Passport" | "National ID" | "Driver's License" | "Voter's Card";
  identityDocumentNumber?: string;
  identityDocumentFrontUrl?: string;
  identityDocumentBackUrl?: string;
  identityDocumentStatus: KYCDocumentStatus;
  identityDocumentFeedback?: string;

  // Bank Details
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  bankStatementUrl?: string;
  bankDetailsStatus: KYCDocumentStatus;
  bankDetailsFeedback?: string;

  // Employment Information
  employmentStatus?: "Employed" | "Self-Employed" | "Unemployed" | "Student" | "Retired";
  employerName?: string;
  employerAddress?: string;
  occupation?: string;
  monthlyIncome?: number;
  employmentLetterUrl?: string;
  employmentStatus_DocumentStatus: KYCDocumentStatus;
  employmentFeedback?: string;

  // Next of Kin
  nextOfKinFirstName?: string;
  nextOfKinLastName?: string;
  nextOfKinFullName?: string;
  nextOfKinPhone?: string;
  nextOfKinEmail?: string;
  nextOfKinAddress?: string;
  nextOfKinRelationship?: string;
  nextOfKinStatus: KYCDocumentStatus;
  nextOfKinFeedback?: string;

  // Guarantor (if required)
  guarantorFirstName?: string;
  guarantorLastName?: string;
  guarantorFullName?: string;
  guarantorPhone?: string;
  guarantorEmail?: string;
  guarantorAddress?: string;
  guarantorOccupation?: string;
  guarantorIdUrl?: string;
  guarantorStatus: KYCDocumentStatus;
  guarantorFeedback?: string;

  // Overall Status
  overallStatus: "Pending" | "Approved" | "Rejected" | "Incomplete";
  completionPercentage: number;

  // Review
  reviewedBy?: string;
  reviewedByName?: string;
  reviewedAt?: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;

  // Submission
  submittedAt?: Date;
  lastUpdatedAt?: Date;
  resubmissionCount: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface KYCFilters {
  status?: ("Pending" | "Approved" | "Rejected" | "Incomplete")[];
  clientId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
  completionMin?: number; // Minimum completion percentage
}

export interface KYCReviewFeedback {
  section: "identity" | "bank" | "employment" | "nextOfKin" | "guarantor";
  status: KYCDocumentStatus;
  feedback?: string;
}
