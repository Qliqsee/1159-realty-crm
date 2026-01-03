"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Upload, Download, Filter, Handshake, TrendingUp, DollarSign, Users } from "lucide-react"
import { DataTable } from "@/components/tables/data-table"
import { columns } from "./columns"
import { getPartnerships } from "@/lib/api/partnerships"
import type { Partnership } from "@/types"
import { toast } from "sonner"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount)
}

export default function PartnershipsPage() {
  const [partnerships, setPartnerships] = useState<Partnership[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPartnerships()
  }, [])

  const loadPartnerships = async () => {
    try {
      setIsLoading(true)
      const data = await getPartnerships()
      setPartnerships(data)
    } catch (error) {
      toast.error("Failed to load partnerships")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const activePartnerships = partnerships.filter(p => p.status === "Approved")
  const totalReferrals = partnerships.reduce((sum, p) => sum + p.totalReferrals, 0)
  const totalSalesValue = partnerships.reduce((sum, p) => sum + p.totalSalesValue, 0)
  const totalCommissionPending = partnerships.reduce((sum, p) => sum + p.commissionPending, 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Partnerships</h1>
          <p className="text-muted-foreground mt-1">
            Manage partner referrals and commission payments
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
            New Partnership
          </Button>
        </div>
      </div>

      {/* Primary Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Handshake className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Partners</p>
              <p className="text-2xl font-bold">{partnerships.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Partners</p>
              <p className="text-2xl font-bold">{activePartnerships.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Referrals</p>
              <p className="text-2xl font-bold">{totalReferrals}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-muted-foreground">Sales Value</p>
            <p className="text-xl font-bold text-primary">
              {formatCurrency(totalSalesValue)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">From referrals</p>
          </div>
        </div>
      </div>

      {/* Commission & Status Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <DollarSign className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <p className="text-sm font-medium text-orange-800 dark:text-orange-300">Pending Commission</p>
          </div>
          <p className="text-3xl font-bold text-orange-900 dark:text-orange-100 mb-2">
            {formatCurrency(totalCommissionPending)}
          </p>
          <p className="text-xs text-orange-600 dark:text-orange-400">
            To be paid to {activePartnerships.filter(p => p.commissionPending > 0).length} partners
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 shadow-soft">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Pending</p>
            <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
              {partnerships.filter(p => p.status === "Pending").length}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Awaiting approval</p>
          </div>

          <div className="rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 shadow-soft">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Suspended</p>
            <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">
              {partnerships.filter(p => p.status === "Suspended").length}
            </p>
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">Temporarily paused</p>
          </div>

          <div className="rounded-lg bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 p-4 shadow-soft">
            <p className="text-sm font-medium text-red-800 dark:text-red-300">Rejected</p>
            <p className="text-3xl font-bold text-red-900 dark:text-red-100">
              {partnerships.filter(p => p.status === "Rejected").length}
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">Not approved</p>
          </div>

          <div className="rounded-lg bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 p-4 shadow-soft">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-300">Terminated</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {partnerships.filter(p => p.status === "Terminated").length}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Ended</p>
          </div>
        </div>
      </div>

      {/* Data Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64 rounded-lg bg-card shadow-soft">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-primary to-yellow-600 animate-pulse mb-4" />
            <p className="text-sm text-muted-foreground">Loading partnerships...</p>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={partnerships}
          searchKey="partnerName"
          searchPlaceholder="Search by partner name, number, or email..."
        />
      )}
    </div>
  )
}
