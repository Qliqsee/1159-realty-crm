"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/buttons/button"
import { Plus, Upload, Download, Filter, FileText, TrendingUp, DollarSign, AlertTriangle } from "lucide-react"
import { DataTable } from "@/components/data/data-table"
import { columns } from "./columns"
import { getEnrollments } from "@/lib/api/enrollments"
import type { Enrollment } from "@/types"
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
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadEnrollments()
  }, [])

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
          <Button variant="outline" className="shadow-soft">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" className="shadow-soft">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="shadow-soft">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button className="shadow-soft">
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
          columns={columns}
          data={enrollments}
          searchKey="enrollmentNumber"
          searchPlaceholder="Search by enrollment number, client, or property..."
        />
      )}
    </div>
  )
}
