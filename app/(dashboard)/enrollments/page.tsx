"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/buttons/button"
import { Plus, Filter, FileText, TrendingUp, DollarSign, AlertTriangle, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/dialogs/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/dialogs/sheet"
import { Badge } from "@/components/badges/badge"
import { Checkbox } from "@/components/inputs/checkbox"
import { DataTable } from "@/components/data/data-table"
import { EnrollmentForm } from "@/components/forms/entities/enrollment-form"
import { columns } from "./columns"
import { getEnrollments, createEnrollment, updateEnrollment } from "@/lib/api/enrollments"
import type { Enrollment, EnrollmentStatus, PaymentType } from "@/types"
import { toast } from "sonner"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount)
}

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [filteredEnrollments, setFilteredEnrollments] = useState<Enrollment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingEnrollment, setEditingEnrollment] = useState<Enrollment | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Filters
  const [filters, setFilters] = useState<{
    status: EnrollmentStatus[];
    paymentType: PaymentType[];
  }>({
    status: [],
    paymentType: [],
  })

  useEffect(() => {
    loadEnrollments()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [enrollments, filters])

  const loadEnrollments = async () => {
    try {
      setIsLoading(true)
      const data = await getEnrollments()
      setEnrollments(data)
    } catch (error) {
      toast.error("Failed to load enrollments")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...enrollments]

    if (filters.status.length > 0) {
      filtered = filtered.filter((e) => filters.status.includes(e.status))
    }

    if (filters.paymentType.length > 0) {
      filtered = filtered.filter((e) => e.paymentType && filters.paymentType.includes(e.paymentType))
    }

    setFilteredEnrollments(filtered)
  }

  const toggleFilter = (type: "status" | "paymentType", value: any) => {
    setFilters((prev) => {
      const currentValues = prev[type] as any[]
      return {
        ...prev,
        [type]: currentValues.includes(value) ? currentValues.filter((v) => v !== value) : [...currentValues, value],
      }
    })
  }

  const clearFilters = () => {
    setFilters({
      status: [],
      paymentType: [],
    })
  }

  const activeFilterCount = filters.status.length + filters.paymentType.length

  const handleAddEnrollment = async (data: any) => {
    try {
      setIsSaving(true)
      await createEnrollment(data)
      toast.success("Enrollment created successfully")
      setShowAddDialog(false)
      loadEnrollments()
    } catch (error) {
      toast.error("Failed to create enrollment")
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditEnrollment = async (data: any) => {
    if (!editingEnrollment) return

    try {
      setIsSaving(true)
      await updateEnrollment(editingEnrollment.id, data)
      toast.success("Enrollment updated successfully")
      setShowEditDialog(false)
      setEditingEnrollment(null)
      loadEnrollments()
    } catch (error) {
      toast.error("Failed to update enrollment")
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  const activeEnrollments = enrollments.filter(e => e.status === "Active")
  const totalRevenue = enrollments.reduce((sum, e) => sum + e.totalPaid, 0)
  const outstandingRevenue = enrollments.reduce((sum, e) => sum + e.outstandingBalance, 0)
  const defaultingEnrollments = enrollments.filter(e => e.daysOverdue > 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enrollments</h1>
          <p className="text-muted-foreground mt-1">
            Manage property enrollments and payment plans
          </p>
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
                <SheetTitle>Filter Enrollments</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Status</h3>
                  <div className="space-y-2">
                    {(["Pending", "Active", "Completed", "Suspended", "Cancelled"] as EnrollmentStatus[]).map((status) => (
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
                  <h3 className="font-medium mb-3">Payment Type</h3>
                  <div className="space-y-2">
                    {(["Outright", "Installment"] as PaymentType[]).map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={filters.paymentType.includes(type)}
                          onCheckedChange={() => toggleFilter("paymentType", type)}
                        />
                        <span>{type}</span>
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
            New Enrollment
          </Button>
        </div>
      </div>

      {/* Primary Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Enrollments</p>
              <p className="text-2xl font-bold">{enrollments.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">{activeEnrollments.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
            <p className="text-xl font-bold text-primary">
              {formatCurrency(totalRevenue)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Collected</p>
          </div>
        </div>

        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Defaulting</p>
              <p className="text-2xl font-bold">{defaultingEnrollments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue & Status Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm font-medium text-green-800 dark:text-green-300">Revenue Collected</p>
          </div>
          <p className="text-3xl font-bold text-green-900 dark:text-green-100 mb-2">
            {formatCurrency(totalRevenue)}
          </p>
          <div className="flex items-center justify-between text-xs mt-4">
            <span className="text-green-600 dark:text-green-400">Outstanding</span>
            <span className="font-medium text-green-700 dark:text-green-300">{formatCurrency(outstandingRevenue)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 shadow-soft">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Pending</p>
            <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
              {enrollments.filter(e => e.status === "Pending").length}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Awaiting approval</p>
          </div>

          <div className="rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 shadow-soft">
            <p className="text-sm font-medium text-purple-800 dark:text-purple-300">Completed</p>
            <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
              {enrollments.filter(e => e.status === "Completed").length}
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Fully paid</p>
          </div>

          <div className="rounded-lg bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-4 shadow-soft">
            <p className="text-sm font-medium text-orange-800 dark:text-orange-300">Suspended</p>
            <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
              {enrollments.filter(e => e.status === "Suspended").length}
            </p>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Payment issues</p>
          </div>

          <div className="rounded-lg bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 p-4 shadow-soft">
            <p className="text-sm font-medium text-red-800 dark:text-red-300">Cancelled</p>
            <p className="text-3xl font-bold text-red-900 dark:text-red-100">
              {enrollments.filter(e => e.status === "Cancelled").length}
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">Terminated</p>
          </div>
        </div>
      </div>

      {/* Data Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64 rounded-lg bg-card shadow-soft">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-primary to-yellow-600 animate-pulse mb-4" />
            <p className="text-sm text-muted-foreground">Loading enrollments...</p>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns({
            onEdit: (enrollment) => {
              setEditingEnrollment(enrollment)
              setShowEditDialog(true)
            },
          })}
          data={filteredEnrollments}
          searchKey="enrollmentNumber"
          searchPlaceholder="Search by enrollment number, client, or property..."
          searchVariant="gold"
        />
      )}

      {/* Add Enrollment Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Enrollment</DialogTitle>
          </DialogHeader>
          <EnrollmentForm onSubmit={handleAddEnrollment} onCancel={() => setShowAddDialog(false)} isLoading={isSaving} />
        </DialogContent>
      </Dialog>

      {/* Edit Enrollment Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Enrollment</DialogTitle>
          </DialogHeader>
          {editingEnrollment && (
            <EnrollmentForm
              initialData={editingEnrollment}
              onSubmit={handleEditEnrollment}
              onCancel={() => {
                setShowEditDialog(false)
                setEditingEnrollment(null)
              }}
              isLoading={isSaving}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
