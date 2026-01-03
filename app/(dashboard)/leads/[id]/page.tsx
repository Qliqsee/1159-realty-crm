"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, Mail, Phone, Tag, Calendar, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/common/page-header"
import { format } from "date-fns"

export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const leadId = params.id as string

  // Mock data - replace with actual API call
  const lead = {
    id: leadId,
    firstName: "John",
    lastName: "Doe",
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+234-803-123-4567",
    alternatePhone: "+234-803-765-4321",
    status: "Qualified" as const,
    source: "Website" as const,
    sourceDetails: "Contacted via website form",
    assignedAgentName: "Michael Chen",
    tags: ["hot-lead", "high-value"],
    createdAt: new Date("2024-01-15"),
    followUpDate: new Date("2024-02-01"),
    notes: [
      { id: "1", userName: "Agent", note: "Very interested in Lekki property", createdAt: new Date("2024-01-16") },
      { id: "2", userName: "Agent", note: "Scheduled follow-up call", createdAt: new Date("2024-01-18") },
    ],
  }

  const statusColors: Record<string, string> = {
    New: "bg-blue-500",
    Contacted: "bg-yellow-500",
    Qualified: "bg-green-500",
    Converted: "bg-purple-500",
    Lost: "bg-red-500",
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={lead.fullName}
        description={`Lead #${leadId}`}
        actions={
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Lead
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lead Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{lead.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{lead.phone}</p>
                  </div>
                </div>

                {lead.alternatePhone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Alternate Phone</p>
                      <p className="font-medium">{lead.alternatePhone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <UserCheck className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Assigned Agent</p>
                    <p className="font-medium">{lead.assignedAgentName || "Unassigned"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-medium">{format(lead.createdAt, "PPP")}</p>
                  </div>
                </div>

                {lead.followUpDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Follow-up Date</p>
                      <p className="font-medium">{format(lead.followUpDate, "PPP")}</p>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground mb-2">Source</p>
                <Badge variant="outline">{lead.source}</Badge>
                {lead.sourceDetails && (
                  <p className="text-sm mt-2">{lead.sourceDetails}</p>
                )}
              </div>

              {lead.tags.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {lead.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes & Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lead.notes.map((note) => (
                  <div key={note.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-sm">{note.userName}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(note.createdAt, "PPp")}
                      </p>
                    </div>
                    <p className="text-sm">{note.note}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={statusColors[lead.status]}>
                {lead.status}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                Convert to Client
              </Button>
              <Button className="w-full" variant="outline">
                Schedule Follow-up
              </Button>
              <Button className="w-full" variant="outline">
                Send Email
              </Button>
              <Button className="w-full" variant="outline">
                Add Note
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
