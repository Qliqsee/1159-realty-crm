"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/buttons/button"
import { Plus, Filter, Users, UserCheck, MapPin, Globe, Handshake } from "lucide-react"
import { DataTable } from "@/components/data/data-table"
import { columns } from "./columns"
import { getClients } from "@/lib/api/clients"
import type { Client } from "@/types"
import { toast } from "sonner"

export default function MyClientsPage() {
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

  const maleClients = clients.filter(c => c.gender === "Male")
  const femaleClients = clients.filter(c => c.gender === "Female")
  const inCountryClients = clients.filter(c => c.country?.toLowerCase() === "nigeria" || !c.country)
  const diasporaClients = clients.filter(c => c.country && c.country.toLowerCase() !== "nigeria")
  const partners = clients.filter(c => c.isPartner)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Clients</h1>
          <p className="text-muted-foreground mt-1">
            Manage your personal clients, KYC status, and partnerships
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <UserCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Male</p>
              <p className="text-2xl font-bold">{maleClients.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-pink-100 dark:bg-pink-900/30">
              <UserCheck className="h-5 w-5 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Female</p>
              <p className="text-2xl font-bold">{femaleClients.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total In Country</p>
              <p className="text-2xl font-bold">{inCountryClients.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <Globe className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total In Diaspora</p>
              <p className="text-2xl font-bold">{diasporaClients.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Handshake className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Partners</p>
              <p className="text-2xl font-bold">{partners.length}</p>
            </div>
          </div>
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
