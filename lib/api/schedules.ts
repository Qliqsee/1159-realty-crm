import type { Schedule } from "@/types"

// Mock data generator for schedules
export const generateMockSchedules = (count: number = 20): Schedule[] => {
  const locations = [
    "Head Office - Lekki",
    "Property Site - Ikeja",
    "Branch Office - Victoria Island",
    "Estate A - Ajah",
    "Phase 1 - Ikoyi",
  ]

  const descriptions = [
    "Property viewing session for new clients",
    "Group inspection tour",
    "Open house event",
    "VIP client viewing",
    "Project site tour",
  ]

  const agentNames = ["Agent 1", "Agent 2", "Agent 3", "Agent 4", "Agent 5"]

  return Array.from({ length: count }, (_, i) => {
    // Generate future dates only (between 1 and 60 days from now)
    const daysInFuture = Math.floor(Math.random() * 60) + 1
    const dateTime = new Date(Date.now() + daysInFuture * 24 * 60 * 60 * 1000)
    dateTime.setHours(9 + Math.floor(Math.random() * 8))
    dateTime.setMinutes([0, 15, 30, 45][Math.floor(Math.random() * 4)])

    return {
      id: `schedule-${i + 1}`,
      dateTime,
      location: locations[Math.floor(Math.random() * locations.length)],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      createdBy: `agent-${Math.floor(Math.random() * 5) + 1}`,
      createdByName: agentNames[Math.floor(Math.random() * agentNames.length)],
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000),
    }
  })
}

export const mockSchedules = generateMockSchedules(20)

// Mock API functions
export const getSchedules = async (): Promise<Schedule[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockSchedules.sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime())
}

export const getSchedule = async (id: string): Promise<Schedule | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockSchedules.find((schedule) => schedule.id === id)
}

export const createSchedule = async (schedule: Partial<Schedule>): Promise<Schedule> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const newSchedule: Schedule = {
    id: `schedule-${mockSchedules.length + 1}`,
    dateTime: schedule.dateTime || new Date(),
    location: schedule.location || "",
    description: schedule.description || "",
    createdBy: "current-user",
    createdByName: "Current User",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  mockSchedules.push(newSchedule)
  return newSchedule
}

export const updateSchedule = async (id: string, data: Partial<Schedule>): Promise<Schedule> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const index = mockSchedules.findIndex((schedule) => schedule.id === id)
  if (index !== -1) {
    mockSchedules[index] = { ...mockSchedules[index], ...data, updatedAt: new Date() }
    return mockSchedules[index]
  }
  throw new Error("Schedule not found")
}

export const deleteSchedule = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const index = mockSchedules.findIndex((schedule) => schedule.id === id)
  if (index !== -1) {
    mockSchedules.splice(index, 1)
  }
}
