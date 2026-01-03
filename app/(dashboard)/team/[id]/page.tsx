"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, Mail, Phone, Shield, Calendar, Clock, TrendingUp, Users, Home, DollarSign, UserX, UserCheck, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/common/page-header"
import { format } from "date-fns"
import { useEffect, useState } from "react"
import { toast } from "sonner"

// Mock data - will be replaced with API call
interface ActivityLog {
  id: string
  action: string
  description: string
  timestamp: Date
  type: "Login" | "Create" | "Update" | "Delete" | "Other"
}

export default function TeamMemberDetailPage() {
  const params = useParams()
  const router = useRouter()
  const memberId = params.id as string
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - will be replaced with API call
  const member = {
    id: memberId,
    email: "michael.chen@1159realty.com",
    firstName: "Michael",
    lastName: "Chen",
    fullName: "Michael Chen",
    phone: "+234-803-345-6789",
    avatar: undefined,
    role: "Agent" as const,
    status: "Active" as const,
    department: "Sales",
    createdAt: new Date("2024-01-05"),
    lastLogin: new Date("2026-01-02T09:15:00"),
    permissions: [
      "view:lead",
      "create:lead",
      "update:lead",
      "view:client",
      "create:client",
      "view:property",
      "create:enrollment",
      "view:enrollment",
      "update:enrollment",
    ],
  }

  const statistics = {
    totalLeads: 45,
    convertedLeads: 23,
    conversionRate: 51,
    totalEnrollments: 23,
    totalRevenue: 125000000,
    activeClients: 18,
    monthlyTarget: 20,
    monthlyAchieved: 12,
    targetProgress: 60,
  }

  const activityLog: ActivityLog[] = [
    {
      id: "1",
      action: "Created Enrollment",
      description: "Created enrollment ENR-045 for Sarah Johnson",
      timestamp: new Date("2026-01-02T08:30:00"),
      type: "Create",
    },
    {
      id: "2",
      action: "Updated Client",
      description: "Updated client information for Michael Ade",
      timestamp: new Date("2026-01-01T16:45:00"),
      type: "Update",
    },
    {
      id: "3",
      action: "Logged In",
      description: "Logged into the system",
      timestamp: new Date("2026-01-01T09:00:00"),
      type: "Login",
    },
    {
      id: "4",
      action: "Created Lead",
      description: "Added new lead - Chioma Nwankwo",
      timestamp: new Date("2025-12-30T14:20:00"),
      type: "Create",
    },
    {
      id: "5",
      action: "Updated Enrollment",
      description: "Updated payment status for ENR-042",
      timestamp: new Date("2025-12-29T11:15:00"),
      type: "Update",
    },
  ]

  const permissions = [
    { category: "Leads", perms: ["view:lead", "create:lead", "update:lead"] },
    { category: "Clients", perms: ["view:client", "create:client"] },
    { category: "Properties", perms: ["view:property"] },
    { category: "Enrollments", perms: ["view:enrollment", "create:enrollment", "update:enrollment"] },
  ]

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 500)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-primary to-yellow-600 animate-pulse mb-4" />
          <p className="text-sm text-muted-foreground">Loading team member...</p>
        </div>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    Active: "bg-green-500",
    Inactive: "bg-gray-500",
    Suspended: "bg-red-500",
  }

  const actionTypeColors: Record<string, string> = {
    Login: "bg-blue-500",
    Create: "bg-green-500",
    Update: "bg-yellow-500",
    Delete: "bg-red-500",
    Other: "bg-gray-500",
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={member.fullName}
        description={`${member.role} - ${member.department}`}
        actions={
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button size="sm" onClick={() => router.push(`/team/${memberId}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-yellow-600 flex items-center justify-center text-white text-2xl font-bold">
                  {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{member.fullName}</h3>
                  <p className="text-muted-foreground">{member.role}</p>
                  <Badge className={statusColors[member.status]} className="mt-1">
                    {member.status}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-sm">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{member.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="font-medium">{member.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-medium">{member.department}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Joined</p>
                    <p className="font-medium">{format(member.createdAt, "PPP")}</p>
                  </div>
                </div>

                {member.lastLogin && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Last Login</p>
                      <p className="font-medium">{format(member.lastLogin, "PPp")}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Performance Statistics Card */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <p className="text-sm text-muted-foreground">Total Leads</p>
                  </div>
                  <p className="text-2xl font-bold">{statistics.totalLeads}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {statistics.conversionRate}% conversion rate
                  </p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Home className="h-5 w-5 text-primary" />
                    <p className="text-sm text-muted-foreground">Enrollments</p>
                  </div>
                  <p className="text-2xl font-bold">{statistics.totalEnrollments}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {statistics.activeClients} active clients
                  </p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                  </div>
                  <p className="text-2xl font-bold">₦{(statistics.totalRevenue / 1000000).toFixed(0)}M</p>
                  <p className="text-xs text-muted-foreground mt-1">Lifetime value</p>
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Monthly Target Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {statistics.monthlyAchieved} / {statistics.monthlyTarget} deals
                  </span>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full transition-all"
                    style={{ width: `${statistics.targetProgress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {statistics.targetProgress}% complete
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Section */}
          <Tabs defaultValue="permissions">
            <TabsList>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
            </TabsList>

            <TabsContent value="permissions">
              <Card>
                <CardHeader>
                  <CardTitle>Role Permissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {permissions.map((group, index) => (
                      <div key={index} className="p-4 bg-muted/30 rounded-lg">
                        <h4 className="font-medium mb-3">{group.category}</h4>
                        <div className="flex flex-wrap gap-2">
                          {group.perms.map((perm) => (
                            <Badge key={perm} variant="outline" className="text-xs font-mono">
                              {perm}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="text-sm text-muted-foreground">
                      Total Permissions: {member.permissions.length}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activityLog.map((log) => (
                      <div key={log.id} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="flex-shrink-0">
                          <Badge className={actionTypeColors[log.type]} className="text-xs">
                            {log.type}
                          </Badge>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{log.action}</p>
                          <p className="text-sm text-muted-foreground">{log.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(log.timestamp, "PPp")}
                          </p>
                        </div>
                      </div>
                    ))}
                    {activityLog.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No activity yet
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
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Account Status</p>
                <Badge className={statusColors[member.status]}>{member.status}</Badge>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">Role</p>
                <Badge variant="outline">{member.role}</Badge>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">Permissions</p>
                <p className="font-medium">{member.permissions.length} permissions</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" onClick={() => router.push(`/team/${memberId}/edit`)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button className="w-full" variant="outline" onClick={() => toast.info("Opening permissions manager...")}>
                <Settings className="h-4 w-4 mr-2" />
                Manage Permissions
              </Button>
              <Button className="w-full" variant="outline" onClick={() => window.location.href = `mailto:${member.email}`}>
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              {member.status === "Active" && (
                <Button className="w-full" variant="outline" className="text-red-600" onClick={() => toast.error("Deactivating user...")}>
                  <UserX className="h-4 w-4 mr-2" />
                  Deactivate Account
                </Button>
              )}
              {member.status === "Inactive" && (
                <Button className="w-full" variant="outline" className="text-green-600" onClick={() => toast.success("Activating user...")}>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Activate Account
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Meta Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Member Since</p>
                <p className="font-medium">{format(member.createdAt, "PPP")}</p>
              </div>
              <Separator />
              {member.lastLogin && (
                <>
                  <div>
                    <p className="text-muted-foreground">Last Login</p>
                    <p className="font-medium">{format(member.lastLogin, "PPP")}</p>
                    <p className="text-xs text-muted-foreground">{format(member.lastLogin, "p")}</p>
                  </div>
                  <Separator />
                </>
              )}
              <div>
                <p className="text-muted-foreground">Department</p>
                <p className="font-medium">{member.department}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">Total Activities</p>
                <p className="font-medium">{activityLog.length} recent actions</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
