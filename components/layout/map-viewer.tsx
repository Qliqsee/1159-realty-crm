"use client"

import { ExternalLink, MapPin } from "lucide-react"
import { Button } from "@/components/buttons/button"
import { cn } from "@/lib/utils"

interface MapViewerProps {
  latitude: number
  longitude: number
  address?: string
  zoom?: number
  className?: string
}

export function MapViewer({
  latitude,
  longitude,
  address,
  zoom = 15,
  className,
}: MapViewerProps) {
  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=${zoom}`
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${latitude},${longitude}&zoom=${zoom}`

  const openInMaps = () => {
    window.open(googleMapsUrl, "_blank")
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Map Preview - Static for now, can be replaced with actual Google Maps embed */}
      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden shadow-soft-lg group cursor-pointer"
        onClick={openInMaps}
      >
        {/* Placeholder - In production, use actual Google Maps API */}
        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-12 w-12 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">Click to view on map</p>
            {address && (
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">{address}</p>
            )}
          </div>
        </div>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="text-center text-white">
            <ExternalLink className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm font-medium">Open in Google Maps</p>
          </div>
        </div>
      </div>

      {/* Coordinates Info */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Lat: {latitude.toFixed(6)}, Lng: {longitude.toFixed(6)}
        </span>
        <Button
          variant="link"
          size="sm"
          onClick={openInMaps}
          className="h-auto p-0"
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          Open in Maps
        </Button>
      </div>
    </div>
  )
}
