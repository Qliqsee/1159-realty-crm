"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, FileText, DollarSign, Calendar, User, Home, Download, Send, CheckCircle, AlertCircle } from "lucide-react"
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
interface Invoice {
  id: string
  invoiceNumber: string
  enrollmentId: string
  enrollmentNumber: string
  clientId: string
  clientName: string
  propertyId: string
  propertyName: string
  amount: number
  penaltyAmount: number
  totalAmount: number
  paidAmount: number
  balanceAmount: number
  issueDate: Date
  dueDate: Date
  paidDate?: Date
  resolvedDate?: Date
  status: "Pending" | "Paid" | "Overdue" | "Resolved"
  isResolved: boolean
  isOverdue: boolean
  overdueDays: number
  paymentMethod?: string
  paymentReference?: string
  installmentNumber?: number
  notes?: string
  createdAt: Date
  updatedAt: Date
  createdBy: string
  resolvedBy?: string
}

interface PaymentHistory {
  id: string
  invoiceId: string
  amount: number
  paymentDate: Date
  paymentMethod: string
  reference: string
  remarks?: string
}

export default function InvoiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const invoiceId = params.id as string
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - will be replaced with API call
  const invoice: Invoice = {
    id: invoiceId,
    invoiceNumber: "INV-2024-001",
    enrollmentId: "enrollment-1",
    enrollmentNumber: "ENR-001",
    clientId: "client-1",
    clientName: "Sarah Johnson",
    propertyId: "property-1",
    propertyName: "Lekki Gardens Phase 2",
    amount: 500000,
    penaltyAmount: 25000,
    totalAmount: 525000,
    paidAmount: 200000,
    balanceAmount: 325000,
    issueDate: new Date("2024-11-01"),
    dueDate: new Date("2024-11-30"),
    status: "Overdue",
    isResolved: false,
    isOverdue: true,
    overdueDays: 32,
    installmentNumber: 3,
    notes: "Monthly installment payment for November 2024",
    createdAt: new Date("2024-11-01"),
    updatedAt: new Date("2024-12-02"),
    createdBy: "agent-1",
  }

  const paymentHistory: PaymentHistory[] = [
    {
      id: "pmt-1",
      invoiceId: invoiceId,
      amount: 200000,
      paymentDate: new Date("2024-11-15"),
      paymentMethod: "Bank Transfer",
      reference: "TRF-20241115-001",
      remarks: "Partial payment received",
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
          <p className="text-sm text-muted-foreground">Loading invoice...</p>
        </div>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    Pending: "bg-yellow-500",
    Paid: "bg-green-500",
    Overdue: "bg-red-500",
    Resolved: "bg-blue-500",
  }

  const paymentPercentage = (invoice.paidAmount / invoice.totalAmount) * 100

  return (
    <div className="space-y-6">
      <PageHeader
        title={invoice.invoiceNumber}
        description={`${invoice.clientName} - ${invoice.propertyName}`}
        actions={
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button size="sm" onClick={() => router.push(`/invoices/${invoiceId}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Client</p>
                    <p className="font-medium">{invoice.clientName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Home className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Property</p>
                    <p className="font-medium">{invoice.propertyName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Enrollment</p>
                    <p className="font-medium">{invoice.enrollmentNumber}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Issue Date</p>
                    <p className="font-medium">{format(invoice.issueDate, "PPP")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Due Date</p>
                    <p className="font-medium">{format(invoice.dueDate, "PPP")}</p>
                  </div>
                </div>

                {invoice.installmentNumber && (
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Installment</p>
                      <p className="font-medium">#{invoice.installmentNumber}</p>
                    </div>
                  </div>
                )}
              </div>

              {invoice.isOverdue && (
                <>
                  <Separator />
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-900 dark:text-red-100">Overdue Invoice</p>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        This invoice is {invoice.overdueDays} days overdue
                      </p>
                    </div>
                  </div>
                </>
              )}

              {invoice.notes && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Notes</h4>
                    <p className="text-sm text-muted-foreground">{invoice.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Amount Breakdown Card */}
          <Card>
            <CardHeader>
              <CardTitle>Amount Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Invoice Amount</span>
                  <span className="text-lg font-semibold">₦{invoice.amount.toLocaleString()}</span>
                </div>
                {invoice.penaltyAmount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Penalty Amount</span>
                    <span className="text-lg font-semibold text-red-600">
                      ₦{invoice.penaltyAmount.toLocaleString()}
                    </span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Amount</span>
                  <span className="text-2xl font-bold">₦{invoice.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Paid Amount</span>
                  <span className="text-lg font-semibold text-green-600">
                    ₦{invoice.paidAmount.toLocaleString()}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-medium text-lg">Balance</span>
                  <span className="text-2xl font-bold text-orange-600">
                    ₦{invoice.balanceAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment Progress</span>
                  <span className="font-medium">{paymentPercentage.toFixed(0)}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${paymentPercentage}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Section */}
          <Tabs defaultValue="payments">
            <TabsList>
              <TabsTrigger value="payments">Payment History</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  {paymentHistory.length > 0 ? (
                    <div className="space-y-3">
                      {paymentHistory.map((payment) => (
                        <div
                          key={payment.id}
                          className="p-4 rounded-lg bg-muted/50 space-y-2"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">₦{payment.amount.toLocaleString()}</p>
                              <p className="text-sm text-muted-foreground">
                                {format(payment.paymentDate, "PPP")}
                              </p>
                            </div>
                            <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20">
                              {payment.paymentMethod}
                            </Badge>
                          </div>
                          <div className="text-sm">
                            <p className="text-muted-foreground">
                              Reference: <span className="font-mono">{payment.reference}</span>
                            </p>
                            {payment.remarks && (
                              <p className="text-muted-foreground italic">{payment.remarks}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No payments received yet</p>
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
                        <p className="font-medium">Invoice Created</p>
                        <p className="text-sm text-muted-foreground">
                          {format(invoice.createdAt, "PPP 'at' p")}
                        </p>
                      </div>
                    </div>
                    {paymentHistory.map((payment) => (
                      <div key={payment.id} className="flex gap-3">
                        <div className="w-2 h-2 mt-2 rounded-full bg-green-500" />
                        <div>
                          <p className="font-medium">Payment Received - ₦{payment.amount.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(payment.paymentDate, "PPP 'at' p")}
                          </p>
                        </div>
                      </div>
                    ))}
                    {invoice.updatedAt.getTime() !== invoice.createdAt.getTime() && (
                      <div className="flex gap-3">
                        <div className="w-2 h-2 mt-2 rounded-full bg-yellow-500" />
                        <div>
                          <p className="font-medium">Invoice Updated</p>
                          <p className="text-sm text-muted-foreground">
                            {format(invoice.updatedAt, "PPP 'at' p")}
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
              <Badge className={statusColors[invoice.status]}>
                {invoice.status}
              </Badge>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {invoice.status !== "Paid" && (
                <Button className="w-full" variant="outline">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Record Payment
                </Button>
              )}
              <Button className="w-full" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button className="w-full" variant="outline">
                <Send className="h-4 w-4 mr-2" />
                Send Reminder
              </Button>
              {invoice.status !== "Paid" && invoice.balanceAmount === 0 && (
                <Button className="w-full" variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Paid
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
                <p className="text-muted-foreground">Created</p>
                <p className="font-medium">{format(invoice.createdAt, "PPP")}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p className="font-medium">{format(invoice.updatedAt, "PPP")}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">Created By</p>
                <p className="font-medium">{invoice.createdBy}</p>
              </div>
              {invoice.paidDate && (
                <>
                  <Separator />
                  <div>
                    <p className="text-muted-foreground">Paid Date</p>
                    <p className="font-medium">{format(invoice.paidDate, "PPP")}</p>
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
