"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, FileText, DollarSign, Calendar, User, Home, Download } from "lucide-react"
import { Button } from "@/components/buttons/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/card"
import { Badge } from "@/components/badges/badge"
import { Separator } from "@/components/display/separator"
import { Progress } from "@/components/feedback/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/navigation/tabs"
import { PageHeader } from "@/components/layout/page-header"
import { generateOfferLetter, generatePaymentReceipt, generateAllocationLetter } from "@/lib/pdf/enrollment-pdfs"
import { format } from "date-fns"

export default function EnrollmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const enrollmentId = params.id as string

  // Mock data - will be replaced with API call
  const enrollment = {
    id: enrollmentId,
    enrollmentNumber: "ENR-001",
    clientId: "client-1",
    clientName: "Sarah Johnson",
    propertyId: "property-1",
    propertyName: "Lekki Gardens Phase 2",
    propertyType: "Land",
    agentId: "agent-1",
    agentName: "Michael Chen",
    enrollmentType: "Company Lead" as const,
    totalAmount: 5000000,
    amountPaid: 2000000,
    amountPending: 3000000,
    interestAmount: 0,
    penaltyAmount: 0,
    discountAmount: 500000,
    finalAmount: 4500000,
    progressPercentage: 40,
    status: "Ongoing" as const,
    paymentType: "Installment" as const,
    installmentDuration: 12,
    installmentMonthlyAmount: 375000,
    interestRate: 5,
    overduepenaltyRate: 2,
    startDate: new Date("2024-01-15"),
    expectedCompletionDate: new Date("2025-01-15"),
    plotNumber: "A-101",
    selectedSizeId: "size-1",
    selectedSize: 500,
    selectedSizeUnit: "sqm",
    notes: [],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    createdBy: "user-1",
  }

  const statusColors: Record<string, string> = {
    Ongoing: "bg-blue-500",
    Completed: "bg-green-500",
    Cancelled: "bg-red-500",
    Frozen: "bg-gray-500",
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={enrollment.enrollmentNumber}
        description={`${enrollment.clientName} - ${enrollment.propertyName}`}
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
              <CardTitle>Enrollment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Client</p>
                    <p className="font-medium">{enrollment.clientName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Home className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Property</p>
                    <p className="font-medium">{enrollment.propertyName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Plot Number</p>
                    <p className="font-medium">{enrollment.plotNumber}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Agent</p>
                    <p className="font-medium">{enrollment.agentName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium">{format(enrollment.startDate, "PPP")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Expected Completion</p>
                    <p className="font-medium">{format(enrollment.expectedCompletionDate, "PPP")}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Payment Progress</span>
                  <span className="text-sm font-medium">{enrollment.progressPercentage}%</span>
                </div>
                <Progress value={enrollment.progressPercentage} />
              </div>

              <Separator />

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-xl font-bold">₦{enrollment.totalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount Paid</p>
                  <p className="text-xl font-bold text-green-600">₦{enrollment.amountPaid.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount Pending</p>
                  <p className="text-xl font-bold text-orange-600">₦{enrollment.amountPending.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="payments">
            <TabsList>
              <TabsTrigger value="payments">Payment Schedule</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle>Installment Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Payment schedule details will appear here</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="invoices">
              <Card>
                <CardHeader>
                  <CardTitle>Invoices</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Invoice list will appear here</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Timeline events will appear here</p>
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
              <Badge className={statusColors[enrollment.status]}>
                {enrollment.status}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                <DollarSign className="h-4 w-4 mr-2" />
                Record Payment
              </Button>
              <Button className="w-full" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Generate Invoice
              </Button>
              <Button className="w-full" variant="outline">
                Freeze Enrollment
              </Button>
              <Button className="w-full text-red-600" variant="outline">
                Cancel Enrollment
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full"
                variant="outline"
                onClick={() => generateOfferLetter(enrollment)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Offer Letter
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => generatePaymentReceipt(
                  enrollment,
                  enrollment.amountPaid,
                  new Date(),
                  "Bank Transfer",
                  `RCT-${enrollment.enrollmentNumber}`
                )}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Payment Receipt
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => generateAllocationLetter(enrollment)}
                disabled={!enrollment.plotNumber}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Allocation Letter
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
