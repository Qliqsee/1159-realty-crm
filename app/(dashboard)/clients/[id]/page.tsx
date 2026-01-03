"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, Shield, Briefcase } from "lucide-react"
import { Button } from "@/components/buttons/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/card"
import { Badge } from "@/components/badges/badge"
import { Separator } from "@/components/display/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/navigation/tabs"
import { PageHeader } from "@/components/layout/page-header"
import { format } from "date-fns"

export default function ClientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const clientId = params.id as string

  // Mock data - replace with actual API call
  const client = {
    id: clientId,
    firstName: "Sarah",
    lastName: "Johnson",
    fullName: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+234-803-234-5678",
    alternatePhone: "+234-803-876-5432",
    gender: "Female",
    status: "Active" as const,
    kycStatus: "Approved" as const,
    kycCompletionPercentage: 100,
    assignedAgentName: "Michael Chen",
    address: "123 Lagos Street, Victoria Island",
    city: "Lagos",
    state: "Lagos",
    country: "Nigeria",
    createdAt: new Date("2024-01-10"),
    totalPropertiesOwned: 2,
    totalSpent: 15000000,
    enrollments: [
      { id: "1", propertyName: "Lekki Gardens Phase 2", status: "Ongoing", amount: 5000000 },
      { id: "2", propertyName: "Ikoyi Heights", status: "Completed", amount: 10000000 },
    ],
  }

  const statusColors: Record<string, string> = {
    Active: "bg-green-500",
    Inactive: "bg-gray-500",
    Suspended: "bg-red-500",
  }

  const kycColors: Record<string, string> = {
    Pending: "bg-yellow-500",
    Approved: "bg-green-500",
    Rejected: "bg-red-500",
    Incomplete: "bg-orange-500",
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={client.fullName}
        description={`Client #${clientId}`}
        actions={
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Client
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{client.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{client.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{client.city}, {client.state}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Assigned Agent</p>
                    <p className="font-medium">{client.assignedAgentName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Joined</p>
                    <p className="font-medium">{format(client.createdAt, "PPP")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">KYC Status</p>
                    <Badge className={kycColors[client.kycStatus]}>
                      {client.kycStatus}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs: Enrollments, Documents, Activity */}
          <Tabs defaultValue="enrollments">
            <TabsList>
              <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="enrollments">
              <Card>
                <CardHeader>
                  <CardTitle>Property Enrollments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {client.enrollments.map((enrollment) => (
                      <div key={enrollment.id} className="p-4 border rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-medium">{enrollment.propertyName}</p>
                          <p className="text-sm text-muted-foreground">
                            ₦{enrollment.amount.toLocaleString()}
                          </p>
                        </div>
                        <Badge variant={enrollment.status === "Completed" ? "default" : "secondary"}>
                          {enrollment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">No documents available</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={statusColors[client.status]}>
                {client.status}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Properties Owned</p>
                <p className="text-2xl font-bold">{client.totalPropertiesOwned}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">₦{client.totalSpent.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                Create Enrollment
              </Button>
              <Button className="w-full" variant="outline">
                Send Message
              </Button>
              <Button className="w-full" variant="outline">
                View KYC
              </Button>
              <Button className="w-full" variant="outline">
                Add Note
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
