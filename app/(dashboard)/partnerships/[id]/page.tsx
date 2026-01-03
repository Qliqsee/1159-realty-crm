"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, User, Mail, Phone, FileText, Calendar, CheckCircle, XCircle, Download, AlertCircle } from "lucide-react"
import { Button } from "@/components/buttons/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/card"
import { Badge } from "@/components/badges/badge"
import { Separator } from "@/components/display/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/navigation/tabs"
import { PageHeader } from "@/components/layout/page-header"
import { format } from "date-fns"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface PartnershipApplication {
  id: string
  clientId: string
  clientName: string
  clientEmail: string
  clientPhone: string
  status: "Pending" | "Under Review" | "Approved" | "Rejected"
  motivation?: string
  experience?: string
  referralNetwork?: string
  documentsComplete: boolean
  reviewedByName?: string
  reviewedAt?: Date
  approvedByName?: string
  approvedAt?: Date
  rejectedByName?: string
  rejectedAt?: Date
  rejectionReason?: string
  linkedAgentName?: string
  appliedAt: Date
  createdAt: Date
  updatedAt: Date
}

export default function PartnershipDetailPage() {
  const params = useParams()
  const router = useRouter()
  const partnershipId = params.id as string
  const [isLoading, setIsLoading] = useState(true)

  const partnership: PartnershipApplication = {
    id: partnershipId,
    clientId: "client-1",
    clientName: "David Brown",
    clientEmail: "david.brown@example.com",
    clientPhone: "+234 802 345 6789",
    status: "Pending",
    motivation: "I have a strong network in the real estate industry and would like to refer clients to earn additional income.",
    experience: "5 years experience in property consulting and have successfully referred over 20 clients to various developers.",
    referralNetwork: "Real estate agents, property consultants, corporate professionals",
    documentsComplete: true,
    linkedAgentName: "Michael Chen",
    appliedAt: new Date("2024-11-15"),
    createdAt: new Date("2024-11-15"),
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
          <p className="text-sm text-muted-foreground">Loading partnership application...</p>
        </div>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    Pending: "bg-yellow-500",
    "Under Review": "bg-blue-500",
    Approved: "bg-green-500",
    Rejected: "bg-red-500",
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Partnership Application - ${partnership.clientName}`}
        description={partnership.clientEmail}
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
              <CardTitle>Applicant Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{partnership.clientName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{partnership.clientEmail}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{partnership.clientPhone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Applied Date</p>
                    <p className="font-medium">{format(partnership.appliedAt, "PPP")}</p>
                  </div>
                </div>
              </div>

              {partnership.linkedAgentName && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Assigned Agent</p>
                    <p className="font-medium">{partnership.linkedAgentName}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {partnership.motivation && (
                <div>
                  <h4 className="font-medium mb-2">Motivation</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {partnership.motivation}
                  </p>
                </div>
              )}

              {partnership.experience && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Experience</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {partnership.experience}
                    </p>
                  </div>
                </>
              )}

              {partnership.referralNetwork && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Referral Network</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {partnership.referralNetwork}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                {partnership.documentsComplete ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900 dark:text-green-100">Documents Complete</p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        All required documents have been submitted
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-900 dark:text-yellow-100">Documents Incomplete</p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Some documents are missing or pending review
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {partnership.status === "Approved" && (
            <Card>
              <CardHeader>
                <CardTitle>Approval Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900 dark:text-green-100">
                        Application Approved
                      </p>
                      {partnership.approvedAt && (
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Approved on {format(partnership.approvedAt, "PPP")}
                        </p>
                      )}
                      {partnership.approvedByName && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                          By {partnership.approvedByName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {partnership.status === "Rejected" && partnership.rejectionReason && (
            <Card>
              <CardHeader>
                <CardTitle>Rejection Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-red-900 dark:text-red-100">
                        Application Rejected
                      </p>
                      {partnership.rejectedAt && (
                        <p className="text-sm text-red-700 dark:text-red-300">
                          Rejected on {format(partnership.rejectedAt, "PPP")}
                        </p>
                      )}
                      {partnership.rejectedByName && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                          By {partnership.rejectedByName}
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
                      {partnership.rejectionReason}
                    </p>
                  </div>
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
                        <p className="font-medium">Application Submitted</p>
                        <p className="text-sm text-muted-foreground">
                          {format(partnership.appliedAt, "PPP 'at' p")}
                        </p>
                      </div>
                    </div>
                    {partnership.reviewedAt && (
                      <div className="flex gap-3">
                        <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                        <div>
                          <p className="font-medium">Application Reviewed</p>
                          <p className="text-sm text-muted-foreground">
                            {format(partnership.reviewedAt, "PPP 'at' p")}
                            {partnership.reviewedByName && ` by ${partnership.reviewedByName}`}
                          </p>
                        </div>
                      </div>
                    )}
                    {partnership.approvedAt && (
                      <div className="flex gap-3">
                        <div className="w-2 h-2 mt-2 rounded-full bg-green-500" />
                        <div>
                          <p className="font-medium">Application Approved</p>
                          <p className="text-sm text-muted-foreground">
                            {format(partnership.approvedAt, "PPP 'at' p")}
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
              <Badge className={statusColors[partnership.status]}>{partnership.status}</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {partnership.status === "Pending" && (
                <>
                  <Button className="w-full" variant="outline">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Application
                  </Button>
                  <Button className="w-full text-red-600" variant="outline">
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Application
                  </Button>
                </>
              )}
              <Button className="w-full" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Documents
              </Button>
              <Button className="w-full" variant="outline">
                <User className="h-4 w-4 mr-2" />
                View Client Profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Applied</p>
                <p className="font-medium">{format(partnership.appliedAt, "PPP")}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">Created</p>
                <p className="font-medium">{format(partnership.createdAt, "PPP")}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p className="font-medium">{format(partnership.updatedAt, "PPP")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
