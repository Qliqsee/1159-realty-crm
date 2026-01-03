"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/buttons/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/overlays/dropdown-menu"
import type { ExportFormat } from "@/types"
import { toast } from "sonner"

interface ExportButtonProps {
  onExport: (format: ExportFormat) => void | Promise<void>
  formats?: ExportFormat[]
  isLoading?: boolean
}

export function ExportButton({
  onExport,
  formats = ["excel", "csv", "pdf"],
  isLoading = false,
}: ExportButtonProps) {
  const [exportingFormat, setExportingFormat] = useState<ExportFormat | null>(null)

  const handleExport = async (format: ExportFormat) => {
    try {
      setExportingFormat(format)
      await onExport(format)
      toast.success(`Exported as ${format.toUpperCase()}`)
    } catch (error) {
      toast.error(`Failed to export as ${format.toUpperCase()}`)
      console.error(error)
    } finally {
      setExportingFormat(null)
    }
  }

  const formatLabels: Record<ExportFormat, string> = {
    excel: "Export as Excel",
    csv: "Export as CSV",
    pdf: "Export as PDF",
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="shadow-soft"
          disabled={isLoading || exportingFormat !== null}
        >
          <Download className="mr-2 h-4 w-4" />
          {exportingFormat ? `Exporting ${exportingFormat.toUpperCase()}...` : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {formats.map((format) => (
          <DropdownMenuItem
            key={format}
            onClick={() => handleExport(format)}
            disabled={exportingFormat !== null}
          >
            {formatLabels[format]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
