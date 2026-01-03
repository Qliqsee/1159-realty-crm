import type { Appointment, AppointmentStatus, AppointmentType } from "@/types"

// Mock data generator for appointments
export const generateMockAppointments = (count: number = 50): Appointment[] => {
  const types: AppointmentType[] = ["Property Viewing", "Consultation", "Documentation", "Payment Collection", "Follow-up"]
  const statuses: AppointmentStatus[] = ["Scheduled", "Confirmed", "Completed", "Cancelled", "No Show", "Rescheduled"]
  const priorities = ["Low", "Medium", "High", "Urgent"] as const

  const clientNames = ["John Smith", "Jane Doe", "Michael Johnson", "Sarah Williams", "David Brown", "Emily Davis", "Ahmed Adeyemi", "Fatima Okafor"]
  const agentNames = ["Agent 1", "Agent 2", "Agent 3", "Agent 4", "Agent 5"]
  const propertyNames = ["Land at Phase 1, Lekki", "Apartment at Estate A, Ikeja", "Land at Central, Ajah", "Apartment at Phase 2, Victoria Island"]
  const locations = ["Head Office - Lekki", "Property Site - Ikeja", "Client Location - Ajah", "Branch Office - Victoria Island", "Virtual Meeting"]

  return Array.from({ length: count }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const priority = priorities[Math.floor(Math.random() * priorities.length)]

    const scheduledDate = new Date(Date.now() + (Math.floor(Math.random() * 60) - 30) * 24 * 60 * 60 * 1000)
    const startTime = new Date(scheduledDate)
    startTime.setHours(9 + Math.floor(Math.random() * 8))
    startTime.setMinutes([0, 15, 30, 45][Math.floor(Math.random() * 4)])

    const endTime = new Date(startTime)
    endTime.setHours(startTime.getHours() + (type === "Property Viewing" ? 2 : 1))

    const hasReminder = Math.random() > 0.3
    const reminderSent = hasReminder && scheduledDate < new Date()

    return {
      id: `appt-${i + 1}`,
      type,
      status,
      priority,
      title: `${type} - ${clientNames[Math.floor(Math.random() * clientNames.length)]}`,
      description: `${type} appointment for ${propertyNames[Math.floor(Math.random() * propertyNames.length)]}`,
      clientId: `client-${Math.floor(Math.random() * 40) + 1}`,
      clientName: clientNames[Math.floor(Math.random() * clientNames.length)],
      agentId: `agent-${Math.floor(Math.random() * 5) + 1}`,
      agentName: agentNames[Math.floor(Math.random() * agentNames.length)],
      propertyId: Math.random() > 0.2 ? `prop-${Math.floor(Math.random() * 30) + 1}` : undefined,
      propertyName: Math.random() > 0.2 ? propertyNames[Math.floor(Math.random() * propertyNames.length)] : undefined,
      scheduledDate,
      startTime,
      endTime,
      duration: type === "Property Viewing" ? 120 : 60,
      location: locations[Math.floor(Math.random() * locations.length)],
      isVirtual: Math.random() > 0.7,
      meetingLink: Math.random() > 0.7 ? "https://meet.google.com/abc-defg-hij" : undefined,
      attendees: [
        {
          id: `client-${Math.floor(Math.random() * 40) + 1}`,
          name: clientNames[Math.floor(Math.random() * clientNames.length)],
          email: `client${i}@example.com`,
          type: "Client",
          status: "Accepted",
        },
      ],
      reminderEnabled: hasReminder,
      reminderTime: hasReminder ? 60 : undefined,
      reminderSent: reminderSent,
      notes: Math.random() > 0.5 ? "Client requested specific viewing time. Prepare property documents." : undefined,
      outcome: status === "Completed" ? (Math.random() > 0.5 ? "Positive - Client interested" : "Neutral - Client needs time") : undefined,
      followUpRequired: status === "Completed" && Math.random() > 0.5,
      followUpDate: status === "Completed" && Math.random() > 0.5 ? new Date(Date.now() + Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000) : undefined,
      createdBy: `agent-${Math.floor(Math.random() * 5) + 1}`,
      createdByName: agentNames[Math.floor(Math.random() * agentNames.length)],
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000),
      completedAt: status === "Completed" ? new Date(scheduledDate.getTime() + 3600000) : undefined,
      cancelledAt: status === "Cancelled" ? new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000) : undefined,
      cancellationReason: status === "Cancelled" ? "Client unavailable" : undefined,
    }
  })
}

export const mockAppointments = generateMockAppointments(50)

// Mock API functions
export const getAppointments = async (): Promise<Appointment[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockAppointments
}

export const getAppointment = async (id: string): Promise<Appointment | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockAppointments.find((appointment) => appointment.id === id)
}

export const createAppointment = async (appointment: Partial<Appointment>): Promise<Appointment> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const newAppointment: Appointment = {
    id: `appt-${mockAppointments.length + 1}`,
    type: appointment.type || "Consultation",
    status: "Scheduled",
    priority: appointment.priority || "Medium",
    title: appointment.title || "",
    description: appointment.description || "",
    clientId: appointment.clientId || "",
    clientName: appointment.clientName || "",
    agentId: appointment.agentId || "",
    agentName: appointment.agentName || "",
    scheduledDate: appointment.scheduledDate || new Date(),
    startTime: appointment.startTime || new Date(),
    endTime: appointment.endTime || new Date(),
    duration: appointment.duration || 60,
    location: appointment.location || "",
    isVirtual: appointment.isVirtual || false,
    attendees: appointment.attendees || [],
    reminderEnabled: appointment.reminderEnabled || false,
    reminderSent: false,
    followUpRequired: false,
    createdBy: "current-user",
    createdByName: "Current User",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  mockAppointments.push(newAppointment)
  return newAppointment
}

export const updateAppointment = async (id: string, data: Partial<Appointment>): Promise<Appointment> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const index = mockAppointments.findIndex((appointment) => appointment.id === id)
  if (index !== -1) {
    mockAppointments[index] = { ...mockAppointments[index], ...data, updatedAt: new Date() }
    return mockAppointments[index]
  }
  throw new Error("Appointment not found")
}

export const deleteAppointment = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const index = mockAppointments.findIndex((appointment) => appointment.id === id)
  if (index !== -1) {
    mockAppointments.splice(index, 1)
  }
}
