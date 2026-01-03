"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/buttons/button"
import { Plus, Download, Filter, DollarSign, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react"
import { DataTable } from "@/components/data/data-table"
import { columns } from "./columns"
import { getCommissions } from "@/lib/api/commissions"
import type { Commission } from "@/types"
import { toast } from "sonner"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount)
}

export default function CommissionsPage() {
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCommissions()
  }, [])

  const loadCommissions = async () => {
    try {
      setIsLoading(true)
      const data = await getCommissions()
      setCommissions(data)
    } catch (error) {
      toast.error("Failed to load commissions")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const totalCommission = commissions.reduce((sum, c) => sum + c.commissionAmount, 0)
  const paidCommissions = commissions.filter(c => c.status === "Paid")
  const totalPaid = paidCommissions.reduce((sum, c) => sum + c.finalAmount, 0)
  const pendingCommissions = commissions.filter(c => c.status === "Pending" || c.status === "Approved")
  const totalPending = pendingCommissions.reduce((sum, c) => sum + c.finalAmount, 0)

  const agentCommissions = commissions.filter(c => c.type === "Agent")
  const partnerCommissions = commissions.filter(c => c.type === "Partner")

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Commissions</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage agent and partner commissions
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
          <Button className="shadow-soft">
            <Plus className="mr-2 h-4 w-4" />
            Record Commission
          </Button>
        </div>
      </div>

      {/* Primary Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-muted-foreground">Total Commissions</p>
            <p className="text-xl font-bold text-primary mt-1">
              {formatCurrency(totalCommission)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{commissions.length} records</p>
          </div>
        </div>

        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Paid</p>
              <p className="text-xl font-bold">{formatCurrency(totalPaid)}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending</p>
              <p className="text-xl font-bold">{formatCurrency(totalPending)}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Records</p>
              <p className="text-2xl font-bold">{commissions.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Commission Type & Status Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 shadow-soft">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Agent (70%)</p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {agentCommissions.length}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              {formatCurrency(agentCommissions.reduce((sum, c) => sum + c.finalAmount, 0))}
            </p>
          </div>

          <div className="rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 shadow-soft">
            <p className="text-sm font-medium text-purple-800 dark:text-purple-300">Partner (30%)</p>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {partnerCommissions.length}
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              {formatCurrency(partnerCommissions.reduce((sum, c) => sum + c.finalAmount, 0))}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 shadow-soft">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Pending</p>
            <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">
              {commissions.filter(c => c.status === "Pending").length}
            </p>
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">Awaiting approval</p>
          </div>

          <div className="rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 shadow-soft">
            <p className="text-sm font-medium text-green-800 dark:text-green-300">Approved</p>
            <p className="text-3xl font-bold text-green-900 dark:text-green-100">
              {commissions.filter(c => c.status === "Approved").length}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">Ready for payment</p>
          </div>

          <div className="rounded-lg bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 p-4 shadow-soft">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-300">On Hold</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {commissions.filter(c => c.status === "On Hold").length}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Temporarily paused</p>
          </div>

          <div className="rounded-lg bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 p-4 shadow-soft">
            <p className="text-sm font-medium text-red-800 dark:text-red-300">Rejected</p>
            <p className="text-3xl font-bold text-red-900 dark:text-red-100">
              {commissions.filter(c => c.status === "Rejected").length}
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">Not approved</p>
          </div>
        </div>
      </div>

      {/* Data Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64 rounded-lg bg-card shadow-soft">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-primary to-yellow-600 animate-pulse mb-4" />
            <p className="text-sm text-muted-foreground">Loading commissions...</p>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={commissions}
          searchKey="commissionNumber"
          searchPlaceholder="Search by commission number, recipient, or enrollment..."
        />
      )}
    </div>
  )
}
