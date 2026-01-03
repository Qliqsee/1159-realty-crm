"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/buttons/button"
import { Input } from "@/components/inputs/input"
import { Label } from "@/components/layout/label"
import { Select } from "@/components/inputs/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/display/table"
import { Badge } from "@/components/badges/badge"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { z } from "zod"

export interface CSVColumnMapping {
  csvColumn: string
  targetField: string
  label: string
  required?: boolean
}

export interface CSVImportTableProps<T extends z.ZodType> {
  csvData: string[][] // Parsed CSV data (rows of columns)
  schema: T // Zod schema for validation
  fieldMappings: CSVColumnMapping[] // Expected fields with labels
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
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({})
  const [tableData, setTableData] = useState<Record<string, any>[]>([])
  const [validationErrors, setValidationErrors] = useState<Record<number, Record<string, string>>>({})
  const [editingCell, setEditingCell] = useState<{ row: number; field: string } | null>(null)

  // Initialize: Extract headers and auto-match columns
  useEffect(() => {
    if (csvData.length === 0) return

    const headers = csvData[0].map(h => h.trim())
    setCsvHeaders(headers)

    // Auto-match columns based on field names
    const autoMapping: Record<string, string> = {}
    fieldMappings.forEach(({ targetField, label }) => {
      const matchedHeader = headers.find(
        h => h.toLowerCase() === targetField.toLowerCase() ||
             h.toLowerCase() === label.toLowerCase() ||
             h.toLowerCase().replace(/\s+/g, '') === targetField.toLowerCase().replace(/\s+/g, '')
      )
      if (matchedHeader) {
        autoMapping[targetField] = matchedHeader
      }
    })
    setColumnMapping(autoMapping)

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
  }, [csvData, fieldMappings])

  // Validate all rows whenever data or mapping changes
  useEffect(() => {
    validateAllRows()
  }, [tableData, columnMapping])

  const validateAllRows = () => {
    const errors: Record<number, Record<string, string>> = {}

    tableData.forEach((row, rowIndex) => {
      const mappedRow: Record<string, any> = {}

      // Map CSV columns to target fields
      fieldMappings.forEach(({ targetField }) => {
        const csvColumn = columnMapping[targetField]
        mappedRow[targetField] = csvColumn ? row[csvColumn] : ""
      })

      // Validate with Zod schema
      const result = schema.safeParse(mappedRow)
      if (!result.success) {
        const rowErrors: Record<string, string> = {}
        result.error.errors.forEach(err => {
          const field = err.path[0] as string
          rowErrors[field] = err.message
        })
        errors[rowIndex] = rowErrors
      }
    })

    setValidationErrors(errors)
  }

  const handleCellEdit = (rowIndex: number, field: string, value: string) => {
    const csvColumn = columnMapping[field]
    if (!csvColumn) return

    const newData = [...tableData]
    newData[rowIndex][csvColumn] = value
    setTableData(newData)
  }

  const handleSubmit = () => {
    // Check if there are any validation errors
    if (Object.keys(validationErrors).length > 0) {
      return // Don't submit if there are errors
    }

    // Map and validate all data
    const mappedData = tableData.map(row => {
      const mappedRow: Record<string, any> = {}
      fieldMappings.forEach(({ targetField }) => {
        const csvColumn = columnMapping[targetField]
        mappedRow[targetField] = csvColumn ? row[csvColumn] : ""
      })
      return mappedRow
    })

    // Parse with schema (should all be valid at this point)
    const validatedData = mappedData.map(row => schema.parse(row))
    onSubmit(validatedData)
  }

  const invalidCount = Object.keys(validationErrors).length
  const validCount = tableData.length - invalidCount

  return (
    <div className="space-y-4">
      {/* Column Mapping Section */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h3 className="font-medium mb-3">Map CSV Columns to Fields</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {fieldMappings.map(({ targetField, label, required }) => (
            <div key={targetField} className="space-y-1.5">
              <Label className="text-xs">
                {label} {required && <span className="text-destructive">*</span>}
              </Label>
              <Select
                value={columnMapping[targetField] || ""}
                onValueChange={(value) => setColumnMapping(prev => ({ ...prev, [targetField]: value }))}
                placeholder="Select column"
                triggerClassName="h-8 text-xs"
                options={[
                  { value: "", label: "-- Not mapped --" },
                  ...csvHeaders.map(header => ({
                    value: header,
                    label: header
                  }))
                ]}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Validation Summary */}
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
        <Badge variant={invalidCount === 0 ? "default" : "destructive"}>
          {tableData.length} total records
        </Badge>
      </div>

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
                      const csvColumn = columnMapping[targetField]
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
                Please fix all validation errors before importing
              </p>
              <p className="text-muted-foreground text-xs">
                Rows with errors are highlighted in red. Click any cell to edit it.
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
          disabled={isLoading || invalidCount > 0}
        >
          {isLoading ? "Importing..." : `Import ${validCount} Record${validCount !== 1 ? "s" : ""}`}
        </Button>
      </div>
    </div>
  )
}
