"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/buttons/button"
import { Plus, Upload, Download, Filter, Users, UserCheck, CheckCircle2, Handshake } from "lucide-react"
import { DataTable } from "@/components/data/data-table"
import { columns } from "./columns"
import { getClients } from "@/lib/api/clients"
import type { Client } from "@/types"
import { toast } from "sonner"

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      setIsLoading(true)
      const data = await getClients()
      setClients(data)
    } catch (error) {
      toast.error("Failed to load clients")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const activeClients = clients.filter(c => c.status === "Active")
  const kycApprovedClients = clients.filter(c => c.kycStatus === "Approved")
  const partners = clients.filter(c => c.isPartner)
  const avgKycCompletion = clients.length > 0
    ? Math.round(clients.reduce((sum, c) => sum + (c.kycCompletionPercentage || 0), 0) / clients.length)
    : 0

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground mt-1">
            Manage your clients, KYC status, and partnerships
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
            Add Client
          </Button>
        </div>
      </div>

      {/* Primary Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
              <p className="text-2xl font-bold">{clients.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <UserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
              <p className="text-2xl font-bold">{activeClients.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">KYC Approved</p>
              <p className="text-2xl font-bold">{kycApprovedClients.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Handshake className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Partners</p>
              <p className="text-2xl font-bold">{partners.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* KYC Status Breakdown */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 shadow-soft">
          <p className="text-sm font-medium text-green-800 dark:text-green-300">KYC Approved</p>
          <p className="text-3xl font-bold text-green-900 dark:text-green-100">
            {clients.filter(c => c.kycStatus === "Approved").length}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">Fully verified</p>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 shadow-soft">
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">KYC Pending</p>
          <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">
            {clients.filter(c => c.kycStatus === "Pending").length}
          </p>
          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">Under review</p>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 shadow-soft">
          <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Incomplete</p>
          <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
            {clients.filter(c => c.kycStatus === "Incomplete").length}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Action required</p>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 shadow-soft">
          <p className="text-sm font-medium text-purple-800 dark:text-purple-300">Avg KYC Progress</p>
          <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
            {avgKycCompletion}%
          </p>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Overall completion</p>
        </div>
      </div>

      {/* Data Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64 rounded-lg bg-card shadow-soft">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-primary to-yellow-600 animate-pulse mb-4" />
            <p className="text-sm text-muted-foreground">Loading clients...</p>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={clients}
          searchKey="fullName"
          searchPlaceholder="Search clients by name, email, or phone..."
          searchVariant="gold"
        />
      )}
    </div>
  )
}
