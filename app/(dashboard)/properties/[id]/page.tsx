"use client"

import { useParams, useRouter } from "next/navigation"
import { useRef } from "react"
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
import { UnitForm } from "@/components/forms/entities/unit-form"
import { CSVImportTable } from "@/components/data/csv-import-table"
import { getProperty, updateProperty } from "@/lib/api/properties"
import { getUnits, updateUnit, deleteUnit, createUnit, bulkCreateUnits } from "@/lib/api/units"
import * as z from "zod"
import { format } from "date-fns"
import { useEffect, useState } from "react"
import type { Property, Unit } from "@/types"
import type { ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import { StatusBadge } from "@/components/badges/status-badge"
import { DataTableColumnHeader } from "@/components/data/data-table-column-header"

// Unit CSV schema for validation
const unitCSVSchema = z.object({
  unitId: z.string().min(1, "Unit ID is required"),
  unit: z.string().min(1, "Unit is required"),
  coordinate: z.string().min(1, "Coordinate is required"),
  feature: z.string().optional(),
  status: z.enum(["AVAILABLE", "SOLD", "RESERVED", "ARCHIVED"]).default("AVAILABLE"),
})

// Unit columns definition will be created inside the component to access handlers
const createUnitColumns = (
  onEdit: (unit: Unit) => void,
  onDelete: (unit: Unit) => void
): ColumnDef<Unit>[] => [
  {
    accessorKey: "unitId",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Unit ID" />,
    cell: ({ row }) => <span className="font-medium">{row.getValue("unitId")}</span>,
  },
  {
    accessorKey: "unit",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Unit" />,
  },
  {
    accessorKey: "coordinate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Coordinate" />,
  },
  {
    accessorKey: "feature",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Feature" />,
    cell: ({ row }) => row.getValue("feature") || "-",
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const unit = row.original
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
            <DropdownMenuItem onClick={() => onEdit(unit)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Unit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(unit)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Unit
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
  const [units, setUnits] = useState<Unit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingUnits, setIsLoadingUnits] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Unit dialogs state
  const [showAddUnitDialog, setShowAddUnitDialog] = useState(false)
  const [showEditUnitDialog, setShowEditUnitDialog] = useState(false)
  const [showDeleteUnitDialog, setShowDeleteUnitDialog] = useState(false)
  const [showImportCSVDialog, setShowImportCSVDialog] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)
  const [isSavingUnit, setIsSavingUnit] = useState(false)
  const [csvData, setCSVData] = useState<string[][]>([])
  const [isImporting, setIsImporting] = useState(false)
  const csvFileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadProperty()
    loadUnits()
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

  const loadUnits = async () => {
    try {
      setIsLoadingUnits(true)
      const data = await getUnits(propertyId)
      setUnits(data)
    } catch (error) {
      console.error("Failed to load units:", error)
    } finally {
      setIsLoadingUnits(false)
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

  // Unit handlers
  const handleAddUnit = async (data: any) => {
    try {
      setIsSavingUnit(true)
      await createUnit({
        propertyId,
        unitId: data.unitId,
        unit: data.unit,
        coordinate: data.coordinate,
        feature: data.feature,
        status: data.status,
      })
      toast.success("Unit added successfully")
      setShowAddUnitDialog(false)
      loadUnits()
    } catch (error) {
      toast.error("Failed to add unit")
      console.error(error)
    } finally {
      setIsSavingUnit(false)
    }
  }

  const handleEditUnit = async (data: any) => {
    if (!selectedUnit) return

    try {
      setIsSavingUnit(true)
      await updateUnit(selectedUnit.id, {
        unitId: data.unitId,
        unit: data.unit,
        coordinate: data.coordinate,
        feature: data.feature,
        status: data.status,
      })
      toast.success("Unit updated successfully")
      setShowEditUnitDialog(false)
      setSelectedUnit(null)
      loadUnits()
    } catch (error) {
      toast.error("Failed to update unit")
      console.error(error)
    } finally {
      setIsSavingUnit(false)
    }
  }

  const handleDeleteUnit = async () => {
    if (!selectedUnit) return

    try {
      await deleteUnit(selectedUnit.id)
      toast.success("Unit deleted successfully")
      setShowDeleteUnitDialog(false)
      setSelectedUnit(null)
      loadUnits()
    } catch (error) {
      toast.error("Failed to delete unit")
      console.error(error)
    }
  }

  const openEditUnitDialog = (unit: Unit) => {
    setSelectedUnit(unit)
    setShowEditUnitDialog(true)
  }

  const openDeleteUnitDialog = (unit: Unit) => {
    setSelectedUnit(unit)
    setShowDeleteUnitDialog(true)
  }

  const handleCSVFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      toast.error("Please select a CSV file")
      event.target.value = ""
      return
    }

    try {
      const text = await file.text()

      if (!text || text.trim().length === 0) {
        toast.error("CSV file is empty")
        event.target.value = ""
        return
      }

      const rows = text.split("\n").map(row => row.split(",").map(cell => cell.trim()))

      if (rows.length < 2) {
        toast.error("CSV file must have at least a header row and one data row")
        event.target.value = ""
        return
      }

      setCSVData(rows)
      setShowImportCSVDialog(true)
    } catch (error) {
      toast.error("Failed to read CSV file. Make sure it's a valid CSV.")
      console.error("CSV parse error:", error)
    } finally {
      // Reset file input
      event.target.value = ""
    }
  }

  const handleBulkImportUnits = async (validatedData: z.infer<typeof unitCSVSchema>[]) => {
    try {
      setIsImporting(true)
      await bulkCreateUnits(validatedData.map(data => ({
        propertyId,
        unitId: data.unitId,
        unit: data.unit,
        coordinate: data.coordinate,
        feature: data.feature,
        status: data.status,
      })))
      toast.success(`Successfully imported ${validatedData.length} units`)
      setShowImportCSVDialog(false)
      setCSVData([])
      loadUnits()
    } catch (error) {
      toast.error("Failed to import units")
      console.error(error)
    } finally {
      setIsImporting(false)
    }
  }

  // Create unit columns with handlers
  const unitColumns = createUnitColumns(openEditUnitDialog, openDeleteUnitDialog)

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

  const plotsAvailablePercentage = 0

  return (
    <div className="space-y-6">
      <PageHeader
        title={property.name}
        description={`${property.type} · ${property.subtype} · ${property.address}`}
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
          value={(property.views || 0).toLocaleString()}
          icon={Eye}
          variant="primary"
        />
        <MetricCard
          title="Interests"
          value={(property.interests || 0).toLocaleString()}
          icon={Users}
          variant="success"
        />
        <MetricCard
          title="Enrollments"
          value={(property.enrollments || 0).toLocaleString()}
          icon={TrendingUp}
          variant="warning"
        />
        <MetricCard
          title="Sold"
          value={(property.sold || 0).toLocaleString()}
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
                    <p className="font-medium">{property.address}</p>
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
                    <p className="font-medium">{(property.views || 0).toLocaleString()}</p>
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
                  <p className="text-sm text-muted-foreground">Unit Pricing</p>
                  <p className="text-xl font-bold">{property.unitPricing?.length || 0} plans</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Discount</p>
                  <p className="text-xl font-bold text-orange-600">
                    {property.salesDiscount?.percentage || 0}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Cycle</p>
                  <p className="text-xl font-bold text-green-600">{property.paymentCycle} days</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Overdue Interest</p>
                  <p className="text-lg font-semibold">{property.overdueInterestRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Cycle</p>
                  <p className="text-lg font-semibold">{property.paymentCycle} days</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Plans</p>
                  <p className="text-lg font-semibold">
                    {property.paymentPlans?.length || 0} plans
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
                  <CardTitle>Unit Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  {property.unitPricing && property.unitPricing.length > 0 ? (
                    <div className="space-y-3">
                      {property.unitPricing.map((pricing, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <div>
                            <p className="font-medium">
                              {pricing.unit}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Prelaunch: ₦{pricing.prelaunchPrice.toLocaleString()}
                            </p>
                          </div>
                          <p className="text-lg font-bold text-primary">
                            ₦{pricing.regularPrice.toLocaleString()}
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
                  <CardTitle>Nearby Landmark</CardTitle>
                </CardHeader>
                <CardContent>
                  {property.nearbyLandmark ? (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{property.nearbyLandmark}</span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No landmark information available</p>
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

          {/* Unit Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Unit Information</CardTitle>
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
                  <p className="text-2xl font-bold">{property.views || 0}</p>
                  <p className="text-xs text-muted-foreground">Views</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{property.interests || 0}</p>
                  <p className="text-xs text-muted-foreground">Interests</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">{property.enrollments || 0}</p>
                  <p className="text-xs text-muted-foreground">Enrollments</p>
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

      {/* Units List Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Property Units</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage individual units for this property
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Units
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Add Units</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setShowAddUnitDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add One by One
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => csvFileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import from CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Hidden file input */}
            <input
              ref={csvFileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleCSVFileUpload}
            />
          </div>
        </CardHeader>
        <CardContent>
          {units.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No units yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add units to this property to start tracking inventory
              </p>
              <Button onClick={() => setShowAddUnitDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Unit
              </Button>
            </div>
          ) : (
            <DataTable
              columns={unitColumns}
              data={units}
              searchKey="unitId"
              searchPlaceholder="Search units by Unit ID..."
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

      {/* Add Unit Dialog */}
      <Dialog open={showAddUnitDialog} onOpenChange={setShowAddUnitDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Unit</DialogTitle>
            <DialogDescription>
              Add a new unit to this property
            </DialogDescription>
          </DialogHeader>
          <UnitForm
            onSubmit={handleAddUnit}
            onCancel={() => setShowAddUnitDialog(false)}
            isLoading={isSavingUnit}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Unit Dialog */}
      <Dialog open={showEditUnitDialog} onOpenChange={setShowEditUnitDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Unit</DialogTitle>
            <DialogDescription>
              Update unit information
            </DialogDescription>
          </DialogHeader>
          <UnitForm
            initialData={selectedUnit || undefined}
            onSubmit={handleEditUnit}
            onCancel={() => {
              setShowEditUnitDialog(false)
              setSelectedUnit(null)
            }}
            isLoading={isSavingUnit}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Unit Dialog */}
      <AlertDialog open={showDeleteUnitDialog} onOpenChange={setShowDeleteUnitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Unit</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete unit <strong>{selectedUnit?.unitId}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedUnit(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUnit} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import Units from CSV Dialog */}
      <Dialog open={showImportCSVDialog} onOpenChange={setShowImportCSVDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import Units from CSV</DialogTitle>
            <DialogDescription>
              Map CSV columns to unit fields and review data before importing
            </DialogDescription>
          </DialogHeader>
          {csvData.length > 0 ? (
            <CSVImportTable
              csvData={csvData}
              schema={unitCSVSchema}
              fieldMappings={[
                { targetField: "unitId", label: "Unit ID", required: true },
                { targetField: "unit", label: "Unit", required: true },
                { targetField: "coordinate", label: "Coordinate", required: true },
                { targetField: "feature", label: "Feature" },
                { targetField: "status", label: "Status" },
              ]}
              onSubmit={handleBulkImportUnits}
              onCancel={() => {
                setShowImportCSVDialog(false)
                setCSVData([])
              }}
              isLoading={isImporting}
            />
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No CSV data to display. Please try again.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
