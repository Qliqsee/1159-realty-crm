import type { Unit, UnitStatus } from "@/types"

const unitSizes = ["500 sqm", "600 sqm", "700 sqm", "800 sqm", "1000 sqm", "1200 sqm", "1500 sqm"]
const unitStatuses: UnitStatus[] = ["AVAILABLE", "SOLD", "RESERVED", "ARCHIVED"]
const unitFeatures = ["Roadside", "Corner plot", "River view", "Park view", "Gym nearby", "School nearby", ""]

export function generateMockUnits(propertyId: string, count: number = 20): Unit[] {
  const units: Unit[] = []

  for (let i = 1; i <= count; i++) {
    const status = unitStatuses[Math.floor(Math.random() * unitStatuses.length)]
    const blockLetter = String.fromCharCode(65 + Math.floor((i - 1) / 10))
    const unitNumber = i % 10 || 10
    const feature = unitFeatures[Math.floor(Math.random() * unitFeatures.length)]

    units.push({
      id: `unit-${propertyId}-${i}`,
      propertyId,
      unitId: `${blockLetter}-${unitNumber}0${Math.floor(i / 10) + 1}`,
      unit: unitSizes[Math.floor(Math.random() * unitSizes.length)],
      coordinate: `${(6.5 + Math.random() * 0.1).toFixed(4)}, ${(3.3 + Math.random() * 0.1).toFixed(4)}`,
      feature: feature || undefined,
      status,
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    })
  }

  return units.sort((a, b) => a.unitId.localeCompare(b.unitId))
}

// Initialize mock units storage
let mockUnitsData: Unit[] = []

export function initializeMockUnits(properties: { id: string }[]) {
  mockUnitsData = []
  properties.forEach(property => {
    const unitCount = Math.floor(Math.random() * 30) + 10 // 10-40 units per property
    mockUnitsData.push(...generateMockUnits(property.id, unitCount))
  })
}

export function getMockUnitsData() {
  return mockUnitsData
}

export function setMockUnitsData(data: Unit[]) {
  mockUnitsData = data
}
