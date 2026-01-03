"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, MapPin, Home, DollarSign, TrendingUp, Users, Eye, Plus, MoreHorizontal, Trash2, Upload, ChevronDown } from "lucide-react"
import { Button } from "@/components/buttons/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/card"
import { Badge } from "@/components/badges/badge"
import { Separator } from "@/components/display/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/navigation/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/dialogs/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/dialogs/alert-dialog"
import { PageHeader } from "@/components/layout/page-header"
import { MetricCard } from "@/components/cards/metric-card"
import { DataTable } from "@/components/data/data-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/overlays/dropdown-menu"
import { PropertyForm } from "@/components/forms/entities/property-form"
import { PlotForm } from "@/components/forms/entities/plot-form"
import { CSVImportTable } from "@/components/data/csv-import-table"
import { getProperty, updateProperty } from "@/lib/api/properties"
import { getPlots, updatePlot, deletePlot, createPlot, bulkCreatePlots } from "@/lib/api/plots"
import * as z from "zod"
import { format } from "date-fns"
import { useEffect, useState } from "react"
import type { Property, Plot } from "@/types"
import type { ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import { StatusBadge } from "@/components/badges/status-badge"
import { DataTableColumnHeader } from "@/components/data/data-table-column-header"

// Plot CSV schema for validation
const plotCSVSchema = z.object({
  coordinate: z.string().min(1, "Plot ID/Coordinate is required"),
  size: z.string().min(1, "Size is required"),
  byRoadSide: z.string().transform(val => {
    const lower = val.toLowerCase().trim()
    return lower === "yes" || lower === "true" || lower === "1"
  }),
  status: z.enum(["AVAILABLE", "SOLD", "ARCHIVED"], {
    errorMap: () => ({ message: "Status must be AVAILABLE, SOLD, or ARCHIVED" })
  }).default("AVAILABLE"),
})

// Plot columns definition will be created inside the component to access handlers
const createPlotColumns = (
  onEdit: (plot: Plot) => void,
  onDelete: (plot: Plot) => void
): ColumnDef<Plot>[] => [
  {
    accessorKey: "coordinate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Plot ID" />,
    cell: ({ row }) => <span className="font-medium">{row.getValue("coordinate")}</span>,
  },
  {
    accessorKey: "size",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Size" />,
  },
  {
    accessorKey: "byRoadSide",
    header: ({ column }) => <DataTableColumnHeader column={column} title="By Road Side" />,
    cell: ({ row }) => (
      <Badge variant={row.getValue("byRoadSide") ? "default" : "secondary"}>
        {row.getValue("byRoadSide") ? "Yes" : "No"}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const plot = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(plot)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Plot
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(plot)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Plot
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const propertyId = params.id as string
  const [property, setProperty] = useState<Property | null>(null)
  const [plots, setPlots] = useState<Plot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingPlots, setIsLoadingPlots] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Plot dialogs state
  const [showAddPlotDialog, setShowAddPlotDialog] = useState(false)
  const [showEditPlotDialog, setShowEditPlotDialog] = useState(false)
  const [showDeletePlotDialog, setShowDeletePlotDialog] = useState(false)
  const [showImportCSVDialog, setShowImportCSVDialog] = useState(false)
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null)
  const [isSavingPlot, setIsSavingPlot] = useState(false)
  const [csvData, setCSVData] = useState<string[][]>([])
  const [isImporting, setIsImporting] = useState(false)

  useEffect(() => {
    loadProperty()
    loadPlots()
  }, [propertyId])

  const loadProperty = async () => {
    try {
      setIsLoading(true)
      const data = await getProperty(propertyId)
      if (data) {
        setProperty(data)
      } else {
        toast.error("Property not found")
        router.push("/properties")
      }
    } catch (error) {
      toast.error("Failed to load property")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadPlots = async () => {
    try {
      setIsLoadingPlots(true)
      const data = await getPlots(propertyId)
      setPlots(data)
    } catch (error) {
      console.error("Failed to load plots:", error)
    } finally {
      setIsLoadingPlots(false)
    }
  }

  const handleEditProperty = async (data: any) => {
    if (!property) return

    try {
      setIsSaving(true)
      // Calculate finalPrice from regular price and discount
      const finalPrice = data.regularPrice - (data.regularPrice * data.discountPercentage / 100)

      await updateProperty(property.id, {
        ...data,
        finalPrice,
        // Map stateId/lgaId/areaId to actual names (in real app, you'd look these up)
        state: data.stateId === "state-1" ? "Lagos" : "Abuja",
        lga: data.lgaId === "lga-1" ? "Ikeja" : "Lekki",
        area: data.areaId === "area-1" ? "Phase 1" : "Phase 2",
        availablePlots: property.availablePlots,
        allocatedPlots: property.allocatedPlots,
      })

      toast.success("Property updated successfully")
      setShowEditDialog(false)
      loadProperty()
    } catch (error) {
      toast.error("Failed to update property")
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  // Plot handlers
  const handleAddPlot = async (data: any) => {
    try {
      setIsSavingPlot(true)
      await createPlot({
        propertyId,
        coordinate: data.coordinate,
        size: data.size,
        byRoadSide: data.byRoadSide,
        status: data.status,
      })
      toast.success("Plot added successfully")
      setShowAddPlotDialog(false)
      loadPlots()
    } catch (error) {
      toast.error("Failed to add plot")
      console.error(error)
    } finally {
      setIsSavingPlot(false)
    }
  }

  const handleEditPlot = async (data: any) => {
    if (!selectedPlot) return

    try {
      setIsSavingPlot(true)
      await updatePlot(selectedPlot.id, {
        coordinate: data.coordinate,
        size: data.size,
        byRoadSide: data.byRoadSide,
        status: data.status,
      })
      toast.success("Plot updated successfully")
      setShowEditPlotDialog(false)
      setSelectedPlot(null)
      loadPlots()
    } catch (error) {
      toast.error("Failed to update plot")
      console.error(error)
    } finally {
      setIsSavingPlot(false)
    }
  }

  const handleDeletePlot = async () => {
    if (!selectedPlot) return

    try {
      await deletePlot(selectedPlot.id)
      toast.success("Plot deleted successfully")
      setShowDeletePlotDialog(false)
      setSelectedPlot(null)
      loadPlots()
    } catch (error) {
      toast.error("Failed to delete plot")
      console.error(error)
    }
  }

  const openEditPlotDialog = (plot: Plot) => {
    setSelectedPlot(plot)
    setShowEditPlotDialog(true)
  }

  const openDeletePlotDialog = (plot: Plot) => {
    setSelectedPlot(plot)
    setShowDeletePlotDialog(true)
  }

  const handleCSVFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const rows = text.split("\n").map(row => row.split(",").map(cell => cell.trim()))
      setCSVData(rows)
      setShowImportCSVDialog(true)
    } catch (error) {
      toast.error("Failed to read CSV file")
      console.error(error)
    } finally {
      // Reset file input
      event.target.value = ""
    }
  }

  const handleBulkImportPlots = async (validatedData: z.infer<typeof plotCSVSchema>[]) => {
    try {
      setIsImporting(true)
      await bulkCreatePlots(validatedData.map(data => ({
        propertyId,
        coordinate: data.coordinate,
        size: data.size,
        byRoadSide: data.byRoadSide,
        status: data.status,
      })))
      toast.success(`Successfully imported ${validatedData.length} plots`)
      setShowImportCSVDialog(false)
      setCSVData([])
      loadPlots()
    } catch (error) {
      toast.error("Failed to import plots")
      console.error(error)
    } finally {
      setIsImporting(false)
    }
  }

  // Create plot columns with handlers
  const plotColumns = createPlotColumns(openEditPlotDialog, openDeletePlotDialog)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-primary to-yellow-600 animate-pulse mb-4" />
          <p className="text-sm text-muted-foreground">Loading property...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return null
  }

  const statusColors: Record<string, string> = {
    Available: "bg-green-500",
    "Sold Out": "bg-red-500",
    Reserved: "bg-yellow-500",
    Disabled: "bg-gray-500",
  }

  const plotsAvailablePercentage = property.totalPlots > 0
    ? (property.availablePlots / property.totalPlots) * 100
    : 0

  return (
    <div className="space-y-6">
      <PageHeader
        title={property.name}
        description={`${property.type} · ${property.subtype} · ${property.area}, ${property.lga}`}
        actions={
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button size="sm" onClick={() => setShowEditDialog(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        }
      />

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Views"
          value={property.views.toLocaleString()}
          icon={Eye}
          variant="primary"
        />
        <MetricCard
          title="Interests"
          value={property.interests.toLocaleString()}
          icon={Users}
          variant="success"
        />
        <MetricCard
          title="Enrollments"
          value={property.enrollments.toLocaleString()}
          icon={TrendingUp}
          variant="warning"
        />
        <MetricCard
          title="Sold"
          value={property.sold.toLocaleString()}
          icon={DollarSign}
          variant="danger"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Property Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Property Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Home className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Property Type</p>
                    <p className="font-medium">{property.type} - {property.subtype}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{property.area}, {property.lga}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">State</p>
                    <p className="font-medium">{property.state}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Views</p>
                    <p className="font-medium">{property.views.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {property.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Discount</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Regular Price</p>
                  <p className="text-xl font-bold">₦{property.regularPrice.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Discount</p>
                  <p className="text-xl font-bold text-orange-600">
                    {property.discountPercentage || 0}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Final Price</p>
                  <p className="text-xl font-bold text-green-600">₦{property.finalPrice.toLocaleString()}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Interest Rate</p>
                  <p className="text-lg font-semibold">{property.interestRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Penalty Rate</p>
                  <p className="text-lg font-semibold">{property.overduepenaltyRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Market Price</p>
                  <p className="text-lg font-semibold">
                    {property.marketPrice ? `₦${property.marketPrice.toLocaleString()}` : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Section */}
          <Tabs defaultValue="sizes">
            <TabsList>
              <TabsTrigger value="sizes">Available Sizes</TabsTrigger>
              <TabsTrigger value="landmarks">Nearby Landmarks</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>

            <TabsContent value="sizes">
              <Card>
                <CardHeader>
                  <CardTitle>Available Plot Sizes</CardTitle>
                </CardHeader>
                <CardContent>
                  {property.availableSizes.length > 0 ? (
                    <div className="space-y-3">
                      {property.availableSizes.map((size) => (
                        <div
                          key={size.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <div>
                            <p className="font-medium">
                              {size.size} {size.unit}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {size.isAvailable ? "Available" : "Not Available"}
                            </p>
                          </div>
                          <p className="text-lg font-bold text-primary">
                            ₦{size.price.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No size information available</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="landmarks">
              <Card>
                <CardHeader>
                  <CardTitle>Nearby Landmarks</CardTitle>
                </CardHeader>
                <CardContent>
                  {property.nearbyLandmarks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {property.nearbyLandmarks.map((landmark, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-3 rounded-lg bg-muted/50"
                        >
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">{landmark}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No landmarks information available</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats">
              <Card>
                <CardHeader>
                  <CardTitle>Property Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <Eye className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        {property.views}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">Views</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                      <Users className="h-6 w-6 mx-auto mb-2 text-green-600" />
                      <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                        {property.interests}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">Interests</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                      <TrendingUp className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
                      <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                        {property.enrollments}
                      </p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400">Enrollments</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                      <DollarSign className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                        {property.sold}
                      </p>
                      <p className="text-xs text-purple-600 dark:text-purple-400">Sold</p>
                    </div>
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
            <CardContent>
              <Badge className={statusColors[property.status]}>
                {property.status}
              </Badge>
            </CardContent>
          </Card>

          {/* Plot Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Plot Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Available</span>
                  <span className="font-medium">{plotsAvailablePercentage.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${plotsAvailablePercentage}%` }}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-2xl font-bold">{property.totalPlots}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{property.availablePlots}</p>
                  <p className="text-xs text-muted-foreground">Available</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">{property.allocatedPlots}</p>
                  <p className="text-xs text-muted-foreground">Allocated</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline" onClick={() => setShowEditDialog(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Property
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
                <p className="text-muted-foreground">Created</p>
                <p className="font-medium">{format(property.createdAt, "PPP")}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p className="font-medium">{format(property.updatedAt, "PPP")}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">Created By</p>
                <p className="font-medium">{property.createdBy}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Plots List Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Property Plots</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage individual plots for this property
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Plots
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Add Plots</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setShowAddPlotDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add One by One
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <label htmlFor="csv-upload-plots" className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Import from CSV
                    <input
                      id="csv-upload-plots"
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleCSVFileUpload}
                    />
                  </label>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          {plots.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No plots yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add plots to this property to start tracking inventory
              </p>
              <Button onClick={() => setShowAddPlotDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Plot
              </Button>
            </div>
          ) : (
            <DataTable
              columns={plotColumns}
              data={plots}
              searchKey="coordinate"
              searchPlaceholder="Search plots by ID or location..."
            />
          )}
        </CardContent>
      </Card>

      {/* Edit Property Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Property</DialogTitle>
          </DialogHeader>
          <PropertyForm
            initialData={property}
            onSubmit={handleEditProperty}
            onCancel={() => setShowEditDialog(false)}
            isLoading={isSaving}
          />
        </DialogContent>
      </Dialog>

      {/* Add Plot Dialog */}
      <Dialog open={showAddPlotDialog} onOpenChange={setShowAddPlotDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Plot</DialogTitle>
            <DialogDescription>
              Add a new plot to this property
            </DialogDescription>
          </DialogHeader>
          <PlotForm
            onSubmit={handleAddPlot}
            onCancel={() => setShowAddPlotDialog(false)}
            isLoading={isSavingPlot}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Plot Dialog */}
      <Dialog open={showEditPlotDialog} onOpenChange={setShowEditPlotDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Plot</DialogTitle>
            <DialogDescription>
              Update plot information
            </DialogDescription>
          </DialogHeader>
          <PlotForm
            initialData={selectedPlot || undefined}
            onSubmit={handleEditPlot}
            onCancel={() => {
              setShowEditPlotDialog(false)
              setSelectedPlot(null)
            }}
            isLoading={isSavingPlot}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Plot Dialog */}
      <AlertDialog open={showDeletePlotDialog} onOpenChange={setShowDeletePlotDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Plot</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete plot <strong>{selectedPlot?.coordinate}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedPlot(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePlot} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import Plots from CSV Dialog */}
      <Dialog open={showImportCSVDialog} onOpenChange={setShowImportCSVDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import Plots from CSV</DialogTitle>
            <DialogDescription>
              Map CSV columns to plot fields and review data before importing
            </DialogDescription>
          </DialogHeader>
          {csvData.length > 0 && (
            <CSVImportTable
              csvData={csvData}
              schema={plotCSVSchema}
              fieldMappings={[
                { targetField: "coordinate", label: "Plot ID / Coordinate", required: true },
                { targetField: "size", label: "Size", required: true },
                { targetField: "byRoadSide", label: "By Road Side", required: true },
                { targetField: "status", label: "Status" },
              ]}
              onSubmit={handleBulkImportPlots}
              onCancel={() => {
                setShowImportCSVDialog(false)
                setCSVData([])
              }}
              isLoading={isImporting}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
