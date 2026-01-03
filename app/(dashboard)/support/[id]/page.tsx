"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, MessageSquare, User, Mail, Phone, Clock, CheckCircle2, XCircle, UserCheck, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { PageHeader } from "@/components/common/page-header"
import { format } from "date-fns"
import { useEffect, useState } from "react"
import { toast } from "sonner"

// Mock data - will be replaced with API call
interface TicketMessage {
  id: string
  ticketId: string
  message: string
  sender: "Client" | "Agent" | "System"
  senderName: string
  sentAt: Date
  isInternal: boolean
}

export default function SupportTicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const ticketId = params.id as string
  const [isLoading, setIsLoading] = useState(true)
  const [replyText, setReplyText] = useState("")

  // Mock data - will be replaced with API call
  const ticket = {
    id: ticketId,
    ticketNumber: "TKT-001",
    clientId: "client-1",
    clientName: "Sarah Johnson",
    clientEmail: "sarah.j@example.com",
    clientPhone: "+234-803-234-5678",
    subject: "Payment Issue - Unable to Complete Transaction",
    description: "I'm having trouble completing my monthly installment payment. The payment gateway keeps showing an error message.",
    category: "Payment" as const,
    priority: "High" as const,
    status: "Open" as const,
    assignedTo: undefined,
    assignedToName: undefined,
    assignedAt: undefined,
    resolvedAt: undefined,
    closedAt: undefined,
    resolutionNotes: undefined,
    createdAt: new Date("2024-01-22T10:30:00"),
    updatedAt: new Date("2024-01-22T14:45:00"),
  }

  const messages: TicketMessage[] = [
    {
      id: "1",
      ticketId: ticketId,
      message: "I'm having trouble completing my monthly installment payment. The payment gateway keeps showing an error message. I've tried three times already and each time it fails at the final step. Please help!",
      sender: "Client",
      senderName: "Sarah Johnson",
      sentAt: new Date("2024-01-22T10:30:00"),
      isInternal: false,
    },
    {
      id: "2",
      ticketId: ticketId,
      message: "Hello Sarah, thank you for reaching out. I'm sorry to hear about the payment issue. Can you please provide the error message you're seeing? Also, which payment method are you trying to use?",
      sender: "Agent",
      senderName: "Support Agent",
      sentAt: new Date("2024-01-22T11:15:00"),
      isInternal: false,
    },
    {
      id: "3",
      ticketId: ticketId,
      message: "The error says 'Transaction failed - Please contact your bank'. I'm trying to use my debit card ending in 4567.",
      sender: "Client",
      senderName: "Sarah Johnson",
      sentAt: new Date("2024-01-22T12:00:00"),
      isInternal: false,
    },
    {
      id: "4",
      ticketId: ticketId,
      message: "Internal note: Checked with payment processor. No issues on our end. Likely a bank-side authorization issue.",
      sender: "System",
      senderName: "System",
      sentAt: new Date("2024-01-22T13:30:00"),
      isInternal: true,
    },
    {
      id: "5",
      ticketId: ticketId,
      message: "Thank you for that information. It appears this might be an authorization issue with your bank. Please contact your bank to ensure:\n1. Your card is enabled for online transactions\n2. There are sufficient funds\n3. Your daily transaction limit hasn't been exceeded\n\nAlternatively, you can try using bank transfer or visit our office for in-person payment.",
      sender: "Agent",
      senderName: "Support Agent",
      sentAt: new Date("2024-01-22T14:00:00"),
      isInternal: false,
    },
  ]

  const timeline = [
    { event: "Ticket Created", timestamp: ticket.createdAt, icon: MessageSquare },
    { event: "Agent Responded", timestamp: new Date("2024-01-22T11:15:00"), icon: User },
    { event: "Client Replied", timestamp: new Date("2024-01-22T12:00:00"), icon: MessageSquare },
    { event: "Last Updated", timestamp: ticket.updatedAt, icon: Clock },
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
          <p className="text-sm text-muted-foreground">Loading ticket...</p>
        </div>
      </div>
    )
  }

  const priorityColors: Record<string, string> = {
    Low: "bg-gray-500",
    Medium: "bg-blue-500",
    High: "bg-orange-500",
    Urgent: "bg-red-500",
  }

  const statusColors: Record<string, string> = {
    Open: "bg-blue-500",
    "In Progress": "bg-yellow-500",
    Resolved: "bg-green-500",
    Closed: "bg-gray-500",
  }

  const handleSendReply = () => {
    if (!replyText.trim()) {
      toast.error("Please enter a message")
      return
    }
    toast.success("Reply sent successfully")
    setReplyText("")
  }

  const responseTime = ticket.updatedAt.getTime() - ticket.createdAt.getTime()
  const responseHours = Math.floor(responseTime / (1000 * 60 * 60))

  return (
    <div className="space-y-6">
      <PageHeader
        title={ticket.ticketNumber}
        description={ticket.subject}
        actions={
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button size="sm" onClick(() => router.push(`/support/${ticketId}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Ticket Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Client</p>
                    <p className="font-medium">{ticket.clientName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-sm">{ticket.clientEmail}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{ticket.clientPhone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <Badge variant="outline">{ticket.category}</Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{ticket.description}</p>
              </div>

              {ticket.assignedToName && (
                <>
                  <Separator />
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Assigned To</p>
                      <p className="font-medium">{ticket.assignedToName}</p>
                      {ticket.assignedAt && (
                        <p className="text-xs text-muted-foreground">
                          Assigned {format(ticket.assignedAt, "PPp")}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Tabs Section */}
          <Tabs defaultValue="messages">
            <TabsList>
              <TabsTrigger value="messages">Messages ({messages.filter(m => !m.isInternal).length})</TabsTrigger>
              <TabsTrigger value="all">All ({messages.length})</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle>Conversation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {messages
                      .filter((msg) => !msg.isInternal)
                      .map((message) => (
                        <div
                          key={message.id}
                          className={`p-4 rounded-lg ${
                            message.sender === "Client"
                              ? "bg-muted/30 ml-0 mr-8"
                              : "bg-primary/10 ml-8 mr-0"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                message.sender === "Client" ? "bg-blue-500" : "bg-primary"
                              }`}>
                                <span className="text-white text-xs font-medium">
                                  {message.senderName.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-sm">{message.senderName}</p>
                                <p className="text-xs text-muted-foreground">
                                  {format(message.sentAt, "PPp")}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {message.sender}
                            </Badge>
                          </div>
                          <p className="text-sm whitespace-pre-line">{message.message}</p>
                        </div>
                      ))}
                  </div>

                  {/* Reply Section */}
                  {ticket.status !== "Closed" && (
                    <div className="mt-6 space-y-3">
                      <Separator />
                      <div>
                        <label className="text-sm font-medium mb-2 block">Reply to Ticket</label>
                        <Textarea
                          placeholder="Type your response here..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={4}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSendReply}>
                          <Send className="h-4 w-4 mr-2" />
                          Send Reply
                        </Button>
                        <Button variant="outline" onClick={() => setReplyText("")}>
                          Clear
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>All Messages (Including Internal)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 rounded-lg ${
                          message.isInternal
                            ? "bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800"
                            : message.sender === "Client"
                            ? "bg-muted/30"
                            : "bg-primary/10"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              message.isInternal
                                ? "bg-yellow-500"
                                : message.sender === "Client"
                                ? "bg-blue-500"
                                : "bg-primary"
                            }`}>
                              <span className="text-white text-xs font-medium">
                                {message.senderName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-sm">{message.senderName}</p>
                              <p className="text-xs text-muted-foreground">
                                {format(message.sentAt, "PPp")}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="text-xs">
                              {message.sender}
                            </Badge>
                            {message.isInternal && (
                              <Badge className="bg-yellow-500 text-xs">Internal</Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm whitespace-pre-line">{message.message}</p>
                      </div>
                    ))}
                  </div>
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
                    {timeline.map((item, index) => {
                      const Icon = item.icon
                      return (
                        <div key={index} className="flex gap-3">
                          <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              <p className="font-medium">{item.event}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {format(item.timestamp, "PPp")}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Priority Card */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Current Status</p>
                <Badge className={statusColors[ticket.status]}>{ticket.status}</Badge>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">Priority</p>
                <Badge className={priorityColors[ticket.priority]}>{ticket.priority}</Badge>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">Response Time</p>
                <p className="font-medium">{responseHours}h {Math.floor((responseTime % (1000 * 60 * 60)) / (1000 * 60))}m</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {ticket.status === "Open" && (
                <Button className="w-full" onClick={() => toast.success("Ticket assigned to you")}>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Assign to Me
                </Button>
              )}
              {ticket.status !== "Resolved" && ticket.status !== "Closed" && (
                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => toast.success("Ticket marked as resolved")}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark as Resolved
                </Button>
              )}
              {ticket.status === "Resolved" && (
                <Button className="w-full" onClick={() => toast.success("Ticket closed")}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Close Ticket
                </Button>
              )}
              {ticket.status === "Closed" && (
                <Button className="w-full" variant="outline" onClick={() => toast.success("Ticket reopened")}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Reopen Ticket
                </Button>
              )}
              <Button className="w-full" variant="outline" onClick={() => router.push(`/clients/${ticket.clientId}`)}>
                <User className="h-4 w-4 mr-2" />
                View Client
              </Button>
              <Button className="w-full" variant="outline" onClick={() => router.push(`/support/${ticketId}/edit`)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Ticket
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
                <p className="text-muted-foreground">Ticket Number</p>
                <p className="font-medium font-mono">{ticket.ticketNumber}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">Created</p>
                <p className="font-medium">{format(ticket.createdAt, "PPP")}</p>
                <p className="text-xs text-muted-foreground">{format(ticket.createdAt, "p")}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p className="font-medium">{format(ticket.updatedAt, "PPP")}</p>
                <p className="text-xs text-muted-foreground">{format(ticket.updatedAt, "p")}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">Messages</p>
                <p className="font-medium">{messages.filter(m => !m.isInternal).length} public</p>
                <p className="text-xs text-muted-foreground">{messages.length} total</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
