"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, Calendar, Clock, MapPin, Users, Home, CheckCircle, XCircle, RotateCcw } from "lucide-react"
import { Button } from "@/components/buttons/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/card"
import { Badge } from "@/components/badges/badge"
import { Separator } from "@/components/display/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/navigation/tabs"
import { PageHeader } from "@/components/layout/page-header"
import { format } from "date-fns"
import { useEffect, useState } from "react"
import { toast } from "sonner"

// Mock data will be replaced with API call
interface Appointment {
  id: string
  propertyId: string
  propertyName: string
  inspectionDate: Date
  inspectionTime: string
  location: string
  propertyAddress: string
  maxCapacity: number
  currentAttendees: number
  availableSlots: number
  interestedClients: AppointmentInterest[]
  status: "Scheduled" | "Completed" | "Cancelled"
  notes?: string
  createdBy: string
  createdByName: string
  createdAt: Date
  updatedAt: Date
  cancelledAt?: Date
  cancellationReason?: string
}

interface AppointmentInterest {
  id: string
  appointmentId: string
  clientId: string
  clientName: string
  clientPhone: string
  clientEmail: string
  expressedInterestAt: Date
  contacted: boolean
  contactedAt?: Date
  contactedBy?: string
  attended: boolean
  attendanceMarkedAt?: Date
  notes?: string
}

export default function AppointmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const appointmentId = params.id as string
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - will be replaced with API call
  const appointment: Appointment = {
    id: appointmentId,
    propertyId: "prop-1",
    propertyName: "Lekki Gardens Phase 2",
    inspectionDate: new Date("2024-12-20"),
    inspectionTime: "10:00",
    location: "Property Site - Lekki",
    propertyAddress: "Plot 123, Lekki-Epe Expressway, Lekki, Lagos",
    maxCapacity: 15,
    currentAttendees: 8,
    availableSlots: 7,
    status: "Scheduled",
    notes: "Bring ID cards for registration. Property tour will start promptly at 10:00 AM.",
    createdBy: "agent-1",
    createdByName: "Michael Chen",
    createdAt: new Date("2024-12-01"),
    updatedAt: new Date("2024-12-05"),
    interestedClients: [
      {
        id: "int-1",
        appointmentId: appointmentId,
        clientId: "client-1",
        clientName: "Sarah Johnson",
        clientPhone: "+234 801 234 5678",
        clientEmail: "sarah.johnson@example.com",
        expressedInterestAt: new Date("2024-12-02"),
        contacted: true,
        contactedAt: new Date("2024-12-03"),
        contactedBy: "agent-1",
        attended: false,
        notes: "Interested in 500 sqm plot",
      },
      {
        id: "int-2",
        appointmentId: appointmentId,
        clientId: "client-2",
        clientName: "David Brown",
        clientPhone: "+234 802 345 6789",
        clientEmail: "david.brown@example.com",
        expressedInterestAt: new Date("2024-12-03"),
        contacted: true,
        contactedAt: new Date("2024-12-04"),
        contactedBy: "agent-2",
        attended: false,
        notes: "Looking for commercial plot",
      },
    ],
  }

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 500)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-primary to-yellow-600 animate-pulse mb-4" />
          <p className="text-sm text-muted-foreground">Loading appointment...</p>
        </div>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    Scheduled: "bg-blue-500",
    Completed: "bg-green-500",
    Cancelled: "bg-red-500",
  }

  const capacityPercentage = (appointment.currentAttendees / appointment.maxCapacity) * 100

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Appointment - ${appointment.propertyName}`}
        description={`${format(appointment.inspectionDate, "PPP")} at ${appointment.inspectionTime}`}
        actions={
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button size="sm" onClick={() => router.push(`/appointments/${appointmentId}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Appointment Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Home className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Property</p>
                    <p className="font-medium">{appointment.propertyName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Inspection Date</p>
                    <p className="font-medium">{format(appointment.inspectionDate, "PPP")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">{appointment.inspectionTime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{appointment.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Created By</p>
                    <p className="font-medium">{appointment.createdByName}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Property Address</h4>
                <p className="text-sm text-muted-foreground">{appointment.propertyAddress}</p>
              </div>

              {appointment.notes && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Notes</h4>
                    <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                  </div>
                </>
              )}

              {appointment.status === "Cancelled" && appointment.cancellationReason && (
                <>
                  <Separator />
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <h4 className="font-medium mb-2 text-red-900 dark:text-red-100">Cancellation Reason</h4>
                    <p className="text-sm text-red-700 dark:text-red-300">{appointment.cancellationReason}</p>
                    {appointment.cancelledAt && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                        Cancelled on {format(appointment.cancelledAt, "PPP")}
                      </p>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Capacity Card */}
          <Card>
            <CardHeader>
              <CardTitle>Capacity Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Capacity Used</span>
                  <span className="font-medium">{capacityPercentage.toFixed(0)}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      capacityPercentage >= 90
                        ? "bg-red-500"
                        : capacityPercentage >= 70
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${capacityPercentage}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{appointment.maxCapacity}</p>
                  <p className="text-xs text-muted-foreground">Max Capacity</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{appointment.currentAttendees}</p>
                  <p className="text-xs text-muted-foreground">Registered</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{appointment.availableSlots}</p>
                  <p className="text-xs text-muted-foreground">Available</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Section */}
          <Tabs defaultValue="clients">
            <TabsList>
              <TabsTrigger value="clients">Interested Clients ({appointment.interestedClients.length})</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="clients">
              <Card>
                <CardHeader>
                  <CardTitle>Interested Clients</CardTitle>
                </CardHeader>
                <CardContent>
                  {appointment.interestedClients.length > 0 ? (
                    <div className="space-y-3">
                      {appointment.interestedClients.map((client) => (
                        <div
                          key={client.id}
                          className="p-4 rounded-lg bg-muted/50 space-y-2"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">{client.clientName}</p>
                              <p className="text-sm text-muted-foreground">{client.clientEmail}</p>
                              <p className="text-sm text-muted-foreground">{client.clientPhone}</p>
                            </div>
                            <div className="flex gap-2">
                              {client.contacted && (
                                <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20">
                                  Contacted
                                </Badge>
                              )}
                              {client.attended && (
                                <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20">
                                  Attended
                                </Badge>
                              )}
                            </div>
                          </div>
                          {client.notes && (
                            <p className="text-sm text-muted-foreground italic">{client.notes}</p>
                          )}
                          <div className="text-xs text-muted-foreground">
                            Registered: {format(client.expressedInterestAt, "PPP")}
                            {client.contactedAt && ` • Contacted: ${format(client.contactedAt, "PPP")}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No interested clients yet</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                      <div>
                        <p className="font-medium">Appointment Created</p>
                        <p className="text-sm text-muted-foreground">
                          {format(appointment.createdAt, "PPP 'at' p")}
                        </p>
                      </div>
                    </div>
                    {appointment.updatedAt.getTime() !== appointment.createdAt.getTime() && (
                      <div className="flex gap-3">
                        <div className="w-2 h-2 mt-2 rounded-full bg-yellow-500" />
                        <div>
                          <p className="font-medium">Appointment Updated</p>
                          <p className="text-sm text-muted-foreground">
                            {format(appointment.updatedAt, "PPP 'at' p")}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={statusColors[appointment.status]}>
                {appointment.status}
              </Badge>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {appointment.status === "Scheduled" && (
                <>
                  <Button className="w-full" variant="outline">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Completed
                  </Button>
                  <Button className="w-full" variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reschedule
                  </Button>
                  <Button className="w-full text-red-600" variant="outline">
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Appointment
                  </Button>
                </>
              )}
              {appointment.status === "Completed" && (
                <Button className="w-full" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Follow-up
                </Button>
              )}
              {appointment.status === "Cancelled" && (
                <Button className="w-full" variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Recreate Appointment
                </Button>
              )}
              <Button className="w-full" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Add Client
              </Button>
            </CardContent>
          </Card>

          {/* Meta Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Created</p>
                <p className="font-medium">{format(appointment.createdAt, "PPP")}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p className="font-medium">{format(appointment.updatedAt, "PPP")}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">Organized By</p>
                <p className="font-medium">{appointment.createdByName}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
