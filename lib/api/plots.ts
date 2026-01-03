import type { Plot, CreatePlotInput, UpdatePlotInput } from "@/types"
import { getMockPlotsData, setMockPlotsData } from "@/lib/data/plots"

// Simulated delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getPlots(propertyId?: string): Promise<Plot[]> {
  await delay(300)
  const plots = getMockPlotsData()
  if (propertyId) {
    return plots.filter(plot => plot.propertyId === propertyId)
  }
  return plots
}

export async function getPlot(id: string): Promise<Plot> {
  await delay(200)
  const plot = getMockPlotsData().find((p) => p.id === id)
  if (!plot) {
    throw new Error("Plot not found")
  }
  return plot
}

export async function createPlot(data: CreatePlotInput): Promise<Plot> {
  await delay(500)
  const plots = getMockPlotsData()

  const newPlot: Plot = {
    id: `plot-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    ...data,
    status: data.status || "AVAILABLE",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  setMockPlotsData([...plots, newPlot])
  return newPlot
}

export async function updatePlot(id: string, data: UpdatePlotInput): Promise<Plot> {
  await delay(500)
  const plots = getMockPlotsData()
  const index = plots.findIndex((p) => p.id === id)

  if (index === -1) {
    throw new Error("Plot not found")
  }

  const updatedPlot: Plot = {
    ...plots[index],
    ...data,
    updatedAt: new Date(),
  }

  const newPlots = [...plots]
  newPlots[index] = updatedPlot
  setMockPlotsData(newPlots)

  return updatedPlot
}

export async function deletePlot(id: string): Promise<void> {
  await delay(300)
  const plots = getMockPlotsData()
  setMockPlotsData(plots.filter((p) => p.id !== id))
}

export async function bulkCreatePlots(plots: CreatePlotInput[]): Promise<Plot[]> {
  await delay(800)
  const existingPlots = getMockPlotsData()

  const newPlots: Plot[] = plots.map((data, index) => ({
    id: `plot-${Date.now()}-${index}-${Math.random().toString(36).substring(7)}`,
    ...data,
    status: data.status || "AVAILABLE",
    createdAt: new Date(),
    updatedAt: new Date(),
  }))

  setMockPlotsData([...existingPlots, ...newPlots])
  return newPlots
}
