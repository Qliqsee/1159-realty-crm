"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, FileText, DollarSign, Calendar, User, Home, CheckCircle, XCircle, Image as ImageIcon, Download } from "lucide-react"
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
interface ManualPayment {
  id: string
  clientId: string
  clientName: string
  enrollmentId: string
  enrollmentNumber: string
  invoiceId?: string
  invoiceNumber?: string
  amount: number
  paymentDate: Date
  paymentMethod: string
  transactionReference: string
  receiptUrl?: string
  status: "Pending" | "Approved" | "Rejected"
  reviewedBy?: string
  reviewedByName?: string
  reviewedAt?: Date
  feedback?: string
  rejectionReason?: string
  submittedAt: Date
  resubmittedAt?: Date
  resubmissionCount: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export default function PaymentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const paymentId = params.id as string
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - will be replaced with API call
  const payment: ManualPayment = {
    id: paymentId,
    clientId: "client-1",
    clientName: "Sarah Johnson",
    enrollmentId: "enrollment-1",
    enrollmentNumber: "ENR-001",
    invoiceId: "invoice-1",
    invoiceNumber: "INV-2024-001",
    amount: 500000,
    paymentDate: new Date("2024-12-01"),
    paymentMethod: "Bank Transfer",
    transactionReference: "TRF-20241201-12345",
    receiptUrl: "/receipts/sample-receipt.jpg",
    status: "Pending",
    submittedAt: new Date("2024-12-01"),
    resubmissionCount: 0,
    notes: "Payment for monthly installment - November 2024",
    createdAt: new Date("2024-12-01"),
    updatedAt: new Date("2024-12-01"),
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
          <p className="text-sm text-muted-foreground">Loading payment...</p>
        </div>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    Pending: "bg-yellow-500",
    Approved: "bg-green-500",
    Rejected: "bg-red-500",
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Payment - ${payment.transactionReference}`}
        description={`${payment.clientName} - ₦${payment.amount.toLocaleString()}`}
        actions={
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            {payment.status === "Pending" && (
              <Button size="sm" onClick={() => router.push(`/payments/${paymentId}/edit`)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Client</p>
                    <p className="font-medium">{payment.clientName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Enrollment</p>
                    <p className="font-medium">{payment.enrollmentNumber}</p>
                  </div>
                </div>

                {payment.invoiceNumber && (
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Invoice</p>
                      <p className="font-medium">{payment.invoiceNumber}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-medium text-lg">₦{payment.amount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Date</p>
                    <p className="font-medium">{format(payment.paymentDate, "PPP")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p className="font-medium">{payment.paymentMethod}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Transaction Reference</h4>
                <p className="text-sm font-mono bg-muted p-2 rounded">
                  {payment.transactionReference}
                </p>
              </div>

              {payment.notes && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Notes</h4>
                    <p className="text-sm text-muted-foreground">{payment.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Receipt Card */}
          {payment.receiptUrl && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Receipt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-4">Receipt uploaded</p>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download Receipt
                    </Button>
                  </div>
                  {/* In a real implementation, this would show the actual receipt image */}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Review Section */}
          {(payment.status === "Approved" || payment.status === "Rejected") && (
            <Card>
              <CardHeader>
                <CardTitle>Review Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {payment.status === "Approved" && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-green-900 dark:text-green-100">
                          Payment Approved
                        </p>
                        {payment.reviewedByName && (
                          <p className="text-sm text-green-700 dark:text-green-300">
                            Reviewed by {payment.reviewedByName}
                          </p>
                        )}
                        {payment.reviewedAt && (
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                            {format(payment.reviewedAt, "PPP 'at' p")}
                          </p>
                        )}
                      </div>
                    </div>
                    {payment.feedback && (
                      <>
                        <Separator className="my-3" />
                        <div>
                          <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                            Feedback
                          </p>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            {payment.feedback}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {payment.status === "Rejected" && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-red-900 dark:text-red-100">
                          Payment Rejected
                        </p>
                        {payment.reviewedByName && (
                          <p className="text-sm text-red-700 dark:text-red-300">
                            Reviewed by {payment.reviewedByName}
                          </p>
                        )}
                        {payment.reviewedAt && (
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                            {format(payment.reviewedAt, "PPP 'at' p")}
                          </p>
                        )}
                      </div>
                    </div>
                    {payment.rejectionReason && (
                      <>
                        <Separator className="my-3" />
                        <div>
                          <p className="text-sm font-medium text-red-900 dark:text-red-100 mb-1">
                            Rejection Reason
                          </p>
                          <p className="text-sm text-red-700 dark:text-red-300">
                            {payment.rejectionReason}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}
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
                        <p className="font-medium">Payment Submitted</p>
                        <p className="text-sm text-muted-foreground">
                          {format(payment.submittedAt, "PPP 'at' p")}
                        </p>
                      </div>
                    </div>
                    {payment.resubmittedAt && (
                      <div className="flex gap-3">
                        <div className="w-2 h-2 mt-2 rounded-full bg-yellow-500" />
                        <div>
                          <p className="font-medium">Payment Resubmitted</p>
                          <p className="text-sm text-muted-foreground">
                            {format(payment.resubmittedAt, "PPP 'at' p")}
                          </p>
                        </div>
                      </div>
                    )}
                    {payment.reviewedAt && (
                      <div className="flex gap-3">
                        <div
                          className={`w-2 h-2 mt-2 rounded-full ${
                            payment.status === "Approved" ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        <div>
                          <p className="font-medium">Payment {payment.status}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(payment.reviewedAt, "PPP 'at' p")}
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
            <CardContent className="space-y-3">
              <Badge className={statusColors[payment.status]}>
                {payment.status}
              </Badge>
              {payment.resubmissionCount > 0 && (
                <p className="text-xs text-muted-foreground">
                  Resubmitted {payment.resubmissionCount} time(s)
                </p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {payment.status === "Pending" && (
                <>
                  <Button className="w-full" variant="outline">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Payment
                  </Button>
                  <Button className="w-full" variant="outline" className="text-red-600">
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Payment
                  </Button>
                </>
              )}
              {payment.receiptUrl && (
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  View Receipt
                </Button>
              )}
              <Button className="w-full" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                View Enrollment
              </Button>
              {payment.invoiceId && (
                <Button className="w-full" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View Invoice
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
                <p className="text-muted-foreground">Submitted</p>
                <p className="font-medium">{format(payment.submittedAt, "PPP")}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p className="font-medium">{format(payment.updatedAt, "PPP")}</p>
              </div>
              {payment.reviewedBy && (
                <>
                  <Separator />
                  <div>
                    <p className="text-muted-foreground">Reviewed By</p>
                    <p className="font-medium">{payment.reviewedByName || payment.reviewedBy}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
