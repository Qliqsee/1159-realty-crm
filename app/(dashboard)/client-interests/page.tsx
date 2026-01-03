"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/buttons/button"
import { Filter, MessageSquare, Users } from "lucide-react"
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
        <Button variant="outline" className="shadow-soft">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Primary Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
              <p className="text-sm font-medium text-muted-foreground">Total Pending</p>
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
              <p className="text-sm font-medium text-muted-foreground">Total Contacted</p>
              <p className="text-2xl font-bold">{contactedInterests.length}</p>
            </div>
          </div>
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
          searchVariant="gold"
        />
      )}
    </div>
  )
}
