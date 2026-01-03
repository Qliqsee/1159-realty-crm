"use client"

import { useState } from "react"
import { X, Upload, Video, Image as ImageIcon, Link2, Youtube, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type MediaType = "image" | "video" | "youtube" | "instagram"

export interface MediaItem {
  id: string
  type: MediaType
  url: string
  file?: File
  thumbnail?: string
}

interface MediaUploadProps {
  value: MediaItem[]
  onChange: (value: MediaItem[]) => void
  maxItems?: number
  acceptImages?: boolean
  acceptVideos?: boolean
  acceptLinks?: boolean
  variant?: "default" | "gold"
  className?: string
}

export function MediaUpload({
  value = [],
  onChange,
  maxItems = 20,
  acceptImages = true,
  acceptVideos = true,
  acceptLinks = true,
  variant = "gold",
  className,
}: MediaUploadProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [youtubeLink, setYoutubeLink] = useState("")
  const [instagramLink, setInstagramLink] = useState("")

  const handleFileUpload = (files: FileList | null, type: MediaType) => {
    if (!files) return

    const newItems: MediaItem[] = []
    Array.from(files).forEach((file) => {
      if (value.length + newItems.length >= maxItems) return

      const url = URL.createObjectURL(file)
      newItems.push({
        id: Math.random().toString(36).substring(7),
        type,
        url,
        file,
        thumbnail: url,
      })
    })

    onChange([...value, ...newItems])
  }

  const handleLinkAdd = (link: string, type: "youtube" | "instagram") => {
    if (!link || value.length >= maxItems) return

    const thumbnail = extractThumbnail(link, type)
    const newItem: MediaItem = {
      id: Math.random().toString(36).substring(7),
      type,
      url: link,
      thumbnail,
    }

    onChange([...value, newItem])
    if (type === "youtube") setYoutubeLink("")
    if (type === "instagram") setInstagramLink("")
  }

  const extractThumbnail = (link: string, type: "youtube" | "instagram"): string => {
    if (type === "youtube") {
      // Extract YouTube video ID and create thumbnail URL
      const videoId = link.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1]
      return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : ""
    }
    // For Instagram, we'd need an API call or just use a placeholder
    return ""
  }

  const handleRemove = (id: string) => {
    onChange(value.filter((item) => item.id !== id))
  }

  const borderColor = variant === "gold" ? "border-yellow-600" : "border-input"
  const iconColor = variant === "gold" ? "text-yellow-600 dark:text-yellow-500" : "text-muted-foreground"

  return (
    <div className={cn("space-y-3", className)}>
      {/* Upload Button */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "w-full h-24 border-dashed shadow-soft",
              borderColor
            )}
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className={cn("h-8 w-8", iconColor)} />
              <span className="text-sm">
                Upload Images, Videos or Add Links
              </span>
              <span className="text-xs text-muted-foreground">
                {value.length}/{maxItems} items
              </span>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Media</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="image" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {acceptImages && (
                <TabsTrigger value="image">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Images
                </TabsTrigger>
              )}
              {acceptVideos && (
                <TabsTrigger value="video">
                  <Video className="h-4 w-4 mr-2" />
                  Videos
                </TabsTrigger>
              )}
              {acceptLinks && (
                <TabsTrigger value="youtube">
                  <Youtube className="h-4 w-4 mr-2" />
                  YouTube
                </TabsTrigger>
              )}
              {acceptLinks && (
                <TabsTrigger value="instagram">
                  <Instagram className="h-4 w-4 mr-2" />
                  Instagram
                </TabsTrigger>
              )}
            </TabsList>

            {acceptImages && (
              <TabsContent value="image" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image-upload">Upload Images</Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    variant={variant}
                    onChange={(e) => handleFileUpload(e.target.files, "image")}
                  />
                  <p className="text-xs text-muted-foreground">
                    Supported formats: JPG, PNG, WEBP, GIF. Multiple files allowed.
                  </p>
                </div>
              </TabsContent>
            )}

            {acceptVideos && (
              <TabsContent value="video" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="video-upload">Upload Videos</Label>
                  <Input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    multiple
                    variant={variant}
                    onChange={(e) => handleFileUpload(e.target.files, "video")}
                  />
                  <p className="text-xs text-muted-foreground">
                    Supported formats: MP4, WEBM, MOV. Multiple files allowed.
                  </p>
                </div>
              </TabsContent>
            )}

            {acceptLinks && (
              <TabsContent value="youtube" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="youtube-link">YouTube Video URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="youtube-link"
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      variant={variant}
                      value={youtubeLink}
                      onChange={(e) => setYoutubeLink(e.target.value)}
                      icon={Youtube}
                    />
                    <Button
                      type="button"
                      onClick={() => handleLinkAdd(youtubeLink, "youtube")}
                      disabled={!youtubeLink}
                    >
                      Add
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Paste a YouTube video link to embed it in your property listing.
                  </p>
                </div>
              </TabsContent>
            )}

            {acceptLinks && (
              <TabsContent value="instagram" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram-link">Instagram Reel URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="instagram-link"
                      type="url"
                      placeholder="https://www.instagram.com/reel/..."
                      variant={variant}
                      value={instagramLink}
                      onChange={(e) => setInstagramLink(e.target.value)}
                      icon={Instagram}
                    />
                    <Button
                      type="button"
                      onClick={() => handleLinkAdd(instagramLink, "instagram")}
                      disabled={!instagramLink}
                    >
                      Add
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Paste an Instagram Reel link to showcase your property.
                  </p>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Media Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {value.map((item) => (
            <div
              key={item.id}
              className={cn(
                "relative aspect-square rounded-lg overflow-hidden border shadow-soft group",
                borderColor
              )}
            >
              {/* Media Preview */}
              {item.type === "image" && (
                <img
                  src={item.url}
                  alt="Upload"
                  className="w-full h-full object-cover"
                />
              )}
              {item.type === "video" && (
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                  muted
                />
              )}
              {item.type === "youtube" && item.thumbnail && (
                <div className="w-full h-full bg-black flex items-center justify-center relative">
                  <img
                    src={item.thumbnail}
                    alt="YouTube thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <Youtube className="absolute h-12 w-12 text-red-600" />
                </div>
              )}
              {item.type === "instagram" && (
                <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <Instagram className="h-12 w-12 text-white" />
                </div>
              )}

              {/* Type Badge */}
              <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                {item.type === "youtube" && "YouTube"}
                {item.type === "instagram" && "Instagram"}
                {item.type === "image" && "Image"}
                {item.type === "video" && "Video"}
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-soft"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
