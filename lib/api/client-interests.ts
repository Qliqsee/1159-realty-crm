import type { ClientInterest } from "@/types"

// Mock data generator for client interests
export const generateMockClientInterests = (count: number = 50): ClientInterest[] => {
  const statuses: ClientInterest["status"][] = ["New", "Contacted", "Converted", "Lost"]

  const clientNames = [
    "Ahmed Ibrahim", "Sarah Okafor", "David Adeyemi", "Fatima Bello",
    "Michael Eze", "Aisha Musa", "John Adeleke", "Grace Nwosu",
    "Chidi Okoro", "Blessing Adegoke", "Ibrahim Suleiman", "Mary Okonkwo"
  ]

  const propertyNames = [
    "Lekki Pearl Gardens", "Ikoyi Heights", "Victoria Island Estate",
    "Banana Island Luxury", "Abuja Central Park", "Lagos Waterfront",
    "Maitama Gardens", "GRA Port Harcourt", "Ikeja City Mall Area"
  ]

  const messages = [
    "I'm interested in purchasing this property for my family",
    "Can I get more details about payment plans?",
    "Looking for a good investment opportunity",
    "Is this property still available?",
    "I'd like to schedule a site visit",
    "Interested in the installment payment option",
    "Can I speak with an agent about this?",
    "This looks perfect for my needs"
  ]

  return Array.from({ length: count }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const createdAt = new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000)

    return {
      id: `interest-${i + 1}`,
      clientId: `client-${Math.floor(Math.random() * 40) + 1}`,
      clientName: clientNames[Math.floor(Math.random() * clientNames.length)],
      propertyId: `property-${Math.floor(Math.random() * 20) + 1}`,
      propertyName: propertyNames[Math.floor(Math.random() * propertyNames.length)],
      message: Math.random() > 0.3 ? messages[Math.floor(Math.random() * messages.length)] : undefined,
      status,
      contactedAt: ["Contacted", "Converted", "Lost"].includes(status)
        ? new Date(createdAt.getTime() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000)
        : undefined,
      convertedToEnrollmentId: status === "Converted" ? `enrollment-${Math.floor(Math.random() * 100) + 1}` : undefined,
      createdAt,
      updatedAt: new Date(createdAt.getTime() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
    }
  })
}

export const mockClientInterests = generateMockClientInterests(50)

// Mock API functions
export const getClientInterests = async (): Promise<ClientInterest[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockClientInterests
}

export const getClientInterest = async (id: string): Promise<ClientInterest | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockClientInterests.find((interest) => interest.id === id)
}

export const updateClientInterest = async (id: string, data: Partial<ClientInterest>): Promise<ClientInterest> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const index = mockClientInterests.findIndex((interest) => interest.id === id)
  if (index !== -1) {
    mockClientInterests[index] = { ...mockClientInterests[index], ...data, updatedAt: new Date() }
    return mockClientInterests[index]
  }
  throw new Error("Client interest not found")
}

export const deleteClientInterest = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const index = mockClientInterests.findIndex((interest) => interest.id === id)
  if (index !== -1) {
    mockClientInterests.splice(index, 1)
  }
}
