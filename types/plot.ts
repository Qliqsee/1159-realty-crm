export type PlotStatus = "AVAILABLE" | "SOLD" | "ARCHIVED"

export interface Plot {
  id: string
  propertyId: string
  size: string // e.g., "500 sqm", "1000 sqm"
  coordinate: string // e.g., "6.5244, 3.3792" or "Plot A1-Block B"
  byRoadSide: boolean
  status: PlotStatus
  createdAt: Date
  updatedAt: Date
}

export interface CreatePlotInput {
  propertyId: string
  size: string
  coordinate: string
  byRoadSide: boolean
  status?: PlotStatus
}

export interface UpdatePlotInput {
  size?: string
  coordinate?: string
  byRoadSide?: boolean
  status?: PlotStatus
}
