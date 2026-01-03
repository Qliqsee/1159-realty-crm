"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/buttons/button"
import { Plus, Upload, Download, Filter as FilterIcon, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/dialogs/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/dialogs/sheet"
import { Badge } from "@/components/badges/badge"
import { Checkbox } from "@/components/inputs/checkbox"
import { DataTable } from "@/components/data/data-table"
import { LeadForm } from "@/components/forms/entities/lead-form"
import { CSVImportTable } from "@/components/data/csv-import-table"
import { getLeads, createLead, updateLead, deleteLead } from "@/lib/api/leads"
import type { Lead, LeadStatus, LeadSource } from "@/types"
import { toast } from "sonner"
import { columns } from "./columns"
import * as z from "zod"

// Lead CSV schema for validation
const leadCSVSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  alternatePhone: z.string().optional(),
  status: z.enum(["New", "Contacted", "Qualified", "Converted", "Lost"]).default("New"),
  source: z.enum(["Website", "Social Media", "Referral", "Agent", "Partner", "Walk-in", "Phone Call", "Email", "Advertisement", "Event", "Other"]),
  sourceDetails: z.string().optional(),
})

export default function LeadsPage() {
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showImportCSVDialog, setShowImportCSVDialog] = useState(false)
  const [csvData, setCSVData] = useState<string[][]>([])
  const [isImporting, setIsImporting] = useState(false)

  // Filters
  const [filters, setFilters] = useState<{
    status: LeadStatus[]
    source: LeadSource[]
  }>({
    status: [],
    source: [],
  })

  useEffect(() => {
    loadLeads()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [leads, filters])

  const loadLeads = async () => {
    try {
      setIsLoading(true)
      const data = await getLeads()
      setLeads(data)
    } catch (error) {
      toast.error("Failed to load leads")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...leads]

    if (filters.status.length > 0) {
      filtered = filtered.filter((lead) => filters.status.includes(lead.status))
    }

    if (filters.source.length > 0) {
      filtered = filtered.filter((lead) => filters.source.includes(lead.source))
    }

    setFilteredLeads(filtered)
  }

  const handleAddLead = async (data: any) => {
    try {
      setIsSaving(true)
      await createLead(data)
      toast.success("Lead created successfully")
      setShowAddDialog(false)
      loadLeads()
    } catch (error) {
      toast.error("Failed to create lead")
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditLead = async (data: any) => {
    if (!editingLead) return

    try {
      setIsSaving(true)
      await updateLead(editingLead.id, data)
      toast.success("Lead updated successfully")
      setShowEditDialog(false)
      setEditingLead(null)
      loadLeads()
    } catch (error) {
      toast.error("Failed to update lead")
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteLead = async (id: string) => {
    try {
      await deleteLead(id)
      toast.success("Lead deleted successfully")
      loadLeads()
    } catch (error) {
      toast.error("Failed to delete lead")
      console.error(error)
    }
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
      event.target.value = ""
    }
  }

  const handleBulkImportLeads = async (validatedData: z.infer<typeof leadCSVSchema>[]) => {
    try {
      setIsImporting(true)
      for (const data of validatedData) {
        await createLead({
          firstName: data.firstname,
          lastName: data.lastname,
          email: data.email,
          phone: data.phone,
          alternatePhone: data.alternatePhone,
          status: data.status,
          source: data.source,
          sourceDetails: data.sourceDetails,
          tags: [],
          interestedProperties: [],
        })
      }
      toast.success(`Successfully imported ${validatedData.length} leads`)
      setShowImportCSVDialog(false)
      setCSVData([])
      loadLeads()
    } catch (error) {
      toast.error("Failed to import leads")
      console.error(error)
    } finally {
      setIsImporting(false)
    }
  }

  const handleExport = () => {
    const headers = [
      "ID",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Status",
      "Source",
      "Assigned Agent",
      "Created At",
    ]

    const csvData = leads.map((lead) => [
      lead.id,
      lead.firstName,
      lead.lastName,
      lead.email,
      lead.phone,
      lead.status,
      lead.source,
      lead.assignedAgentName || "",
      new Date(lead.createdAt).toISOString(),
    ])

    const csv = [headers, ...csvData].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Leads exported successfully")
  }

  const toggleFilter = (type: "status" | "source", value: any) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((v) => v !== value)
        : [...prev[type], value],
    }))
  }

  const clearFilters = () => {
    setFilters({ status: [], source: [] })
  }

  const activeFilterCount = filters.status.length + filters.source.length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your sales leads
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <label htmlFor="import-csv">
            <input
              id="import-csv"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleCSVFileUpload}
            />
            <Button variant="outline" className="shadow-soft" asChild>
              <span className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" />
                Import
              </span>
            </Button>
          </label>
          <Button variant="outline" className="shadow-soft" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="shadow-soft relative">
                <FilterIcon className="mr-2 h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Leads</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Status</h3>
                  <div className="space-y-2">
                    {(["New", "Contacted", "Qualified", "Converted", "Lost"] as LeadStatus[]).map(
                      (status) => (
                        <label key={status} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={filters.status.includes(status)}
                            onCheckedChange={() => toggleFilter("status", status)}
                          />
                          <span>{status}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Source</h3>
                  <div className="space-y-2">
                    {(
                      [
                        "Website",
                        "Social Media",
                        "Referral",
                        "Agent",
                        "Partner",
                        "Walk-in",
                        "Phone Call",
                        "Email",
                      ] as LeadSource[]
                    ).map((source) => (
                      <label key={source} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={filters.source.includes(source)}
                          onCheckedChange={() => toggleFilter("source", source)}
                        />
                        <span>{source}</span>
                      </label>
                    ))}
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
            Add Lead
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-card p-4 shadow-soft">
          <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
          <p className="text-2xl font-bold">{leads.length}</p>
        </div>
        <div className="rounded-lg bg-card p-4 shadow-soft">
          <p className="text-sm font-medium text-muted-foreground">New Leads</p>
          <p className="text-2xl font-bold">
            {leads.filter((l) => l.status === "New").length}
          </p>
        </div>
        <div className="rounded-lg bg-card p-4 shadow-soft">
          <p className="text-sm font-medium text-muted-foreground">Qualified</p>
          <p className="text-2xl font-bold">
            {leads.filter((l) => l.status === "Qualified").length}
          </p>
        </div>
        <div className="rounded-lg bg-card p-4 shadow-soft">
          <p className="text-sm font-medium text-muted-foreground">Converted</p>
          <p className="text-2xl font-bold">
            {leads.filter((l) => l.status === "Converted").length}
          </p>
        </div>
      </div>

      {/* Data Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64 rounded-lg bg-card shadow-soft">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-primary to-yellow-600 animate-pulse mb-4" />
            <p className="text-sm text-muted-foreground">Loading leads...</p>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns({
            onEdit: (lead) => {
              setEditingLead(lead)
              setShowEditDialog(true)
            },
            onDelete: handleDeleteLead,
            onRefresh: loadLeads,
          })}
          data={filteredLeads}
          searchKey="fullName"
          searchPlaceholder="Search leads by name..."
          searchVariant="gold"
        />
      )}

      {/* Add Lead Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
          </DialogHeader>
          <LeadForm
            onSubmit={handleAddLead}
            onCancel={() => setShowAddDialog(false)}
            isLoading={isSaving}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Lead Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Lead</DialogTitle>
          </DialogHeader>
          {editingLead && (
            <LeadForm
              initialData={editingLead}
              onSubmit={handleEditLead}
              onCancel={() => {
                setShowEditDialog(false)
                setEditingLead(null)
              }}
              isLoading={isSaving}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Import Leads from CSV Dialog */}
      <Dialog open={showImportCSVDialog} onOpenChange={setShowImportCSVDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import Leads from CSV</DialogTitle>
            <DialogDescription>
              Map CSV columns to lead fields and review data before importing
            </DialogDescription>
          </DialogHeader>
          {csvData.length > 0 && (
            <CSVImportTable
              csvData={csvData}
              schema={leadCSVSchema}
              fieldMappings={[
                { targetField: "firstname", label: "First Name", required: true },
                { targetField: "lastname", label: "Last Name", required: true },
                { targetField: "email", label: "Email", required: true },
                { targetField: "phone", label: "Phone", required: true },
                { targetField: "alternatePhone", label: "Alternate Phone" },
                { targetField: "status", label: "Status" },
                { targetField: "source", label: "Source", required: true },
                { targetField: "sourceDetails", label: "Source Details" },
              ]}
              onSubmit={handleBulkImportLeads}
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
