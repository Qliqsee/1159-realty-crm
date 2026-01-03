"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, User, Building, Briefcase, Users, Shield, CheckCircle, XCircle, AlertCircle, FileText, Download } from "lucide-react"
import { Button } from "@/components/buttons/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/card"
import { Badge } from "@/components/badges/badge"
import { Separator } from "@/components/display/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/navigation/tabs"
import { PageHeader } from "@/components/layout/page-header"
import { Progress } from "@/components/feedback/progress"
import { format } from "date-fns"
import { useEffect, useState } from "react"
import { toast } from "sonner"

// Mock data - will be replaced with API call
interface KYCSubmission {
  id: string
  clientId: string
  clientName: string
  identityDocumentType?: string
  identityDocumentNumber?: string
  identityDocumentStatus: string
  identityDocumentFeedback?: string
  bankName?: string
  accountNumber?: string
  accountName?: string
  bankDetailsStatus: string
  bankDetailsFeedback?: string
  employmentStatus?: string
  employerName?: string
  occupation?: string
  monthlyIncome?: number
  employmentStatus_DocumentStatus: string
  employmentFeedback?: string
  nextOfKinFullName?: string
  nextOfKinPhone?: string
  nextOfKinRelationship?: string
  nextOfKinStatus: string
  nextOfKinFeedback?: string
  guarantorFullName?: string
  guarantorPhone?: string
  guarantorStatus: string
  guarantorFeedback?: string
  overallStatus: string
  completionPercentage: number
  reviewedByName?: string
  reviewedAt?: Date
  submittedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export default function KYCDetailPage() {
  const params = useParams()
  const router = useRouter()
  const kycId = params.id as string
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - will be replaced with API call
  const kyc: KYCSubmission = {
    id: kycId,
    clientId: "client-1",
    clientName: "Sarah Johnson",
    identityDocumentType: "National ID",
    identityDocumentNumber: "NIN-12345678901",
    identityDocumentStatus: "Approved",
    bankName: "GTBank",
    accountNumber: "0123456789",
    accountName: "Sarah Johnson",
    bankDetailsStatus: "Approved",
    employmentStatus: "Employed",
    employerName: "Tech Corp Limited",
    occupation: "Software Engineer",
    monthlyIncome: 500000,
    employmentStatus_DocumentStatus: "Pending",
    nextOfKinFullName: "John Johnson",
    nextOfKinPhone: "+234 801 234 5678",
    nextOfKinRelationship: "Brother",
    nextOfKinStatus: "Approved",
    guarantorFullName: "David Brown",
    guarantorPhone: "+234 802 345 6789",
    guarantorStatus: "Pending",
    overallStatus: "Pending",
    completionPercentage: 75,
    submittedAt: new Date("2024-12-01"),
    createdAt: new Date("2024-11-15"),
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
          <p className="text-sm text-muted-foreground">Loading KYC...</p>
        </div>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    Pending: "bg-yellow-500",
    Approved: "bg-green-500",
    Rejected: "bg-red-500",
    "Not Submitted": "bg-gray-500",
    Incomplete: "bg-orange-500",
  }

  const getSectionIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "Rejected":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "Pending":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`KYC Review - ${kyc.clientName}`}
        description={`Completion: ${kyc.completionPercentage}%`}
        actions={
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button size="sm" onClick={() => router.push(`/kyc/${kycId}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Completion Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle>Completion Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className="font-medium">{kyc.completionPercentage}%</span>
                </div>
                <Progress value={kyc.completionPercentage} />
              </div>
            </CardContent>
          </Card>

          {/* Tabs for Sections */}
          <Tabs defaultValue="identity">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="identity">Identity</TabsTrigger>
              <TabsTrigger value="bank">Bank</TabsTrigger>
              <TabsTrigger value="employment">Employment</TabsTrigger>
              <TabsTrigger value="nextofkin">Next of Kin</TabsTrigger>
              <TabsTrigger value="guarantor">Guarantor</TabsTrigger>
            </TabsList>

            {/* Identity Section */}
            <TabsContent value="identity">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Identity Documents</CardTitle>
                    {getSectionIcon(kyc.identityDocumentStatus)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Document Type</p>
                      <p className="font-medium">{kyc.identityDocumentType || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Document Number</p>
                      <p className="font-medium">{kyc.identityDocumentNumber || "N/A"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Status</p>
                    <Badge className={statusColors[kyc.identityDocumentStatus]}>
                      {kyc.identityDocumentStatus}
                    </Badge>
                  </div>
                  {kyc.identityDocumentFeedback && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-1">Feedback</p>
                      <p className="text-sm text-muted-foreground">{kyc.identityDocumentFeedback}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bank Section */}
            <TabsContent value="bank">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Bank Details</CardTitle>
                    {getSectionIcon(kyc.bankDetailsStatus)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Bank Name</p>
                      <p className="font-medium">{kyc.bankName || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Account Number</p>
                      <p className="font-medium">{kyc.accountNumber || "N/A"}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Account Name</p>
                      <p className="font-medium">{kyc.accountName || "N/A"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Status</p>
                    <Badge className={statusColors[kyc.bankDetailsStatus]}>
                      {kyc.bankDetailsStatus}
                    </Badge>
                  </div>
                  {kyc.bankDetailsFeedback && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-1">Feedback</p>
                      <p className="text-sm text-muted-foreground">{kyc.bankDetailsFeedback}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Employment Section */}
            <TabsContent value="employment">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Employment Information</CardTitle>
                    {getSectionIcon(kyc.employmentStatus_DocumentStatus)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Employment Status</p>
                      <p className="font-medium">{kyc.employmentStatus || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Employer</p>
                      <p className="font-medium">{kyc.employerName || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Occupation</p>
                      <p className="font-medium">{kyc.occupation || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Income</p>
                      <p className="font-medium">
                        {kyc.monthlyIncome ? `₦${kyc.monthlyIncome.toLocaleString()}` : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Status</p>
                    <Badge className={statusColors[kyc.employmentStatus_DocumentStatus]}>
                      {kyc.employmentStatus_DocumentStatus}
                    </Badge>
                  </div>
                  {kyc.employmentFeedback && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-1">Feedback</p>
                      <p className="text-sm text-muted-foreground">{kyc.employmentFeedback}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Next of Kin Section */}
            <TabsContent value="nextofkin">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Next of Kin</CardTitle>
                    {getSectionIcon(kyc.nextOfKinStatus)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{kyc.nextOfKinFullName || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{kyc.nextOfKinPhone || "N/A"}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Relationship</p>
                      <p className="font-medium">{kyc.nextOfKinRelationship || "N/A"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Status</p>
                    <Badge className={statusColors[kyc.nextOfKinStatus]}>
                      {kyc.nextOfKinStatus}
                    </Badge>
                  </div>
                  {kyc.nextOfKinFeedback && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-1">Feedback</p>
                      <p className="text-sm text-muted-foreground">{kyc.nextOfKinFeedback}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Guarantor Section */}
            <TabsContent value="guarantor">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Guarantor Information</CardTitle>
                    {getSectionIcon(kyc.guarantorStatus)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{kyc.guarantorFullName || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{kyc.guarantorPhone || "N/A"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Status</p>
                    <Badge className={statusColors[kyc.guarantorStatus]}>
                      {kyc.guarantorStatus}
                    </Badge>
                  </div>
                  {kyc.guarantorFeedback && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-1">Feedback</p>
                      <p className="text-sm text-muted-foreground">{kyc.guarantorFeedback}</p>
                    </div>
                  )}
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
              <CardTitle>Overall Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={statusColors[kyc.overallStatus]}>
                {kyc.overallStatus}
              </Badge>
            </CardContent>
          </Card>

          {/* Section Status Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Section Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Identity</span>
                </div>
                <Badge variant="outline" className={statusColors[kyc.identityDocumentStatus]}>
                  {kyc.identityDocumentStatus}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Bank</span>
                </div>
                <Badge variant="outline" className={statusColors[kyc.bankDetailsStatus]}>
                  {kyc.bankDetailsStatus}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Employment</span>
                </div>
                <Badge variant="outline" className={statusColors[kyc.employmentStatus_DocumentStatus]}>
                  {kyc.employmentStatus_DocumentStatus}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Next of Kin</span>
                </div>
                <Badge variant="outline" className={statusColors[kyc.nextOfKinStatus]}>
                  {kyc.nextOfKinStatus}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Guarantor</span>
                </div>
                <Badge variant="outline" className={statusColors[kyc.guarantorStatus]}>
                  {kyc.guarantorStatus}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {kyc.overallStatus === "Pending" && (
                <>
                  <Button className="w-full" variant="outline">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve All
                  </Button>
                  <Button className="w-full" variant="outline" className="text-red-600">
                    <XCircle className="h-4 w-4 mr-2" />
                    Request Changes
                  </Button>
                </>
              )}
              <Button className="w-full" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Documents
              </Button>
              <Button className="w-full" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                View Client Profile
              </Button>
            </CardContent>
          </Card>

          {/* Meta Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {kyc.submittedAt && (
                <>
                  <div>
                    <p className="text-muted-foreground">Submitted</p>
                    <p className="font-medium">{format(kyc.submittedAt, "PPP")}</p>
                  </div>
                  <Separator />
                </>
              )}
              <div>
                <p className="text-muted-foreground">Created</p>
                <p className="font-medium">{format(kyc.createdAt, "PPP")}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p className="font-medium">{format(kyc.updatedAt, "PPP")}</p>
              </div>
              {kyc.reviewedByName && (
                <>
                  <Separator />
                  <div>
                    <p className="text-muted-foreground">Reviewed By</p>
                    <p className="font-medium">{kyc.reviewedByName}</p>
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
