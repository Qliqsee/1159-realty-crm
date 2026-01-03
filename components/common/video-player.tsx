"use client"

import { Play } from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoPlayerProps {
  url: string
  title?: string
  thumbnail?: string
  className?: string
}

export function VideoPlayer({ url, title, thumbnail, className }: VideoPlayerProps) {
  const isYouTube = url.includes("youtube.com") || url.includes("youtu.be")
  const isVimeo = url.includes("vimeo.com")

  const getEmbedUrl = (videoUrl: string): string => {
    if (isYouTube) {
      const videoId = videoUrl.includes("youtu.be")
        ? videoUrl.split("/").pop()?.split("?")[0]
        : new URL(videoUrl).searchParams.get("v")
      return `https://www.youtube.com/embed/${videoId}`
    }

    if (isVimeo) {
      const videoId = videoUrl.split("/").pop()
      return `https://player.vimeo.com/video/${videoId}`
    }

    return videoUrl
  }

  const embedUrl = getEmbedUrl(url)

  return (
    <div className={cn("relative rounded-lg overflow-hidden shadow-soft-lg", className)}>
      <div className="aspect-video bg-muted">
        {isYouTube || isVimeo ? (
          <iframe
            src={embedUrl}
            title={title || "Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        ) : (
          <video
            controls
            poster={thumbnail}
            className="w-full h-full"
          >
            <source src={url} />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      {title && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <p className="text-white text-sm font-medium">{title}</p>
        </div>
      )}
    </div>
  )
}
