"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/buttons/button"
import { Download, Filter, MessageSquare, Users, CheckCircle2, TrendingUp, XCircle } from "lucide-react"
import { DataTable } from "@/components/data/data-table"
import { columns } from "./columns"
import { getClientInterests } from "@/lib/api/client-interests"
import type { ClientInterest } from "@/types"
import { toast } from "sonner"

export default function ClientInterestsPage() {
  const [interests, setInterests] = useState<ClientInterest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadInterests()
  }, [])

  const loadInterests = async () => {
    try {
      setIsLoading(true)
      const data = await getClientInterests()
      setInterests(data)
    } catch (error) {
      toast.error("Failed to load client interests")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const newInterests = interests.filter(i => i.status === "New")
  const contactedInterests = interests.filter(i => i.status === "Contacted")
  const convertedInterests = interests.filter(i => i.status === "Converted")
  const lostInterests = interests.filter(i => i.status === "Lost")
  const conversionRate = interests.length > 0
    ? Math.round((convertedInterests.length / interests.length) * 100)
    : 0

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Client Interests</h1>
          <p className="text-muted-foreground mt-1">
            View and manage property interests expressed by clients
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Interests</p>
              <p className="text-2xl font-bold">{interests.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">New</p>
              <p className="text-2xl font-bold">{newInterests.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
              <MessageSquare className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Contacted</p>
              <p className="text-2xl font-bold">{contactedInterests.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Converted</p>
              <p className="text-2xl font-bold">{convertedInterests.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
              <p className="text-2xl font-bold">{conversionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 shadow-soft">
          <p className="text-sm font-medium text-blue-800 dark:text-blue-300">New Interests</p>
          <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
            {newInterests.length}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Require follow-up</p>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 shadow-soft">
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Contacted</p>
          <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">
            {contactedInterests.length}
          </p>
          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">In progress</p>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 shadow-soft">
          <p className="text-sm font-medium text-green-800 dark:text-green-300">Converted</p>
          <p className="text-3xl font-bold text-green-900 dark:text-green-100">
            {convertedInterests.length}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">Successful enrollments</p>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-4 shadow-soft">
          <p className="text-sm font-medium text-red-800 dark:text-red-300">Lost</p>
          <p className="text-3xl font-bold text-red-900 dark:text-red-100">
            {lostInterests.length}
          </p>
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">Did not convert</p>
        </div>
      </div>

      {/* Data Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64 rounded-lg bg-card shadow-soft">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-primary to-yellow-600 animate-pulse mb-4" />
            <p className="text-sm text-muted-foreground">Loading client interests...</p>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={interests}
          searchKey="clientName"
          searchPlaceholder="Search by client name, property, or message..."
        />
      )}
    </div>
  )
}
