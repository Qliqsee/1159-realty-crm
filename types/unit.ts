export type UnitStatus = "AVAILABLE" | "SOLD" | "RESERVED" | "ARCHIVED"

export interface Unit {
  id: string
  propertyId: string
  unitId: string // e.g., "A-101", "B-202"
  unit: string // e.g., "500 sqm", "1000 sqm"
  coordinate: string // e.g., "6.5244, 3.3792"
  feature?: string // e.g., "Roadside", "River view", "Gym nearby"
  status: UnitStatus
  createdAt: Date
  updatedAt: Date
}

export interface CreateUnitInput {
  propertyId: string
  unitId: string
  unit: string
  coordinate: string
  feature?: string
  status?: UnitStatus
}

export interface UpdateUnitInput {
  unitId?: string
  unit?: string
  coordinate?: string
  feature?: string
  status?: UnitStatus
}
