"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/buttons/button"
import { Plus, Filter, Calendar, CheckCircle2, Clock, XCircle, Video } from "lucide-react"
import { DataTable } from "@/components/data/data-table"
import { columns } from "./columns"
import { getAppointments } from "@/lib/api/appointments"
import type { Appointment } from "@/types"
import { toast } from "sonner"
import { format } from "date-fns"
import { StatCard } from "@/components/cards/stat-card"

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    try {
      setIsLoading(true)
      const data = await getAppointments()
      setAppointments(data)
    } catch (error) {
      toast.error("Failed to load appointments")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const today = format(new Date(), "yyyy-MM-dd")
  const todayAppointments = appointments.filter(a => format(new Date(a.scheduledDate), "yyyy-MM-dd") === today)
  const upcomingAppointments = appointments.filter(a => new Date(a.scheduledDate) > new Date() && a.status !== "Cancelled")
  const completedAppointments = appointments.filter(a => a.status === "Completed")
  const virtualAppointments = appointments.filter(a => a.isVirtual)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground mt-1">
            Schedule and manage client appointments and viewings
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="shadow-soft">
            <Calendar className="mr-2 h-4 w-4" />
            Calendar View
          </Button>
          <Button variant="outline" className="shadow-soft">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button className="shadow-soft">
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Primary Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Appointments"
          value={appointments.length}
          icon={Calendar}
          colorScheme="primary"
        />
        <StatCard
          label="Today"
          value={todayAppointments.length}
          icon={Clock}
          colorScheme="blue"
        />
        <StatCard
          label="Completed"
          value={completedAppointments.length}
          icon={CheckCircle2}
          colorScheme="green"
        />
        <StatCard
          label="Virtual Meetings"
          value={virtualAppointments.length}
          icon={Video}
          colorScheme="purple"
        />
      </div>

      {/* Appointment Status Breakdown */}
      <div className="grid gap-4 md:grid-cols-5">
        <StatCard
          label="Scheduled"
          value={appointments.filter(a => a.status === "Scheduled").length}
          description="Awaiting confirmation"
          colorScheme="blue"
        />
        <StatCard
          label="Confirmed"
          value={appointments.filter(a => a.status === "Confirmed").length}
          description="Ready to go"
          colorScheme="green"
        />
        <StatCard
          label="Completed"
          value={completedAppointments.length}
          description="Successfully done"
          colorScheme="purple"
        />
        <StatCard
          label="Cancelled"
          value={appointments.filter(a => a.status === "Cancelled").length}
          description="Did not proceed"
          colorScheme="red"
        />
        <StatCard
          label="No Show"
          value={appointments.filter(a => a.status === "No Show").length}
          description="Client absent"
          colorScheme="orange"
        />
      </div>

      {/* Data Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64 rounded-lg bg-card shadow-soft">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-primary to-yellow-600 animate-pulse mb-4" />
            <p className="text-sm text-muted-foreground">Loading appointments...</p>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={appointments}
          searchKey="title"
          searchPlaceholder="Search appointments by title, client, or property..."
        />
      )}
    </div>
  )
}
