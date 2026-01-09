import type { Unit, CreateUnitInput, UpdateUnitInput } from "@/types"
import { getMockUnitsData, setMockUnitsData } from "@/lib/data/units"

// Simulated delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getUnits(propertyId?: string): Promise<Unit[]> {
  await delay(300)
  const units = getMockUnitsData()
  if (propertyId) {
    return units.filter(unit => unit.propertyId === propertyId)
  }
  return units
}

export async function getUnit(id: string): Promise<Unit> {
  await delay(200)
  const unit = getMockUnitsData().find((u) => u.id === id)
  if (!unit) {
    throw new Error("Unit not found")
  }
  return unit
}

export async function createUnit(data: CreateUnitInput): Promise<Unit> {
  await delay(500)
  const units = getMockUnitsData()

  const newUnit: Unit = {
    id: `unit-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    ...data,
    status: data.status || "AVAILABLE",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  setMockUnitsData([...units, newUnit])
  return newUnit
}

export async function updateUnit(id: string, data: UpdateUnitInput): Promise<Unit> {
  await delay(500)
  const units = getMockUnitsData()
  const index = units.findIndex((u) => u.id === id)

  if (index === -1) {
    throw new Error("Unit not found")
  }

  const updatedUnit: Unit = {
    ...units[index],
    ...data,
    updatedAt: new Date(),
  }

  const newUnits = [...units]
  newUnits[index] = updatedUnit
  setMockUnitsData(newUnits)

  return updatedUnit
}

export async function deleteUnit(id: string): Promise<void> {
  await delay(300)
  const units = getMockUnitsData()
  setMockUnitsData(units.filter((u) => u.id !== id))
}

export async function bulkCreateUnits(units: CreateUnitInput[]): Promise<Unit[]> {
  await delay(800)
  const existingUnits = getMockUnitsData()

  const newUnits: Unit[] = units.map((data, index) => ({
    id: `unit-${Date.now()}-${index}-${Math.random().toString(36).substring(7)}`,
    ...data,
    status: data.status || "AVAILABLE",
    createdAt: new Date(),
    updatedAt: new Date(),
  }))

  setMockUnitsData([...existingUnits, ...newUnits])
  return newUnits
}
