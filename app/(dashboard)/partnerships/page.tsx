"use client"

import { useEffect, useState } from "react"
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react"
import { DataTable } from "@/components/data/data-table"
import { columns } from "./columns"
import { getPartnerships } from "@/lib/api/partnerships"
import type { Partnership } from "@/types"
import { toast } from "sonner"

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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Partnership Applications</h1>
          <p className="text-muted-foreground mt-1">
            Review and manage partnership applications
          </p>
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
              <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
              <p className="text-2xl font-bold">{partnerships.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
              <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Pending</p>
              <p className="text-2xl font-bold">{partnerships.filter(p => p.status === "Pending").length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Approved</p>
              <p className="text-2xl font-bold">{partnerships.filter(p => p.status === "Approved").length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Rejected</p>
              <p className="text-2xl font-bold">{partnerships.filter(p => p.status === "Rejected").length}</p>
            </div>
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
          searchVariant="gold"
        />
      )}
    </div>
  )
}
