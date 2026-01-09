import type { Property, PropertyType, PropertyStatus, PropertySize } from "@/types"
import { initializeMockUnits } from "@/lib/data/units"

// Mock data generator for properties
export const generateMockProperties = (count: number = 30): Property[] => {
  const types: PropertyType[] = ["Land", "Apartment"]
  const statuses: PropertyStatus[] = ["Available", "Sold Out", "Reserved", "Disabled"]
  const states = ["Lagos", "Abuja", "Rivers", "Ogun", "Oyo"]
  const lgas = ["Ikeja", "Lekki", "Ajah", "Victoria Island", "Surulere"]
  const areas = ["Phase 1", "Phase 2", "Estate A", "Estate B", "Central"]

  return Array.from({ length: count }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const state = states[Math.floor(Math.random() * states.length)]
    const lga = lgas[Math.floor(Math.random() * lgas.length)]
    const area = areas[Math.floor(Math.random() * areas.length)]

    const regularPrice = Math.floor(Math.random() * 50000000) + 5000000
    const discountPercentage = Math.random() > 0.7 ? Math.floor(Math.random() * 20) + 5 : 0
    const finalPrice = regularPrice - (regularPrice * discountPercentage / 100)

    const totalPlots = type === "Land" ? Math.floor(Math.random() * 100) + 20 : 0
    const allocatedPlots = Math.floor(totalPlots * Math.random() * 0.6)
    const availablePlots = totalPlots - allocatedPlots

    const availableSizes: PropertySize[] = type === "Land" ? [
      {
        id: `size-${i}-1`,
        propertyId: `prop-${i + 1}`,
        size: 300,
        unit: "sqm",
        price: regularPrice * 0.8,
        isAvailable: true,
        displayOrder: 1,
      },
      {
        id: `size-${i}-2`,
        propertyId: `prop-${i + 1}`,
        size: 500,
        unit: "sqm",
        price: regularPrice,
        isAvailable: true,
        displayOrder: 2,
      },
      {
        id: `size-${i}-3`,
        propertyId: `prop-${i + 1}`,
        size: 1000,
        unit: "sqm",
        price: regularPrice * 1.5,
        isAvailable: true,
        displayOrder: 3,
      },
    ] : []

    return {
      id: `prop-${i + 1}`,
      name: `${type === "Land" ? "Land" : "Apartment"} at ${area}, ${lga}`,
      type,
      subtype: type === "Land" ? (Math.random() > 0.5 ? "Residential" : "Commercial") : "Luxury",
      status,
      description: `Premium ${type.toLowerCase()} property located in ${area}, ${lga}, ${state}. Perfect for investment and development.`,
      state,
      stateId: `state-${states.indexOf(state) + 1}`,
      lga,
      lgaId: `lga-${lgas.indexOf(lga) + 1}`,
      area,
      areaId: `area-${areas.indexOf(area) + 1}`,
      latitude: 6.5 + Math.random() * 0.5,
      longitude: 3.3 + Math.random() * 0.5,
      nearbyLandmarks: ["Shopping Mall", "School", "Hospital", "Market"],
      regularPrice,
      marketPrice: Math.random() > 0.5 ? regularPrice * 1.1 : undefined,
      discountPercentage,
      finalPrice,
      availableSizes,
      paymentDurations: [6, 12, 18, 24],
      interestRate: 5,
      overduepenaltyRate: 2,
      images: [],
      videos: [],
      primaryImageId: "",
      totalPlots,
      availablePlots,
      allocatedPlots,
      views: Math.floor(Math.random() * 1000),
      interests: Math.floor(Math.random() * 100),
      enrollments: Math.floor(Math.random() * 50),
      sold: Math.floor(Math.random() * 30),
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      createdBy: "admin-1",
      lastUpdatedBy: "admin-1",
    }
  })
}

export const mockProperties = generateMockProperties(30)

// Initialize units data for properties
initializeMockUnits(mockProperties)

// Mock API functions
export const getProperties = async (): Promise<Property[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockProperties
}

export const getProperty = async (id: string): Promise<Property | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockProperties.find((property) => property.id === id)
}

export const createProperty = async (property: Partial<Property>): Promise<Property> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const newProperty: Property = {
    id: `prop-${mockProperties.length + 1}`,
    name: property.name || "",
    type: property.type || "Land",
    subtype: property.subtype || "Residential",
    status: property.status || "Available",
    description: property.description || "",
    state: property.state || "",
    stateId: property.stateId || "",
    lga: property.lga || "",
    lgaId: property.lgaId || "",
    area: property.area || "",
    areaId: property.areaId || "",
    nearbyLandmarks: property.nearbyLandmarks || [],
    regularPrice: property.regularPrice || 0,
    discountPercentage: property.discountPercentage || 0,
    finalPrice: property.finalPrice || 0,
    availableSizes: property.availableSizes || [],
    paymentDurations: property.paymentDurations || [12, 18, 24],
    interestRate: property.interestRate || 5,
    overduepenaltyRate: property.overduepenaltyRate || 2,
    images: property.images || [],
    videos: property.videos || [],
    primaryImageId: property.primaryImageId || "",
    totalPlots: property.totalPlots || 0,
    availablePlots: property.availablePlots || 0,
    allocatedPlots: property.allocatedPlots || 0,
    views: 0,
    interests: 0,
    enrollments: 0,
    sold: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "admin-1",
    lastUpdatedBy: "admin-1",
  }
  mockProperties.push(newProperty)
  return newProperty
}

export const updateProperty = async (id: string, data: Partial<Property>): Promise<Property> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const index = mockProperties.findIndex((property) => property.id === id)
  if (index !== -1) {
    mockProperties[index] = { ...mockProperties[index], ...data, updatedAt: new Date() }
    return mockProperties[index]
  }
  throw new Error("Property not found")
}

export const deleteProperty = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const index = mockProperties.findIndex((property) => property.id === id)
  if (index !== -1) {
    mockProperties.splice(index, 1)
  }
}

export const searchProperties = async (query: string): Promise<Property[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  if (!query) return mockProperties

  const lowerQuery = query.toLowerCase()
  return mockProperties.filter(
    (property) =>
      property.name.toLowerCase().includes(lowerQuery) ||
      property.address.toLowerCase().includes(lowerQuery) ||
      property.state?.toLowerCase().includes(lowerQuery)
  )
}
