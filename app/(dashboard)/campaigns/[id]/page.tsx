"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, Send, Users, Tag, Filter, Download, Mail, MessageSquare, Bell } from "lucide-react"
import { Button } from "@/components/buttons/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/card"
import { Badge } from "@/components/badges/badge"
import { Separator } from "@/components/display/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/navigation/tabs"
import { PageHeader } from "@/components/layout/page-header"
import { format } from "date-fns"
import { useEffect, useState } from "react"
import { toast } from "sonner"

// Mock data - will be replaced with API call
interface Contact {
  id: string
  name: string
  email: string
  phone: string
  type: "Client" | "Lead" | "Partner"
  status: "Active" | "Inactive"
}

interface SendHistory {
  id: string
  type: "Email" | "SMS" | "Push Notification"
  subject: string
  sentAt: Date
  recipientCount: number
  deliveredCount: number
  openedCount: number
  clickedCount: number
  status: "Sent" | "Scheduled" | "Failed"
}

export default function CampaignDetailPage() {
  const params = useParams()
  const router = useRouter()
  const campaignId = params.id as string
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - will be replaced with API call
  const campaign = {
    id: campaignId,
    name: "High Value Clients",
    description: "Clients with total spend > ₦10M for targeted VIP communications",
    filters: [
      { field: "totalSpend", operator: "greaterThan", value: "10000000" },
      { field: "status", operator: "equals", value: "Active" },
    ],
    filterLogic: "AND" as const,
    manualContacts: [] as string[],
    totalContacts: 45,
    usageCount: 5,
    tags: ["vip", "high-value", "priority", "premium"],
    createdBy: "user-1",
    createdByName: "Admin User",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-15"),
  }

  const contacts: Contact[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+234 801 234 5678",
      type: "Client",
      status: "Active",
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "michael.chen@email.com",
      phone: "+234 802 345 6789",
      type: "Client",
      status: "Active",
    },
    {
      id: "3",
      name: "Amara Okafor",
      email: "amara.okafor@email.com",
      phone: "+234 803 456 7890",
      type: "Client",
      status: "Active",
    },
  ]

  const sendHistory: SendHistory[] = [
    {
      id: "1",
      type: "Email",
      subject: "Exclusive VIP Property Launch - Phase 3",
      sentAt: new Date("2024-12-15T10:00:00"),
      recipientCount: 45,
      deliveredCount: 44,
      openedCount: 38,
      clickedCount: 22,
      status: "Sent",
    },
    {
      id: "2",
      type: "SMS",
      subject: "Payment Reminder - Year End Special",
      sentAt: new Date("2024-11-30T14:30:00"),
      recipientCount: 45,
      deliveredCount: 45,
      openedCount: 45,
      clickedCount: 18,
      status: "Sent",
    },
    {
      id: "3",
      type: "Push Notification",
      subject: "New Investment Opportunity Available",
      sentAt: new Date("2024-11-15T09:00:00"),
      recipientCount: 45,
      deliveredCount: 42,
      openedCount: 35,
      clickedCount: 15,
      status: "Sent",
    },
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
          <p className="text-sm text-muted-foreground">Loading campaign...</p>
        </div>
      </div>
    )
  }

  const avgOpenRate = sendHistory.length > 0
    ? (sendHistory.reduce((sum, h) => sum + (h.openedCount / h.recipientCount) * 100, 0) / sendHistory.length).toFixed(1)
    : 0

  const avgClickRate = sendHistory.length > 0
    ? (sendHistory.reduce((sum, h) => sum + (h.clickedCount / h.recipientCount) * 100, 0) / sendHistory.length).toFixed(1)
    : 0

  return (
    <div className="space-y-6">
      <PageHeader
        title={campaign.name}
        description={campaign.description || `Campaign segment with ${campaign.totalContacts} contacts`}
        actions={
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button size="sm" onClick={() => router.push(`/campaigns/${campaignId}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Segment Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Segment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Contacts</p>
                    <p className="font-medium text-lg">{campaign.totalContacts}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Send className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Times Used</p>
                    <p className="font-medium text-lg">{campaign.usageCount}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Filter className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Filter Logic</p>
                    <p className="font-medium">{campaign.filterLogic}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Tag className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Tags</p>
                    <p className="font-medium">{campaign.tags.length}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Filters */}
              <div>
                <h4 className="font-medium mb-3">Active Filters</h4>
                <div className="space-y-2">
                  {campaign.filters.map((filter, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm p-2 bg-muted/50 rounded">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{filter.field}</span>
                      <Badge variant="outline" className="text-xs">{filter.operator}</Badge>
                      <span className="text-muted-foreground">{filter.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Tags */}
              <div>
                <h4 className="font-medium mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {campaign.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Section */}
          <Tabs defaultValue="contacts">
            <TabsList>
              <TabsTrigger value="contacts">Contacts ({contacts.length})</TabsTrigger>
              <TabsTrigger value="history">Send History ({sendHistory.length})</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="contacts">
              <Card>
                <CardHeader>
                  <CardTitle>Contact List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {contacts.map((contact) => (
                      <div key={contact.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{contact.name}</p>
                            <Badge variant="outline" className="text-xs">{contact.type}</Badge>
                            <Badge className={`${contact.status === "Active" ? "bg-green-500" : "bg-gray-500"} text-xs`}>
                              {contact.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {contact.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              {contact.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {contacts.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No contacts in this segment
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Send History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sendHistory.map((item) => (
                      <div key={item.id} className="p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {item.type === "Email" && <Mail className="h-5 w-5 text-primary" />}
                            {item.type === "SMS" && <MessageSquare className="h-5 w-5 text-primary" />}
                            {item.type === "Push Notification" && <Bell className="h-5 w-5 text-primary" />}
                            <div>
                              <p className="font-medium">{item.subject}</p>
                              <p className="text-xs text-muted-foreground">{format(item.sentAt, "PPp")}</p>
                            </div>
                          </div>
                          <Badge className="bg-green-500">{item.status}</Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground text-xs">Sent</p>
                            <p className="font-medium">{item.recipientCount}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Delivered</p>
                            <p className="font-medium">{item.deliveredCount}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Opened</p>
                            <p className="font-medium">
                              {item.openedCount} ({((item.openedCount / item.recipientCount) * 100).toFixed(0)}%)
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Clicked</p>
                            <p className="font-medium">
                              {item.clickedCount} ({((item.clickedCount / item.recipientCount) * 100).toFixed(0)}%)
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {sendHistory.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No send history yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground mb-1">Total Sends</p>
                      <p className="text-2xl font-bold">{sendHistory.length}</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground mb-1">Avg. Open Rate</p>
                      <p className="text-2xl font-bold">{avgOpenRate}%</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground mb-1">Avg. Click Rate</p>
                      <p className="text-2xl font-bold">{avgClickRate}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Contacts</span>
                <span className="font-bold">{campaign.totalContacts}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Filters</span>
                <span className="font-bold">{campaign.filters.length}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Times Used</span>
                <span className="font-bold">{campaign.usageCount}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Sends</span>
                <span className="font-bold">{sendHistory.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" onClick={() => toast.success("Opening notification composer...")}>
                <Send className="h-4 w-4 mr-2" />
                Send Notification
              </Button>
              <Button className="w-full" variant="outline" onClick={() => toast.success("Exporting contacts...")}>
                <Download className="h-4 w-4 mr-2" />
                Export Contacts
              </Button>
              <Button className="w-full" variant="outline" onClick={() => router.push(`/campaigns/${campaignId}/edit`)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Segment
              </Button>
              <Button className="w-full" variant="outline" onClick={() => toast.info("Viewing analytics...")}>
                <Filter className="h-4 w-4 mr-2" />
                View Analytics
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
                <p className="text-muted-foreground">Created By</p>
                <p className="font-medium">{campaign.createdByName}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">Created</p>
                <p className="font-medium">{format(campaign.createdAt, "PPP")}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p className="font-medium">{format(campaign.updatedAt, "PPP")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
