export interface Appointment {
  id: string;

  // Property
  propertyId: string;
  propertyName: string;

  // Schedule
  inspectionDate: Date;
  scheduledDate: Date;
  inspectionTime: string;
  location: string;
  propertyAddress: string;
  isVirtual: boolean;

  // Capacity
  maxCapacity: number;
  currentAttendees: number;
  availableSlots: number;

  // Interested clients
  interestedClients: AppointmentInterest[];

  // Status
  status: "Active" | "Closed" | "Cancelled";

  // Metadata
  notes?: string;
  createdBy: string;
  createdByName: string;
  createdAt: Date;
  updatedAt: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
}

export interface AppointmentInterest {
  id: string;
  appointmentId: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  expressedInterestAt: Date;
  contacted: boolean;
  contactedAt?: Date;
  contactedBy?: string;
  attended: boolean;
  attendanceMarkedAt?: Date;
  notes?: string;
}

export interface AppointmentFilters {
  propertyId?: string;
  status?: ("Active" | "Closed" | "Cancelled")[];
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}
