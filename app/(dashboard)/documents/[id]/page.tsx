"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, Upload, Download, FileText, Video, Image as ImageIcon, File, Share2, Trash2, Eye } from "lucide-react"
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
interface DocumentFile {
  id: string
  name: string
  type: "PDF" | "Image" | "Video" | "Other"
  size: number
  url: string
  uploadedBy: string
  uploadedByName: string
  uploadedAt: Date
  category: "Reference" | "Tutorial" | "Client Upload"
}

export default function DocumentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const documentId = params.id as string
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - will be replaced with API call
  const documentGroup = {
    id: documentId,
    name: "Property Legal Documents",
    description: "Legal documents and contracts for all property transactions including C of O, survey plans, and permits",
    type: "General" as const,
    propertyId: undefined,
    propertyName: undefined,
    clientId: undefined,
    clientName: undefined,
    totalDocuments: 12,
    totalVideos: 3,
    createdBy: "user-1",
    createdByName: "Admin User",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-20"),
  }

  const documents: DocumentFile[] = [
    {
      id: "1",
      name: "Certificate_of_Occupancy_Template.pdf",
      type: "PDF",
      size: 2457600, // 2.4 MB
      url: "/documents/coo-template.pdf",
      uploadedBy: "user-1",
      uploadedByName: "Admin User",
      uploadedAt: new Date("2024-01-05T10:30:00"),
      category: "Reference",
    },
    {
      id: "2",
      name: "Property_Purchase_Agreement.pdf",
      type: "PDF",
      size: 1843200, // 1.8 MB
      url: "/documents/purchase-agreement.pdf",
      uploadedBy: "user-1",
      uploadedByName: "Admin User",
      uploadedAt: new Date("2024-01-10T14:20:00"),
      category: "Reference",
    },
    {
      id: "3",
      name: "Survey_Plan_Sample.pdf",
      type: "PDF",
      size: 5242880, // 5 MB
      url: "/documents/survey-plan.pdf",
      uploadedBy: "user-2",
      uploadedByName: "Manager User",
      uploadedAt: new Date("2024-01-15T09:15:00"),
      category: "Reference",
    },
    {
      id: "4",
      name: "Building_Permit_Guidelines.pdf",
      type: "PDF",
      size: 3145728, // 3 MB
      url: "/documents/building-permit.pdf",
      uploadedBy: "user-1",
      uploadedByName: "Admin User",
      uploadedAt: new Date("2024-01-18T11:45:00"),
      category: "Reference",
    },
  ]

  const videos: DocumentFile[] = [
    {
      id: "v1",
      name: "Property_Documentation_Process.mp4",
      type: "Video",
      size: 45678900, // 45 MB
      url: "/videos/doc-process.mp4",
      uploadedBy: "user-1",
      uploadedByName: "Admin User",
      uploadedAt: new Date("2024-01-08T16:00:00"),
      category: "Tutorial",
    },
    {
      id: "v2",
      name: "How_to_Upload_Documents.mp4",
      type: "Video",
      size: 23456789, // 23 MB
      url: "/videos/upload-guide.mp4",
      uploadedBy: "user-1",
      uploadedByName: "Admin User",
      uploadedAt: new Date("2024-01-12T13:30:00"),
      category: "Tutorial",
    },
    {
      id: "v3",
      name: "Legal_Requirements_Overview.mp4",
      type: "Video",
      size: 67890123, // 68 MB
      url: "/videos/legal-overview.mp4",
      uploadedBy: "user-2",
      uploadedByName: "Manager User",
      uploadedAt: new Date("2024-01-16T10:00:00"),
      category: "Tutorial",
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
          <p className="text-sm text-muted-foreground">Loading documents...</p>
        </div>
      </div>
    )
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return <FileText className="h-5 w-5 text-red-500" />
      case "Image":
        return <ImageIcon className="h-5 w-5 text-blue-500" />
      case "Video":
        return <Video className="h-5 w-5 text-purple-500" />
      default:
        return <File className="h-5 w-5 text-muted-foreground" />
    }
  }

  const typeColors: Record<string, string> = {
    Property: "bg-blue-500",
    Client: "bg-green-500",
    General: "bg-purple-500",
  }

  const totalSize = [...documents, ...videos].reduce((sum, file) => sum + file.size, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title={documentGroup.name}
        description={documentGroup.description || `Document group with ${documentGroup.totalDocuments} files`}
        actions={
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button size="sm" onClick={() => router.push(`/documents/${documentId}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Group Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Group Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Documents</p>
                    <p className="font-medium text-lg">{documentGroup.totalDocuments}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Video className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Tutorial Videos</p>
                    <p className="font-medium text-lg">{documentGroup.totalVideos}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge className={typeColors[documentGroup.type]}>
                    {documentGroup.type}
                  </Badge>
                </div>

                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Size</p>
                    <p className="font-medium">{formatFileSize(totalSize)}</p>
                  </div>
                </div>
              </div>

              {documentGroup.description && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{documentGroup.description}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Tabs Section */}
          <Tabs defaultValue="documents">
            <TabsList>
              <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
              <TabsTrigger value="videos">Videos ({videos.length})</TabsTrigger>
              <TabsTrigger value="all">All Files ({documents.length + videos.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3 flex-1">
                          {getFileIcon(doc.type)}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{doc.name}</p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                              <span>{formatFileSize(doc.size)}</span>
                              <span>•</span>
                              <span>Uploaded by {doc.uploadedByName}</span>
                              <span>•</span>
                              <span>{format(doc.uploadedAt, "PP")}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost" onClick={() => toast.success("Viewing document...")}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => toast.success("Downloading...")}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {documents.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No documents uploaded yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="videos">
              <Card>
                <CardHeader>
                  <CardTitle>Tutorial Videos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {videos.map((video) => (
                      <div key={video.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3 flex-1">
                          {getFileIcon(video.type)}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{video.name}</p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                              <span>{formatFileSize(video.size)}</span>
                              <span>•</span>
                              <span>Uploaded by {video.uploadedByName}</span>
                              <span>•</span>
                              <span>{format(video.uploadedAt, "PP")}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost" onClick={() => toast.success("Playing video...")}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => toast.success("Downloading...")}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {videos.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No videos uploaded yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>All Files</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[...documents, ...videos]
                      .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
                      .map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3 flex-1">
                            {getFileIcon(file.type)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium truncate">{file.name}</p>
                                <Badge variant="outline" className="text-xs">{file.category}</Badge>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                <span>{formatFileSize(file.size)}</span>
                                <span>•</span>
                                <span>{file.uploadedByName}</span>
                                <span>•</span>
                                <span>{format(file.uploadedAt, "PP")}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost" onClick={() => toast.success("Viewing file...")}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => toast.success("Downloading...")}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Files</span>
                <span className="font-bold">{documents.length + videos.length}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Documents</span>
                <span className="font-bold">{documents.length}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Videos</span>
                <span className="font-bold">{videos.length}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Size</span>
                <span className="font-bold">{formatFileSize(totalSize)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" onClick={() => toast.success("Opening file uploader...")}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </Button>
              <Button className="w-full" variant="outline" onClick={() => toast.success("Sharing document group...")}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Group
              </Button>
              <Button className="w-full" variant="outline" onClick={() => toast.success("Downloading all files...")}>
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
              <Button className="w-full" variant="outline" className="text-red-600" onClick={() => toast.error("Delete functionality...")}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Group
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
                <p className="text-muted-foreground">Created By</p>
                <p className="font-medium">{documentGroup.createdByName}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">Created</p>
                <p className="font-medium">{format(documentGroup.createdAt, "PPP")}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p className="font-medium">{format(documentGroup.updatedAt, "PPP")}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">Type</p>
                <Badge className={typeColors[documentGroup.type]}>{documentGroup.type}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
