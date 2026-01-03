"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, User, Home, DollarSign, FileText, Calendar, CheckCircle, XCircle, Download, Percent } from "lucide-react"
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
interface Commission {
  id: string
  recipientId: string
  recipientName: string
  recipientType: "Agent" | "Partner"
  enrollmentId: string
  enrollmentNumber: string
  clientId: string
  clientName: string
  propertyId: string
  propertyName: string
  saleAmount: number
  commissionPercentage: number
  commissionAmount: number
  status: "Pending" | "Paid" | "Cancelled"
  paidDate?: Date
  paidByName?: string
  paymentReference?: string
  paymentMethod?: string
  cancelledDate?: Date
  cancelledByName?: string
  cancellationReason?: string
  earnedDate: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export default function CommissionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const commissionId = params.id as string
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - will be replaced with API call
  const commission: Commission = {
    id: commissionId,
    recipientId: "agent-1",
    recipientName: "Michael Chen",
    recipientType: "Agent",
    enrollmentId: "enrollment-1",
    enrollmentNumber: "ENR-001",
    clientId: "client-1",
    clientName: "Sarah Johnson",
    propertyId: "property-1",
    propertyName: "Lekki Gardens Phase 2",
    saleAmount: 5000000,
    commissionPercentage: 7,
    commissionAmount: 350000,
    status: "Pending",
    earnedDate: new Date("2024-12-01"),
    notes: "Commission for completed enrollment payment",
    createdAt: new Date("2024-12-01"),
    updatedAt: new Date("2024-12-02"),
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
          <p className="text-sm text-muted-foreground">Loading commission...</p>
        </div>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    Pending: "bg-yellow-500",
    Paid: "bg-green-500",
    Cancelled: "bg-red-500",
  }

  const typeColors: Record<string, string> = {
    Agent: "bg-blue-500",
    Partner: "bg-purple-500",
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Commission - ${commission.recipientName}`}
        description={`${commission.recipientType} · ₦${commission.commissionAmount.toLocaleString()}`}
        actions={
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button size="sm" onClick={() => router.push(`/commissions/${commissionId}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Commission Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Commission Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Recipient</p>
                    <p className="font-medium">{commission.recipientName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Recipient Type</p>
                    <Badge className={typeColors[commission.recipientType]}>
                      {commission.recipientType}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Client</p>
                    <p className="font-medium">{commission.clientName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Home className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Property</p>
                    <p className="font-medium">{commission.propertyName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Enrollment</p>
                    <p className="font-medium">{commission.enrollmentNumber}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Earned Date</p>
                    <p className="font-medium">{format(commission.earnedDate, "PPP")}</p>
                  </div>
                </div>
              </div>

              {commission.notes && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Notes</h4>
                    <p className="text-sm text-muted-foreground">{commission.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Calculation Breakdown Card */}
          <Card>
            <CardHeader>
              <CardTitle>Calculation Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Sale Amount</span>
                  <span className="text-lg font-semibold">₦{commission.saleAmount.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Percent className="h-5 w-5 text-primary" />
                    <span className="font-medium">Commission Rate</span>
                  </div>
                  <span className="text-xl font-bold text-primary">
                    {commission.commissionPercentage}%
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-medium text-lg">Commission Amount</span>
                  <span className="text-2xl font-bold text-green-600">
                    ₦{commission.commissionAmount.toLocaleString()}
                  </span>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Calculation: ₦{commission.saleAmount.toLocaleString()} × {commission.commissionPercentage}% = ₦{commission.commissionAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          {commission.status === "Paid" && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-green-900 dark:text-green-100">
                        Commission Paid
                      </p>
                      {commission.paidDate && (
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Paid on {format(commission.paidDate, "PPP")}
                        </p>
                      )}
                      {commission.paidByName && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                          Processed by {commission.paidByName}
                        </p>
                      )}
                    </div>
                  </div>

                  {(commission.paymentMethod || commission.paymentReference) && (
                    <>
                      <Separator className="my-3" />
                      <div className="grid grid-cols-2 gap-4">
                        {commission.paymentMethod && (
                          <div>
                            <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                              Payment Method
                            </p>
                            <p className="text-sm text-green-700 dark:text-green-300">
                              {commission.paymentMethod}
                            </p>
                          </div>
                        )}
                        {commission.paymentReference && (
                          <div>
                            <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                              Reference
                            </p>
                            <p className="text-sm font-mono text-green-700 dark:text-green-300">
                              {commission.paymentReference}
                            </p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cancellation Details */}
          {commission.status === "Cancelled" && commission.cancellationReason && (
            <Card>
              <CardHeader>
                <CardTitle>Cancellation Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-red-900 dark:text-red-100">
                        Commission Cancelled
                      </p>
                      {commission.cancelledDate && (
                        <p className="text-sm text-red-700 dark:text-red-300">
                          Cancelled on {format(commission.cancelledDate, "PPP")}
                        </p>
                      )}
                      {commission.cancelledByName && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                          By {commission.cancelledByName}
                        </p>
                      )}
                    </div>
                  </div>

                  <Separator className="my-3" />
                  <div>
                    <p className="text-sm font-medium text-red-900 dark:text-red-100 mb-1">
                      Reason
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {commission.cancellationReason}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tabs Section */}
          <Tabs defaultValue="timeline">
            <TabsList>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

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
                        <p className="font-medium">Commission Earned</p>
                        <p className="text-sm text-muted-foreground">
                          {format(commission.earnedDate, "PPP 'at' p")}
                        </p>
                      </div>
                    </div>
                    {commission.paidDate && (
                      <div className="flex gap-3">
                        <div className="w-2 h-2 mt-2 rounded-full bg-green-500" />
                        <div>
                          <p className="font-medium">Commission Paid</p>
                          <p className="text-sm text-muted-foreground">
                            {format(commission.paidDate, "PPP 'at' p")}
                          </p>
                        </div>
                      </div>
                    )}
                    {commission.cancelledDate && (
                      <div className="flex gap-3">
                        <div className="w-2 h-2 mt-2 rounded-full bg-red-500" />
                        <div>
                          <p className="font-medium">Commission Cancelled</p>
                          <p className="text-sm text-muted-foreground">
                            {format(commission.cancelledDate, "PPP 'at' p")}
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
              <Badge className={statusColors[commission.status]}>
                {commission.status}
              </Badge>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {commission.status === "Pending" && (
                <>
                  <Button className="w-full" variant="outline">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve & Pay
                  </Button>
                  <Button className="w-full text-red-600" variant="outline">
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Commission
                  </Button>
                </>
              )}
              <Button className="w-full" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Statement
              </Button>
              <Button className="w-full" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                View Enrollment
              </Button>
              <Button className="w-full" variant="outline">
                <User className="h-4 w-4 mr-2" />
                View {commission.recipientType} Profile
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
                <p className="font-medium">{format(commission.createdAt, "PPP")}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p className="font-medium">{format(commission.updatedAt, "PPP")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
