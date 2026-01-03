"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, User, DollarSign, FileText, Calendar, CheckCircle, XCircle, Building, Download } from "lucide-react"
import { Button } from "@/components/buttons/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/card"
import { Badge } from "@/components/badges/badge"
import { Separator } from "@/components/display/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/navigation/tabs"
import { PageHeader } from "@/components/layout/page-header"
import { format } from "date-fns"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface Release {
  id: string
  releaseNumber: string
  type: "Commission" | "Revocation"
  recipientId: string
  recipientName: string
  recipientType?: "Agent" | "Partner" | "Client"
  amount: number
  currency: string
  bankName?: string
  accountNumber?: string
  accountName?: string
  reason: string
  description?: string
  status: "Submitted" | "Pending" | "Paid"
  requestedByName: string
  requestedAt: Date
  approvedByName?: string
  approvedAt?: Date
  paidByName?: string
  paidAt?: Date
  paymentReference?: string
  paymentMethod?: string
  rejectedByName?: string
  rejectedAt?: Date
  rejectionReason?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export default function ReleaseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const releaseId = params.id as string
  const [isLoading, setIsLoading] = useState(true)

  const release: Release = {
    id: releaseId,
    releaseNumber: "REL-2024-001",
    type: "Commission",
    recipientId: "agent-1",
    recipientName: "Michael Chen",
    recipientType: "Agent",
    amount: 1500000,
    currency: "NGN",
    bankName: "GTBank",
    accountNumber: "0123456789",
    accountName: "Michael Chen",
    reason: "Commission payment for 5 enrollments",
    description: "Monthly commission release for November 2024",
    status: "Pending",
    requestedByName: "John Admin",
    requestedAt: new Date("2024-12-01"),
    notes: "Approved by management",
    createdAt: new Date("2024-12-01"),
    updatedAt: new Date("2024-12-02"),
  }

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-primary to-yellow-600 animate-pulse mb-4" />
          <p className="text-sm text-muted-foreground">Loading release...</p>
        </div>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    Submitted: "bg-blue-500",
    Pending: "bg-yellow-500",
    Paid: "bg-green-500",
  }

  const typeColors: Record<string, string> = {
    Commission: "bg-green-500",
    Revocation: "bg-orange-500",
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={release.releaseNumber}
        description={`${release.type} Release · ₦${release.amount.toLocaleString()}`}
        actions={
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Release Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <Badge className={typeColors[release.type]}>{release.type}</Badge>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Recipient</p>
                    <p className="font-medium">{release.recipientName}</p>
                    {release.recipientType && (
                      <p className="text-xs text-muted-foreground">{release.recipientType}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-medium text-lg">₦{release.amount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Requested Date</p>
                    <p className="font-medium">{format(release.requestedAt, "PPP")}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Reason</h4>
                <p className="text-sm text-muted-foreground">{release.reason}</p>
              </div>

              {release.description && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{release.description}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {(release.bankName || release.accountNumber) && (
            <Card>
              <CardHeader>
                <CardTitle>Bank Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  {release.bankName && (
                    <div>
                      <p className="text-sm text-muted-foreground">Bank Name</p>
                      <p className="font-medium">{release.bankName}</p>
                    </div>
                  )}
                  {release.accountNumber && (
                    <div>
                      <p className="text-sm text-muted-foreground">Account Number</p>
                      <p className="font-medium font-mono">{release.accountNumber}</p>
                    </div>
                  )}
                  {release.accountName && (
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Account Name</p>
                      <p className="font-medium">{release.accountName}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {release.status === "Paid" && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900 dark:text-green-100">Release Paid</p>
                      {release.paidAt && (
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Paid on {format(release.paidAt, "PPP")}
                        </p>
                      )}
                    </div>
                  </div>
                  {(release.paymentMethod || release.paymentReference) && (
                    <div className="grid grid-cols-2 gap-4">
                      {release.paymentMethod && (
                        <div>
                          <p className="text-sm text-muted-foreground">Method</p>
                          <p className="font-medium">{release.paymentMethod}</p>
                        </div>
                      )}
                      {release.paymentReference && (
                        <div>
                          <p className="text-sm text-muted-foreground">Reference</p>
                          <p className="font-mono text-sm">{release.paymentReference}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

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
                        <p className="font-medium">Release Requested</p>
                        <p className="text-sm text-muted-foreground">
                          {format(release.requestedAt, "PPP 'at' p")} by {release.requestedByName}
                        </p>
                      </div>
                    </div>
                    {release.approvedAt && (
                      <div className="flex gap-3">
                        <div className="w-2 h-2 mt-2 rounded-full bg-green-500" />
                        <div>
                          <p className="font-medium">Release Approved</p>
                          <p className="text-sm text-muted-foreground">
                            {format(release.approvedAt, "PPP 'at' p")}
                            {release.approvedByName && ` by ${release.approvedByName}`}
                          </p>
                        </div>
                      </div>
                    )}
                    {release.paidAt && (
                      <div className="flex gap-3">
                        <div className="w-2 h-2 mt-2 rounded-full bg-green-500" />
                        <div>
                          <p className="font-medium">Payment Processed</p>
                          <p className="text-sm text-muted-foreground">
                            {format(release.paidAt, "PPP 'at' p")}
                            {release.paidByName && ` by ${release.paidByName}`}
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

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={statusColors[release.status]}>{release.status}</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {release.status === "Pending" && (
                <>
                  <Button className="w-full" variant="outline">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Release
                  </Button>
                  <Button className="w-full" variant="outline">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Process Payment
                  </Button>
                  <Button className="w-full text-red-600" variant="outline">
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Release
                  </Button>
                </>
              )}
              <Button className="w-full" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Details
              </Button>
              <Button className="w-full" variant="outline">
                <User className="h-4 w-4 mr-2" />
                View Recipient
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Requested By</p>
                <p className="font-medium">{release.requestedByName}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">Created</p>
                <p className="font-medium">{format(release.createdAt, "PPP")}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p className="font-medium">{format(release.updatedAt, "PPP")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
