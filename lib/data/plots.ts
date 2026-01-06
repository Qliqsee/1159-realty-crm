import type { Plot, PlotStatus } from "@/types"

const plotUnits = ["500 sqm", "600 sqm", "700 sqm", "800 sqm", "1000 sqm", "1200 sqm", "1500 sqm"]
const plotStatuses: PlotStatus[] = ["AVAILABLE", "SOLD", "RESERVED", "ARCHIVED"]
const plotFeatures = ["Roadside", "Corner plot", "River view", "Park view", "Gym nearby", "School nearby", ""]

export function generateMockPlots(propertyId: string, count: number = 20): Plot[] {
  const plots: Plot[] = []

  for (let i = 1; i <= count; i++) {
    const status = plotStatuses[Math.floor(Math.random() * plotStatuses.length)]
    const blockLetter = String.fromCharCode(65 + Math.floor((i - 1) / 10))
    const plotNumber = i % 10 || 10
    const feature = plotFeatures[Math.floor(Math.random() * plotFeatures.length)]

    plots.push({
      id: `plot-${propertyId}-${i}`,
      propertyId,
      plotId: `${blockLetter}-${plotNumber}0${Math.floor(i / 10) + 1}`,
      unit: plotUnits[Math.floor(Math.random() * plotUnits.length)],
      coordinate: `${(6.5 + Math.random() * 0.1).toFixed(4)}, ${(3.3 + Math.random() * 0.1).toFixed(4)}`,
      feature: feature || undefined,
      status,
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    })
  }

  return plots.sort((a, b) => a.plotId.localeCompare(b.plotId))
}

// Initialize mock plots storage
let mockPlotsData: Plot[] = []

export function initializeMockPlots(properties: { id: string }[]) {
  mockPlotsData = []
  properties.forEach(property => {
    const plotCount = Math.floor(Math.random() * 30) + 10 // 10-40 plots per property
    mockPlotsData.push(...generateMockPlots(property.id, plotCount))
  })
}

export function getMockPlotsData() {
  return mockPlotsData
}

export function setMockPlotsData(data: Plot[]) {
  mockPlotsData = data
}
