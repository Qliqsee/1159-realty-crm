"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/buttons/button";
import { Plus, Filter, Building2, MapPin, DollarSign, Home, TrendingUp, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/dialogs/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/dialogs/sheet";
import { Badge } from "@/components/badges/badge";
import { Checkbox } from "@/components/inputs/checkbox";
import { Input } from "@/components/inputs/input";
import { Label } from "@/components/layout/label";
import { DataTable } from "@/components/data/data-table";
import { MetricCard } from "@/components/cards/metric-card";
import { PropertyForm } from "@/components/forms/entities/property-form";
import { columns } from "./columns";
import { getProperties, createProperty, updateProperty, deleteProperty } from "@/lib/api/properties";
import type { Property, PropertyType, PropertyStatus } from "@/types";
import { toast } from "sonner";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Filters
  const [filters, setFilters] = useState<{
    type: PropertyType[];
    status: PropertyStatus[];
    priceMin: number | null;
    priceMax: number | null;
  }>({
    type: [],
    status: [],
    priceMin: null,
    priceMax: null,
  });

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [properties, filters]);

  const loadProperties = async () => {
    try {
      setIsLoading(true);
      const data = await getProperties();
      setProperties(data);
    } catch (error) {
      toast.error("Failed to load properties");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...properties];

    if (filters.type.length > 0) {
      filtered = filtered.filter((p) => filters.type.includes(p.type));
    }

    if (filters.status.length > 0) {
      filtered = filtered.filter((p) => filters.status.includes(p.status));
    }

    // Price filtering removed - Property doesn't have finalPrice field
    // if (filters.priceMin !== null) {
    //   filtered = filtered.filter((p) => p.finalPrice >= filters.priceMin!);
    // }

    // if (filters.priceMax !== null) {
    //   filtered = filtered.filter((p) => p.finalPrice <= filters.priceMax!);
    // }

    setFilteredProperties(filtered);
  };

  const toggleFilter = (type: "type" | "status", value: any) => {
    setFilters((prev) => {
      const currentValues = prev[type] as any[]
      return {
        ...prev,
        [type]: currentValues.includes(value) ? currentValues.filter((v) => v !== value) : [...currentValues, value],
      }
    })
  };

  const clearFilters = () => {
    setFilters({
      type: [],
      status: [],
      priceMin: null,
      priceMax: null,
    });
  };

  const activeFilterCount =
    filters.type.length + filters.status.length + (filters.priceMin !== null ? 1 : 0) + (filters.priceMax !== null ? 1 : 0);

  const handleAddProperty = async (data: any) => {
    try {
      setIsSaving(true);
      // Calculate finalPrice from regular price and discount
      const finalPrice = data.regularPrice - (data.regularPrice * data.discountPercentage) / 100;

      await createProperty({
        ...data,
        finalPrice,
        // Map stateId/lgaId/areaId to actual names (in real app, you'd look these up)
        state: data.stateId === "state-1" ? "Lagos" : "Abuja",
        lga: data.lgaId === "lga-1" ? "Ikeja" : "Lekki",
        area: data.areaId === "area-1" ? "Phase 1" : "Phase 2",
        availablePlots: data.totalPlots,
        allocatedPlots: 0,
      });

      toast.success("Property created successfully");
      setShowAddDialog(false);
      loadProperties();
    } catch (error) {
      toast.error("Failed to create property");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditProperty = async (data: any) => {
    if (!editingProperty) return;

    try {
      setIsSaving(true);
      // Calculate finalPrice from regular price and discount
      const finalPrice = data.regularPrice - (data.regularPrice * data.discountPercentage) / 100;

      await updateProperty(editingProperty.id, {
        ...data,
        finalPrice,
        // Map stateId/lgaId/areaId to actual names (in real app, you'd look these up)
        state: data.stateId === "state-1" ? "Lagos" : "Abuja",
        lga: data.lgaId === "lga-1" ? "Ikeja" : "Lekki",
        area: data.areaId === "area-1" ? "Phase 1" : "Phase 2",
      });

      toast.success("Property updated successfully");
      setShowEditDialog(false);
      setEditingProperty(null);
      loadProperties();
    } catch (error) {
      toast.error("Failed to update property");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProperty = async (id: string) => {
    try {
      await deleteProperty(id);
      toast.success("Property deleted successfully");
      loadProperties();
    } catch (error) {
      toast.error("Failed to delete property");
      console.error(error);
    }
  };

  const totalValue = 0; // Property doesn't have finalPrice field
  const landProperties = properties.filter((p) => p.type === "Land");
  const apartmentProperties = properties.filter((p) => p.type === "Apartment");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground mt-1">Manage all your real estate properties and inventory</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="shadow-soft relative">
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Properties</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Property Type</h3>
                  <div className="space-y-2">
                    {(["Land", "Apartment"] as PropertyType[]).map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={filters.type.includes(type)}
                          onCheckedChange={() => toggleFilter("type", type)}
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Status</h3>
                  <div className="space-y-2">
                    {(["Available", "Sold Out", "Reserved", "Disabled"] as PropertyStatus[]).map((status) => (
                      <label key={status} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={filters.status.includes(status)}
                          onCheckedChange={() => toggleFilter("status", status)}
                        />
                        <span>{status}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="priceMin">Minimum Price</Label>
                      <Input
                        id="priceMin"
                        type="number"
                        placeholder="0"
                        value={filters.priceMin || ""}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            priceMin: e.target.value ? parseFloat(e.target.value) : null,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="priceMax">Maximum Price</Label>
                      <Input
                        id="priceMax"
                        type="number"
                        placeholder="No limit"
                        value={filters.priceMax || ""}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            priceMax: e.target.value ? parseFloat(e.target.value) : null,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <Button variant="outline" onClick={clearFilters} className="w-full">
                    <X className="mr-2 h-4 w-4" />
                    Clear All Filters
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
          <Button className="shadow-soft" onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard title="Total Properties" value={properties.length.toString()} icon={Building2} variant="default" />

        <MetricCard title="Land Properties" value={landProperties.length.toString()} icon={MapPin} variant="success" />

        <MetricCard title="Apartments" value={apartmentProperties.length.toString()} icon={Home} variant="primary" />

        <MetricCard
          title="Total Value"
          value={`₦${(totalValue / 1000000000).toFixed(2)}B`}
          changeLabel="Portfolio value"
          icon={DollarSign}
          variant="primary"
        />

        <MetricCard
          title="Available"
          value={properties.filter((p) => p.status === "Available").length.toString()}
          changeLabel="Ready for sale"
          icon={TrendingUp}
          variant="success"
        />

        <MetricCard
          title="Sold Out"
          value={properties.filter((p) => p.status === "Sold Out").length.toString()}
          changeLabel="No longer available"
          icon={Building2}
          variant="danger"
        />
      </div>

      {/* Data Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64 rounded-lg bg-card shadow-soft">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-primary to-yellow-600 animate-pulse mb-4" />
            <p className="text-sm text-muted-foreground">Loading properties...</p>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns({
            onEdit: (property) => {
              setEditingProperty(property);
              setShowEditDialog(true);
            },
            onDelete: handleDeleteProperty,
            onRefresh: loadProperties,
          })}
          data={filteredProperties}
          searchKey="name"
          searchPlaceholder="Search properties by name or location..."
          searchVariant="gold"
        />
      )}

      {/* Add Property Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Property</DialogTitle>
          </DialogHeader>
          <PropertyForm onSubmit={handleAddProperty} onCancel={() => setShowAddDialog(false)} isLoading={isSaving} />
        </DialogContent>
      </Dialog>

      {/* Edit Property Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Property</DialogTitle>
          </DialogHeader>
          {editingProperty && (
            <PropertyForm
              initialData={editingProperty}
              onSubmit={handleEditProperty}
              onCancel={() => {
                setShowEditDialog(false);
                setEditingProperty(null);
              }}
              isLoading={isSaving}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
