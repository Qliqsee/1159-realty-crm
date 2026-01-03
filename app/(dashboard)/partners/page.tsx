"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/buttons/button"
import { Download, Filter, Handshake, Users, DollarSign, TrendingUp, UserCheck } from "lucide-react"
import { DataTable } from "@/components/data/data-table"
import { columns } from "./columns"
import { getPartners } from "@/lib/api/partners"
import type { Partner } from "@/types"
import { toast } from "sonner"

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPartners()
  }, [])

  const loadPartners = async () => {
    try {
      setIsLoading(true)
      const data = await getPartners()
      setPartners(data)
    } catch (error) {
      toast.error("Failed to load partners")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const activePartners = partners.filter(p => p.status === "Active")
  const inactivePartners = partners.filter(p => p.status === "Inactive")
  const suspendedPartners = partners.filter(p => p.status === "Suspended")

  const totalReferrals = partners.reduce((sum, p) => sum + p.totalReferrals, 0)
  const totalActiveReferrals = partners.reduce((sum, p) => sum + p.activeReferrals, 0)
  const totalCommissionEarned = partners.reduce((sum, p) => sum + p.totalCommissionEarned, 0)
  const totalPendingCommission = partners.reduce((sum, p) => sum + p.pendingCommission, 0)
  const totalPaidCommission = partners.reduce((sum, p) => sum + p.paidCommission, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Partners</h1>
          <p className="text-muted-foreground mt-1">
            View approved partners, referrals, and commission performance
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="shadow-soft">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="shadow-soft">
            <Filter className="mr-2 h-4 w-4" />
            Filters
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
              <p className="text-2xl font-bold">{partners.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <UserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Partners</p>
              <p className="text-2xl font-bold">{activePartners.length}</p>
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
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Commission</p>
              <p className="text-2xl font-bold">{formatCurrency(totalCommissionEarned)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status & Commission Breakdown */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 shadow-soft">
          <p className="text-sm font-medium text-green-800 dark:text-green-300">Active</p>
          <p className="text-3xl font-bold text-green-900 dark:text-green-100">
            {activePartners.length}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">Currently active</p>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 p-4 shadow-soft">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-300">Inactive</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {inactivePartners.length}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Deactivated</p>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-4 shadow-soft">
          <p className="text-sm font-medium text-red-800 dark:text-red-300">Suspended</p>
          <p className="text-3xl font-bold text-red-900 dark:text-red-100">
            {suspendedPartners.length}
          </p>
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">Under suspension</p>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 shadow-soft">
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Pending</p>
          <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">
            {formatCurrency(totalPendingCommission)}
          </p>
          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">Awaiting payment</p>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 shadow-soft">
          <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Paid Out</p>
          <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
            {formatCurrency(totalPaidCommission)}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Total paid</p>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-muted-foreground">Active Referrals</p>
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-3xl font-bold">{totalActiveReferrals}</p>
          <p className="text-xs text-muted-foreground mt-2">
            From {totalReferrals} total referrals
          </p>
        </div>

        <div className="rounded-lg bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-muted-foreground">Avg Commission/Partner</p>
            <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-3xl font-bold">
            {formatCurrency(partners.length > 0 ? totalCommissionEarned / partners.length : 0)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Average earnings per partner
          </p>
        </div>

        <div className="rounded-lg bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-muted-foreground">Avg Referrals/Partner</p>
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-3xl font-bold">
            {partners.length > 0 ? (totalReferrals / partners.length).toFixed(1) : 0}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Average referrals per partner
          </p>
        </div>
      </div>

      {/* Data Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64 rounded-lg bg-card shadow-soft">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-primary to-yellow-600 animate-pulse mb-4" />
            <p className="text-sm text-muted-foreground">Loading partners...</p>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={partners}
          searchKey="clientName"
          searchPlaceholder="Search partners by name, email, or referral code..."
          searchVariant="gold"
        />
      )}
    </div>
  )
}
