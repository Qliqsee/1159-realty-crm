"use client"

import { useEffect, useState } from "react"
import { DataTable } from "@/components/data/data-table"
import { columns } from "./columns"
import { getSchedules, deleteSchedule } from "@/lib/api/schedules"
import type { Schedule } from "@/types"
import { toast } from "sonner"
import { Button } from "@/components/buttons/button"
import { Plus } from "lucide-react"
import { AddScheduleDialog } from "./add-schedule-dialog"

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)

  useEffect(() => {
    loadSchedules()
  }, [])

  const loadSchedules = async () => {
    try {
      setIsLoading(true)
      const data = await getSchedules()
      setSchedules(data)
    } catch (error) {
      toast.error("Failed to load schedules")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSchedule = async (id: string) => {
    try {
      await deleteSchedule(id)
      toast.success("Schedule deleted successfully")
      loadSchedules()
    } catch (error) {
      toast.error("Failed to delete schedule")
      console.error(error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedules</h1>
          <p className="text-muted-foreground mt-1">
            Manage property viewing schedules and appointments
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Schedule
        </Button>
      </div>

      {/* Data Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64 rounded-lg bg-card shadow-soft">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-primary to-yellow-600 animate-pulse mb-4" />
            <p className="text-sm text-muted-foreground">Loading schedules...</p>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns({
            onDelete: handleDeleteSchedule,
          })}
          data={schedules}
          searchKey="description"
          searchPlaceholder="Search schedules by description or location..."
          searchVariant="gold"
        />
      )}

      {/* Add Schedule Dialog */}
      <AddScheduleDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onScheduleAdded={loadSchedules}
      />
    </div>
  )
}
