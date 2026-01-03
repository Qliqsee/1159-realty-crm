export interface Schedule {
  id: string
  dateTime: Date
  location: string
  description: string
  appointmentCount: number // Number of appointments attached to this schedule
  createdBy: string
  createdByName: string
  createdAt: Date
  updatedAt: Date
}
