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
        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Appointments</p>
              <p className="text-2xl font-bold">{appointments.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Today</p>
              <p className="text-2xl font-bold">{todayAppointments.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">{completedAppointments.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Video className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Virtual Meetings</p>
              <p className="text-2xl font-bold">{virtualAppointments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Status Breakdown */}
      <div className="grid gap-4 md:grid-cols-5">
        <div className="rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 shadow-soft">
          <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Scheduled</p>
          <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
            {appointments.filter(a => a.status === "Scheduled").length}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Awaiting confirmation</p>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 shadow-soft">
          <p className="text-sm font-medium text-green-800 dark:text-green-300">Confirmed</p>
          <p className="text-3xl font-bold text-green-900 dark:text-green-100">
            {appointments.filter(a => a.status === "Confirmed").length}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">Ready to go</p>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 shadow-soft">
          <p className="text-sm font-medium text-purple-800 dark:text-purple-300">Completed</p>
          <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
            {completedAppointments.length}
          </p>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Successfully done</p>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 p-4 shadow-soft">
          <p className="text-sm font-medium text-red-800 dark:text-red-300">Cancelled</p>
          <p className="text-3xl font-bold text-red-900 dark:text-red-100">
            {appointments.filter(a => a.status === "Cancelled").length}
          </p>
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">Did not proceed</p>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-4 shadow-soft">
          <p className="text-sm font-medium text-orange-800 dark:text-orange-300">No Show</p>
          <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
            {appointments.filter(a => a.status === "No Show").length}
          </p>
          <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Client absent</p>
        </div>
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
