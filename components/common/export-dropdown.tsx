"use client"

import { Download, FileText, Table, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type ExportFormat = "pdf" | "excel" | "csv" | "json"

interface ExportDropdownProps {
  onExport: (format: ExportFormat) => void
  formats?: ExportFormat[]
  disabled?: boolean
  loading?: boolean
}

/**
 * ExportDropdown - Multi-format export dropdown
 *
 * Usage:
 * <ExportDropdown
 *   onExport={handleExport}
 *   formats={["pdf", "excel", "csv"]}
 * />
 */
export function ExportDropdown({
  onExport,
  formats = ["pdf", "excel", "csv"],
  disabled = false,
  loading = false,
}: ExportDropdownProps) {
  const exportOptions = [
    {
      format: "pdf" as ExportFormat,
      label: "Export as PDF",
      icon: FileText,
      description: "Portable Document Format",
    },
    {
      format: "excel" as ExportFormat,
      label: "Export as Excel",
      icon: FileSpreadsheet,
      description: "Microsoft Excel (.xlsx)",
    },
    {
      format: "csv" as ExportFormat,
      label: "Export as CSV",
      icon: Table,
      description: "Comma-separated values",
    },
    {
      format: "json" as ExportFormat,
      label: "Export as JSON",
      icon: FileText,
      description: "JavaScript Object Notation",
    },
  ]

  const visibleOptions = exportOptions.filter((option) =>
    formats.includes(option.format)
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={disabled || loading}>
          <Download className="h-4 w-4 mr-2" />
          {loading ? "Exporting..." : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Export Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {visibleOptions.map((option) => {
          const Icon = option.icon
          return (
            <DropdownMenuItem
              key={option.format}
              onClick={() => onExport(option.format)}
            >
              <Icon className="mr-2 h-4 w-4" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{option.label}</span>
                <span className="text-xs text-muted-foreground">
                  {option.description}
                </span>
              </div>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
