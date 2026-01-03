"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dialogs/dialog"
import { Label } from "@/components/layout/label"
import { Input } from "@/components/inputs/input"
import { Textarea } from "@/components/inputs/textarea"
import { Button } from "@/components/buttons/button"
import { createSchedule } from "@/lib/api/schedules"
import { toast } from "sonner"

interface AddScheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onScheduleAdded: () => void
}

export function AddScheduleDialog({ open, onOpenChange, onScheduleAdded }: AddScheduleDialogProps) {
  const [dateTime, setDateTime] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get minimum datetime (now) in the format required for datetime-local input
  const getMinDateTime = () => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!dateTime || !location || !description) {
      toast.error("Please fill in all fields")
      return
    }

    // Validate that the selected date is in the future
    const selectedDate = new Date(dateTime)
    if (selectedDate <= new Date()) {
      toast.error("Please select a future date and time")
      return
    }

    try {
      setIsSubmitting(true)
      await createSchedule({
        dateTime: selectedDate,
        location,
        description,
      })
      toast.success("Schedule created successfully")

      // Reset form
      setDateTime("")
      setLocation("")
      setDescription("")

      onScheduleAdded()
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to create schedule")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Schedule</DialogTitle>
            <DialogDescription>
              Create a new schedule for property viewings. All fields are required.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="dateTime">Date & Time</Label>
              <Input
                id="dateTime"
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                min={getMinDateTime()}
                required
              />
              <p className="text-xs text-muted-foreground">
                Select a future date and time for this schedule
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Head Office - Lekki"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="e.g., Property viewing session for new clients"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Schedule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
