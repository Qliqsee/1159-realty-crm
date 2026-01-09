"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Edit,
  FileText,
  DollarSign,
  Calendar,
  User,
  Home,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  Ban,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/buttons/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/card"
import { Badge } from "@/components/badges/badge"
import { Separator } from "@/components/display/separator"
import { Progress } from "@/components/feedback/progress"
import { PageHeader } from "@/components/layout/page-header"
import { Input } from "@/components/inputs/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/dialogs/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/overlays/dropdown-menu"
import { Label } from "@/components/layout/label"
import { Textarea } from "@/components/inputs/textarea"
import { DataTable } from "@/components/data/data-table"
import { StatusBadge } from "@/components/badges/status-badge"
import {
  getEnrollment,
  getPaymentSchedule,
  resolvePaymentInstallment,
  unresolvePaymentInstallment,
  cancelEnrollment,
  updateEnrollment,
} from "@/lib/api/enrollments"
import { createInvoice } from "@/lib/api/invoices"
import { generatePaymentReceipt, generateAllocationLetter } from "@/lib/pdf/enrollment-pdfs"
import type { Enrollment, EnrollmentPaymentSchedule } from "@/types"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data/data-table-column-header"
import { format } from "date-fns"
import { toast } from "sonner"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount)
}

export default function EnrollmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const enrollmentId = params.id as string

  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [paymentSchedule, setPaymentSchedule] = useState<EnrollmentPaymentSchedule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  // Dialog states
  const [showPlotDialog, setShowPlotDialog] = useState(false)
  const [showResolveDialog, setShowResolveDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [selectedInstallment, setSelectedInstallment] = useState<EnrollmentPaymentSchedule | null>(null)

  // Form states
  const [plotId, setPlotId] = useState("")
  const [paidAmount, setPaidAmount] = useState("")
  const [paidDate, setPaidDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [cancellationReason, setCancellationReason] = useState("")

  useEffect(() => {
    loadEnrollmentData()
  }, [enrollmentId])

  const loadEnrollmentData = async () => {
    try {
      setIsLoading(true)
      const enrollmentData = await getEnrollment(enrollmentId)
      if (enrollmentData) {
        setEnrollment(enrollmentData)
        setPlotId(enrollmentData.plotNumber || "")

        const schedule = await getPaymentSchedule(enrollmentId)
        setPaymentSchedule(schedule)
      }
    } catch (error) {
      toast.error("Failed to load enrollment details")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSavePlotId = async () => {
    if (!enrollment) return

    try {
      setIsProcessing(true)
      await updateEnrollment(enrollmentId, { plotNumber: plotId })
      toast.success("Plot ID updated successfully")
      setShowPlotDialog(false)
      loadEnrollmentData()
    } catch (error) {
      toast.error("Failed to update plot ID")
      console.error(error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleResolvePayment = async () => {
    if (!selectedInstallment) return

    try {
      setIsProcessing(true)
      await resolvePaymentInstallment(
        enrollmentId,
        selectedInstallment.id,
        parseFloat(paidAmount),
        new Date(paidDate)
      )
      toast.success("Payment marked as paid")
      setShowResolveDialog(false)
      setSelectedInstallment(null)
      loadEnrollmentData()
    } catch (error) {
      toast.error("Failed to resolve payment")
      console.error(error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUnresolvePayment = async (installment: EnrollmentPaymentSchedule) => {
    try {
      setIsProcessing(true)
      await unresolvePaymentInstallment(enrollmentId, installment.id)
      toast.success("Payment marked as unpaid")
      loadEnrollmentData()
    } catch (error) {
      toast.error("Failed to unresolve payment")
      console.error(error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancelEnrollment = async () => {
    if (!enrollment) return

    try {
      setIsProcessing(true)
      await cancelEnrollment(enrollmentId, cancellationReason)
      toast.success("Enrollment cancelled successfully")
      setShowCancelDialog(false)
      loadEnrollmentData()
    } catch (error) {
      toast.error("Failed to cancel enrollment")
      console.error(error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleGenerateInvoice = async (installment: EnrollmentPaymentSchedule) => {
    if (!enrollment) return

    try {
      setIsProcessing(true)
      await createInvoice({
        clientId: enrollment.clientId,
        clientName: enrollment.clientName,
        enrollmentId: enrollment.id,
        enrollmentNumber: enrollment.enrollmentNumber,
        propertyId: enrollment.propertyId,
        propertyName: enrollment.propertyName,
        amount: installment.amount,
        installmentNumber: installment.installmentNumber,
      })
      toast.success("Invoice generated successfully")
      loadEnrollmentData()
    } catch (error) {
      toast.error("Failed to generate invoice")
      console.error(error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleGenerateReceipt = (installment: EnrollmentPaymentSchedule) => {
    if (!enrollment) return

    generatePaymentReceipt(
      enrollment,
      installment.paidAmount || 0,
      installment.paidDate || new Date(),
      enrollment.paymentMethod,
      `RCT-${enrollment.enrollmentNumber}-${installment.installmentNumber}`
    )
    toast.success("Receipt generated successfully")
  }

  const paymentColumns: ColumnDef<EnrollmentPaymentSchedule>[] = [
    {
      accessorKey: "installmentNumber",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Installment" />,
      cell: ({ row }) => (
        <span className="font-medium">#{row.getValue("installmentNumber")}</span>
      ),
    },
    {
      accessorKey: "amount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
      cell: ({ row }) => (
        <span className="font-medium">{formatCurrency(row.getValue("amount"))}</span>
      ),
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Due Date" />,
      cell: ({ row }) => {
        const dueDate: Date = row.getValue("dueDate")
        return <span>{format(new Date(dueDate), "MMM dd, yyyy")}</span>
      },
    },
    {
      accessorKey: "paidDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Payment Date" />,
      cell: ({ row }) => {
        const paidDate = row.getValue("paidDate") as Date | undefined
        return paidDate ? <span>{format(new Date(paidDate), "MMM dd, yyyy")}</span> : <span className="text-muted-foreground">-</span>
      },
    },
    {
      id: "overdueDays",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Overdue Days" />,
      cell: ({ row }) => {
        const installment = row.original
        if (installment.isPaid || !installment.isOverdue) {
          return <span className="text-muted-foreground">-</span>
        }
        const daysOverdue = Math.floor((Date.now() - new Date(installment.dueDate).getTime()) / (1000 * 60 * 60 * 24))
        return <span className="text-red-600 font-medium">{daysOverdue} days</span>
      },
    },
    {
      accessorKey: "penaltyAmount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Overdue Charge" />,
      cell: ({ row }) => {
        const penalty = row.getValue("penaltyAmount") as number
        return penalty > 0 ? (
          <span className="text-red-600 font-medium">{formatCurrency(penalty)}</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      },
    },
    {
      accessorKey: "isPaid",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const isPaid = row.getValue("isPaid") as boolean
        const isOverdue = row.original.isOverdue

        if (isPaid) {
          return <Badge variant="success">Paid</Badge>
        } else if (isOverdue) {
          return <Badge variant="destructive">Overdue</Badge>
        } else {
          return <Badge variant="warning">Pending</Badge>
        }
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const installment = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!installment.isPaid ? (
                <>
                  <DropdownMenuItem
                    onClick={() => handleGenerateInvoice(installment)}
                    disabled={isProcessing}
                  >
                    Generate Invoice
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedInstallment(installment)
                      setPaidAmount(installment.amount.toString())
                      setShowResolveDialog(true)
                    }}
                    disabled={isProcessing}
                  >
                    Mark as Paid
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => handleGenerateReceipt(installment)}>
                    Generate Receipt
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleUnresolvePayment(installment)}
                    disabled={isProcessing}
                  >
                    Mark as Unpaid
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-primary to-yellow-600 animate-pulse mb-4" />
          <p className="text-sm text-muted-foreground">Loading enrollment details...</p>
        </div>
      </div>
    )
  }

  if (!enrollment) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium">Enrollment not found</p>
          <Button variant="outline" className="mt-4" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
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
                    <Link
                      href={`/clients/${enrollment.clientId}`}
                      className="font-medium hover:text-primary hover:underline transition-colors"
                    >
                      {enrollment.clientName}
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Home className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Property</p>
                    <Link
                      href={`/properties/${enrollment.propertyId}`}
                      className="font-medium hover:text-primary hover:underline transition-colors"
                    >
                      {enrollment.propertyName}
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Plot Number</p>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{enrollment.plotNumber || "Not assigned"}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={() => setShowPlotDialog(true)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Agent</p>
                    <Link
                      href={`/users/${enrollment.agentId}`}
                      className="font-medium hover:text-primary hover:underline transition-colors"
                    >
                      {enrollment.agentName}
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium">{format(new Date(enrollment.startDate), "PPP")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Expected Completion</p>
                    <p className="font-medium">{format(new Date(enrollment.expectedCompletionDate), "PPP")}</p>
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
                  <span className="text-sm font-medium">{enrollment.completionPercentage}%</span>
                </div>
                <Progress value={enrollment.completionPercentage} />
              </div>

              <Separator />

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-xl font-bold">{formatCurrency(enrollment.propertyPrice)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount Paid</p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(enrollment.totalPaid)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount Pending</p>
                  <p className="text-xl font-bold text-orange-600">{formatCurrency(enrollment.outstandingBalance)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Installments</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={paymentColumns}
                data={paymentSchedule}
                searchKey="installmentNumber"
                searchPlaceholder="Search installments..."
                searchVariant="gold"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusBadge status={enrollment.status} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setShowCancelDialog(true)}
                disabled={enrollment.status === "Cancelled"}
              >
                <Ban className="h-4 w-4 mr-2" />
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

      {/* Plot ID Dialog */}
      <Dialog open={showPlotDialog} onOpenChange={setShowPlotDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set/Edit Plot ID</DialogTitle>
            <DialogDescription>
              Enter the plot number for this enrollment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="plotId">Plot Number</Label>
              <Input
                id="plotId"
                value={plotId}
                onChange={(e) => setPlotId(e.target.value)}
                placeholder="e.g., A-101"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPlotDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePlotId} disabled={isProcessing}>
              {isProcessing ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Payment Dialog */}
      <Dialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Payment as Paid</DialogTitle>
            <DialogDescription>
              Enter payment details for installment #{selectedInstallment?.installmentNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="paidAmount">Amount Paid</Label>
              <Input
                id="paidAmount"
                type="number"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <Label htmlFor="paidDate">Payment Date</Label>
              <Input
                id="paidDate"
                type="date"
                value={paidDate}
                onChange={(e) => setPaidDate(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResolveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleResolvePayment} disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Mark as Paid"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Enrollment Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Enrollment</DialogTitle>
            <DialogDescription>
              This action will cancel the enrollment. Please provide a reason.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cancellationReason">Cancellation Reason</Label>
              <Textarea
                id="cancellationReason"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Enter reason for cancellation..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelEnrollment}
              disabled={isProcessing || !cancellationReason.trim()}
            >
              {isProcessing ? "Cancelling..." : "Cancel Enrollment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
