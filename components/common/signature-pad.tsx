"use client"

import { useRef, useState, useEffect } from "react"
import { Eraser, RotateCcw, Download, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SignaturePadProps {
  onSave: (dataUrl: string) => void
  width?: number
  height?: number
  penColor?: string
  backgroundColor?: string
  className?: string
}

/**
 * SignaturePad - Canvas-based signature capture
 *
 * Usage:
 * <SignaturePad
 *   onSave={(dataUrl) => console.log("Signature saved:", dataUrl)}
 *   width={500}
 *   height={200}
 * />
 */
export function SignaturePad({
  onSave,
  width = 500,
  height = 200,
  penColor = "#000000",
  backgroundColor = "#ffffff",
  className,
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isEmpty, setIsEmpty] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas background
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, width, height)
  }, [width, height, backgroundColor])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawing(true)
    setIsEmpty(false)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.lineTo(x, y)
    ctx.strokeStyle = penColor
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clear = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, width, height)
    setIsEmpty(true)
  }

  const save = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dataUrl = canvas.toDataURL("image/png")
    onSave(dataUrl)
  }

  const download = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dataUrl = canvas.toDataURL("image/png")
    const link = document.createElement("a")
    link.download = `signature-${Date.now()}.png`
    link.href = dataUrl
    link.click()
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Canvas */}
      <div className="border rounded-lg overflow-hidden shadow-soft bg-white">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="cursor-crosshair"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={clear}
            disabled={isEmpty}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={download}
            disabled={isEmpty}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
        <Button size="sm" onClick={save} disabled={isEmpty}>
          <Check className="h-4 w-4 mr-2" />
          Save Signature
        </Button>
      </div>

      {/* Helper Text */}
      <p className="text-xs text-muted-foreground text-center">
        Draw your signature in the box above using your mouse or touchscreen
      </p>
    </div>
  )
}
