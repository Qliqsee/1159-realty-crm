"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, MapPin, Home, TrendingUp, Plus, Building2, Map } from "lucide-react"
import { Button } from "@/components/buttons/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/card"
import { Badge } from "@/components/badges/badge"
import { Separator } from "@/components/display/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/navigation/tabs"
import { PageHeader } from "@/components/layout/page-header"
import { format } from "date-fns"
import { useEffect, useState } from "react"
import { toast } from "sonner"

// Mock data - will be replaced with API call
interface LGAData {
  id: string
  name: string
  stateId: string
  stateName: string
  status: "Active" | "Inactive"
  areas: AreaData[]
  totalProperties: number
  totalAreas: number
}

interface AreaData {
  id: string
  name: string
  lgaId: string
  lgaName: string
  status: "Active" | "Inactive"
  totalProperties: number
}

interface PropertyData {
  id: string
  name: string
  type: string
  status: string
  totalPlots: number
  availablePlots: number
  priceRange: string
}

export default function LocationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const locationId = params.id as string
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - will be replaced with API call
  const state = {
    id: locationId,
    name: "Lagos",
    code: "LA",
    status: "Active" as const,
    totalProperties: 45,
    totalLGAs: 6,
    totalAreas: 18,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-12-15"),
  }

  const lgas: LGAData[] = [
    {
      id: "1",
      name: "Lekki",
      stateId: locationId,
      stateName: "Lagos",
      status: "Active",
      areas: [],
      totalProperties: 15,
      totalAreas: 5,
    },
    {
      id: "2",
      name: "Ikoyi",
      stateId: locationId,
      stateName: "Lagos",
      status: "Active",
      areas: [],
      totalProperties: 8,
      totalAreas: 3,
    },
    {
      id: "3",
      name: "Victoria Island",
      stateId: locationId,
      stateName: "Lagos",
      status: "Active",
      areas: [],
      totalProperties: 12,
      totalAreas: 4,
    },
    {
      id: "4",
      name: "Ajah",
      stateId: locationId,
      stateName: "Lagos",
      status: "Active",
      areas: [],
      totalProperties: 6,
      totalAreas: 3,
    },
    {
      id: "5",
      name: "Ikeja",
      stateId: locationId,
      stateName: "Lagos",
      status: "Active",
      areas: [],
      totalProperties: 3,
      totalAreas: 2,
    },
    {
      id: "6",
      name: "Surulere",
      stateId: locationId,
      stateName: "Lagos",
      status: "Active",
      areas: [],
      totalProperties: 1,
      totalAreas: 1,
    },
  ]

  const areas: AreaData[] = [
    {
      id: "1",
      name: "Lekki Phase 1",
      lgaId: "1",
      lgaName: "Lekki",
      status: "Active",
      totalProperties: 8,
    },
    {
      id: "2",
      name: "Lekki Phase 2",
      lgaId: "1",
      lgaName: "Lekki",
      status: "Active",
      totalProperties: 5,
    },
    {
      id: "3",
      name: "Chevron",
      lgaId: "1",
      lgaName: "Lekki",
      status: "Active",
      totalProperties: 2,
    },
    {
      id: "4",
      name: "Banana Island",
      lgaId: "2",
      lgaName: "Ikoyi",
      status: "Active",
      totalProperties: 5,
    },
    {
      id: "5",
      name: "Old Ikoyi",
      lgaId: "2",
      lgaName: "Ikoyi",
      status: "Active",
      totalProperties: 3,
    },
  ]

  const properties: PropertyData[] = [
    {
      id: "1",
      name: "Lekki Gardens Phase 2",
      type: "Land",
      status: "Active",
      totalPlots: 120,
      availablePlots: 45,
      priceRange: "₦8M - ₦15M",
    },
    {
      id: "2",
      name: "Victoria Island Towers",
      type: "Commercial",
      status: "Active",
      totalPlots: 50,
      availablePlots: 12,
      priceRange: "₦25M - ₦50M",
    },
    {
      id: "3",
      name: "Ikoyi Heights",
      type: "Residential",
      status: "Active",
      totalPlots: 80,
      availablePlots: 28,
      priceRange: "₦15M - ₦30M",
    },
  ]

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 500)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-primary to-yellow-600 animate-pulse mb-4" />
          <p className="text-sm text-muted-foreground">Loading location...</p>
        </div>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    Active: "bg-green-500",
    Inactive: "bg-gray-500",
  }

  const totalAvailablePlots = properties.reduce((sum, p) => sum + p.availablePlots, 0)
  const totalPlots = properties.reduce((sum, p) => sum + p.totalPlots, 0)
  const occupancyRate = totalPlots > 0 ? ((totalPlots - totalAvailablePlots) / totalPlots) * 100 : 0

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${state.name} State`}
        description={`${state.totalProperties} properties across ${state.totalLGAs} LGAs`}
        actions={
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button size="sm" onClick={() => router.push(`/locations/${locationId}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Location Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Location Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">State Name</p>
                    <p className="font-medium text-lg">{state.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Map className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">State Code</p>
                    <p className="font-medium text-lg">{state.code}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total LGAs</p>
                    <p className="font-medium text-lg">{state.totalLGAs}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Home className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Properties</p>
                    <p className="font-medium text-lg">{state.totalProperties}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Status</h4>
                <Badge className={statusColors[state.status]}>{state.status}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Card */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Home className="h-5 w-5 text-primary" />
                    <p className="text-sm text-muted-foreground">Properties</p>
                  </div>
                  <p className="text-2xl font-bold">{state.totalProperties}</p>
                  <p className="text-xs text-muted-foreground mt-1">Active listings</p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <p className="text-sm text-muted-foreground">Occupancy</p>
                  </div>
                  <p className="text-2xl font-bold">{occupancyRate.toFixed(0)}%</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {totalPlots - totalAvailablePlots} / {totalPlots} plots
                  </p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <p className="text-sm text-muted-foreground">Areas</p>
                  </div>
                  <p className="text-2xl font-bold">{state.totalAreas}</p>
                  <p className="text-xs text-muted-foreground mt-1">Across {state.totalLGAs} LGAs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Section */}
          <Tabs defaultValue="lgas">
            <TabsList>
              <TabsTrigger value="lgas">LGAs ({lgas.length})</TabsTrigger>
              <TabsTrigger value="areas">Areas ({areas.length})</TabsTrigger>
              <TabsTrigger value="properties">Properties ({properties.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="lgas">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Local Government Areas</CardTitle>
                    <Button size="sm" onClick={() => toast.success("Opening LGA form...")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add LGA
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lgas.map((lga) => (
                      <div key={lga.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3 flex-1">
                          <MapPin className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="font-medium">{lga.name}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span>{lga.totalProperties} properties</span>
                              <span>•</span>
                              <span>{lga.totalAreas} areas</span>
                            </div>
                          </div>
                        </div>
                        <Badge className={statusColors[lga.status]}>{lga.status}</Badge>
                      </div>
                    ))}
                    {lgas.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No LGAs added yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="areas">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Areas</CardTitle>
                    <Button size="sm" onClick={() => toast.success("Opening area form...")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Area
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {areas.map((area) => (
                      <div key={area.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3 flex-1">
                          <Map className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="font-medium">{area.name}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span>LGA: {area.lgaName}</span>
                              <span>•</span>
                              <span>{area.totalProperties} properties</span>
                            </div>
                          </div>
                        </div>
                        <Badge className={statusColors[area.status]}>{area.status}</Badge>
                      </div>
                    ))}
                    {areas.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No areas added yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="properties">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Properties in {state.name}</CardTitle>
                    <Button size="sm" onClick={() => router.push("/properties/new")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Property
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {properties.map((property) => (
                      <div key={property.id} className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => router.push(`/properties/${property.id}`)}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Home className="h-5 w-5 text-primary" />
                            <h4 className="font-medium">{property.name}</h4>
                          </div>
                          <Badge variant="outline">{property.type}</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm mt-3">
                          <div>
                            <p className="text-muted-foreground text-xs">Total Plots</p>
                            <p className="font-medium">{property.totalPlots}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Available</p>
                            <p className="font-medium">{property.availablePlots}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Price Range</p>
                            <p className="font-medium text-xs">{property.priceRange}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {properties.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No properties in this location yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge className={statusColors[state.status]}>{state.status}</Badge>
            </CardContent>
          </Card>

          {/* Quick Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total LGAs</span>
                <span className="font-bold">{state.totalLGAs}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Areas</span>
                <span className="font-bold">{state.totalAreas}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Properties</span>
                <span className="font-bold">{state.totalProperties}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Occupancy</span>
                <span className="font-bold">{occupancyRate.toFixed(0)}%</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" onClick={() => toast.success("Opening LGA manager...")}>
                <Plus className="h-4 w-4 mr-2" />
                Add LGA
              </Button>
              <Button className="w-full" variant="outline" onClick={() => toast.success("Opening area manager...")}>
                <Plus className="h-4 w-4 mr-2" />
                Add Area
              </Button>
              <Button className="w-full" variant="outline" onClick={() => router.push("/properties/new")}>
                <Home className="h-4 w-4 mr-2" />
                Add Property
              </Button>
              <Button className="w-full" variant="outline" onClick={() => router.push(`/locations/${locationId}/edit`)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Location
              </Button>
            </CardContent>
          </Card>

          {/* Meta Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">State Code</p>
                <p className="font-medium font-mono">{state.code}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">Created</p>
                <p className="font-medium">{format(state.createdAt, "PPP")}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p className="font-medium">{format(state.updatedAt, "PPP")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
