export type PlotStatus = "AVAILABLE" | "SOLD" | "RESERVED" | "ARCHIVED"

export interface Plot {
  id: string
  propertyId: string
  plotId: string // e.g., "A-101", "B-202"
  unit: string // e.g., "500 sqm", "1000 sqm"
  coordinate: string // e.g., "6.5244, 3.3792"
  feature?: string // e.g., "Roadside", "River view", "Gym nearby"
  status: PlotStatus
  createdAt: Date
  updatedAt: Date
}

export interface CreatePlotInput {
  propertyId: string
  plotId: string
  unit: string
  coordinate: string
  feature?: string
  status?: PlotStatus
}

export interface UpdatePlotInput {
  plotId?: string
  unit?: string
  coordinate?: string
  feature?: string
  status?: PlotStatus
}
