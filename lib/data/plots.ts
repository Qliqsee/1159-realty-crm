import type { Plot, PlotStatus } from "@/types"

const plotSizes = ["500 sqm", "600 sqm", "700 sqm", "800 sqm", "1000 sqm", "1200 sqm", "1500 sqm"]
const plotStatuses: PlotStatus[] = ["AVAILABLE", "SOLD", "ARCHIVED"]

export function generateMockPlots(propertyId: string, count: number = 20): Plot[] {
  const plots: Plot[] = []

  for (let i = 1; i <= count; i++) {
    const status = plotStatuses[Math.floor(Math.random() * plotStatuses.length)]

    plots.push({
      id: `plot-${propertyId}-${i}`,
      propertyId,
      size: plotSizes[Math.floor(Math.random() * plotSizes.length)],
      coordinate: `Plot ${String.fromCharCode(65 + Math.floor((i - 1) / 10))}${i % 10 || 10}-Block ${Math.floor(Math.random() * 5) + 1}`,
      byRoadSide: Math.random() > 0.7, // 30% chance of being by road side
      status,
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    })
  }

  return plots.sort((a, b) => a.coordinate.localeCompare(b.coordinate))
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
