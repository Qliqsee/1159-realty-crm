"use client"

import { useEffect, useState } from "react"
import { DataTable } from "@/components/data/data-table"
import { columns } from "./columns"
import { getAppointments, updateAppointment } from "@/lib/api/appointments"
import type { Appointment } from "@/types"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/dialogs/alert-dialog"

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [cancellingAppointment, setCancellingAppointment] = useState<Appointment | null>(null)
  const [sendingReminderFor, setSendingReminderFor] = useState<Appointment | null>(null)

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

  const handleCancelAppointment = async () => {
    if (!cancellingAppointment) return

    try {
      await updateAppointment(cancellingAppointment.id, {
        status: "Cancelled"
      })
      toast.success("Appointment cancelled successfully")
      setCancellingAppointment(null)
      loadAppointments()
    } catch (error) {
      toast.error("Failed to cancel appointment")
      console.error(error)
    }
  }

  const handleSendReminder = async () => {
    if (!sendingReminderFor) return

    try {
      // TODO: Implement send reminder API call
      toast.success(`Reminder sent for appointment`)
      setSendingReminderFor(null)
    } catch (error) {
      toast.error("Failed to send reminder")
      console.error(error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
        <p className="text-muted-foreground mt-1">
          Schedule and manage client appointments and viewings
        </p>
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
          columns={columns({
            onCancelAppointment: setCancellingAppointment,
            onSendReminder: setSendingReminderFor,
          })}
          data={appointments}
          searchKey="title"
          searchPlaceholder="Search appointments by title, client, or property..."
          searchVariant="gold"
        />
      )}

      {/* Cancel Appointment Dialog */}
      <AlertDialog open={!!cancellingAppointment} onOpenChange={(open) => !open && setCancellingAppointment(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, keep it</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelAppointment} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Yes, cancel appointment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Send Reminder Dialog */}
      <AlertDialog open={!!sendingReminderFor} onOpenChange={(open) => !open && setSendingReminderFor(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send Reminder</AlertDialogTitle>
            <AlertDialogDescription>
              Send appointment reminder to interested clients?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSendReminder}>
              Send Reminder
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
