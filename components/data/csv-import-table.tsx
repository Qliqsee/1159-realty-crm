"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/buttons/button"
import { Input } from "@/components/inputs/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/display/table"
import { Badge } from "@/components/badges/badge"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { z } from "zod"

export interface CSVFieldMapping {
  targetField: string
  label: string
  required?: boolean
}

export interface CSVImportTableProps<T extends z.ZodType> {
  csvData: string[][] // Parsed CSV data (rows of columns)
  schema: T // Zod schema for validation
  fieldMappings: CSVFieldMapping[] // Expected fields with labels
  onSubmit: (validatedData: z.infer<T>[]) => void | Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function CSVImportTable<T extends z.ZodType>({
  csvData,
  schema,
  fieldMappings,
  onSubmit,
  onCancel,
  isLoading = false,
}: CSVImportTableProps<T>) {
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [tableData, setTableData] = useState<Record<string, any>[]>([])
  const [validationErrors, setValidationErrors] = useState<Record<number, Record<string, string>>>({})
  const [editingCell, setEditingCell] = useState<{ row: number; field: string } | null>(null)

  // Initialize: Extract headers and convert CSV to table data
  useEffect(() => {
    if (csvData.length === 0) return

    const headers = csvData[0].map(h => h.trim())
    setCsvHeaders(headers)

    // Convert CSV rows to objects
    const rows = csvData.slice(1).map((row, index) => {
      const rowData: Record<string, any> = { _index: index }
      headers.forEach((header, colIndex) => {
        rowData[header] = row[colIndex]?.trim() || ""
      })
      return rowData
    }).filter(row => {
      // Filter out completely empty rows
      const values = Object.keys(row).filter(k => k !== '_index').map(k => row[k])
      return values.some(v => v !== "")
    })

    setTableData(rows)
    // Clear any previous validation errors when new data is loaded
    setValidationErrors({})
  }, [csvData, fieldMappings])

  const handleCellEdit = (rowIndex: number, field: string, value: string) => {
    // Find the matching CSV column for this field
    const csvColumn = csvHeaders.find(
      h => h.toLowerCase() === field.toLowerCase() ||
           h.toLowerCase().replace(/\s+/g, '') === field.toLowerCase().replace(/\s+/g, '')
    )

    if (!csvColumn) return

    const newData = [...tableData]
    newData[rowIndex][csvColumn] = value
    setTableData(newData)
  }

  const handleSubmit = () => {
    const errors: Record<number, Record<string, string>> = {}

    // Map and validate all data
    const mappedData = tableData.map((row, rowIndex) => {
      const mappedRow: Record<string, any> = {}

      // Map CSV columns to target fields by matching column names
      fieldMappings.forEach(({ targetField }) => {
        const csvColumn = csvHeaders.find(
          h => h.toLowerCase() === targetField.toLowerCase() ||
               h.toLowerCase().replace(/\s+/g, '') === targetField.toLowerCase().replace(/\s+/g, '')
        )
        mappedRow[targetField] = csvColumn ? row[csvColumn] : ""
      })

      // Validate with Zod schema
      const result = schema.safeParse(mappedRow)
      if (!result.success) {
        const rowErrors: Record<string, string> = {}
        result.error.issues.forEach((err) => {
          const field = err.path[0] as string
          rowErrors[field] = err.message
        })
        errors[rowIndex] = rowErrors
      }

      return mappedRow
    })

    // If there are validation errors, show them and don't submit
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    // All valid - parse and submit
    try {
      const validatedData = mappedData.map(row => schema.parse(row))
      onSubmit(validatedData)
    } catch (error) {
      console.error("Unexpected validation error during submit:", error)
    }
  }

  const invalidCount = Object.keys(validationErrors).length
  const validCount = tableData.length - invalidCount

  return (
    <div className="space-y-4">
      {/* Expected Columns Info */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h3 className="font-medium mb-2">Expected CSV Columns</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Your CSV file should contain the following columns (case-insensitive):
        </p>
        <div className="flex flex-wrap gap-2">
          {fieldMappings.map(({ targetField, label, required }) => (
            <Badge key={targetField} variant={required ? "default" : "secondary"}>
              {label} {required && "*"}
            </Badge>
          ))}
        </div>
      </div>

      {/* Validation Summary - only show after validation attempt */}
      {invalidCount > 0 && (
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="font-medium">{validCount} valid</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="font-medium">{invalidCount} invalid</span>
            </div>
          </div>
          <Badge variant="destructive">
            {tableData.length} total records
          </Badge>
        </div>
      )}

      {/* Editable Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="max-h-[400px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-muted">
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                {fieldMappings.map(({ targetField, label }) => (
                  <TableHead key={targetField} className="min-w-[150px]">
                    {label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row, rowIndex) => {
                const hasErrors = validationErrors[rowIndex]
                return (
                  <TableRow
                    key={rowIndex}
                    className={hasErrors ? "bg-destructive/5 border-l-4 border-l-destructive" : ""}
                  >
                    <TableCell className="font-medium text-muted-foreground">
                      {rowIndex + 1}
                    </TableCell>
                    {fieldMappings.map(({ targetField }) => {
                      // Find matching CSV column for this field
                      const csvColumn = csvHeaders.find(
                        h => h.toLowerCase() === targetField.toLowerCase() ||
                             h.toLowerCase().replace(/\s+/g, '') === targetField.toLowerCase().replace(/\s+/g, '')
                      )
                      const value = csvColumn ? row[csvColumn] : ""
                      const error = hasErrors?.[targetField]
                      const isEditing = editingCell?.row === rowIndex && editingCell?.field === targetField

                      return (
                        <TableCell key={targetField} className="p-0">
                          {isEditing ? (
                            <Input
                              autoFocus
                              value={value}
                              onChange={(e) => handleCellEdit(rowIndex, targetField, e.target.value)}
                              onBlur={() => setEditingCell(null)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === "Escape") {
                                  setEditingCell(null)
                                }
                              }}
                              className={`border-0 h-10 ${error ? "border-destructive text-destructive" : ""}`}
                            />
                          ) : (
                            <div
                              onClick={() => setEditingCell({ row: rowIndex, field: targetField })}
                              className={`px-3 py-2 h-10 cursor-pointer hover:bg-muted/50 ${error ? "text-destructive border-l-2 border-l-destructive" : ""}`}
                              title={error || "Click to edit"}
                            >
                              {value || <span className="text-muted-foreground italic">empty</span>}
                            </div>
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Error Messages */}
      {invalidCount > 0 && (
        <div className="p-3 border border-destructive rounded-lg bg-destructive/5">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
            <div className="space-y-1 text-sm">
              <p className="font-medium text-destructive">
                Validation failed - {invalidCount} row{invalidCount !== 1 ? "s have" : " has"} errors
              </p>
              <p className="text-muted-foreground text-xs">
                Rows with errors are highlighted in red. Click any cell to edit it, then click Import again to revalidate.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Importing..." : `Import ${tableData.length} Record${tableData.length !== 1 ? "s" : ""}`}
        </Button>
      </div>
    </div>
  )
}
