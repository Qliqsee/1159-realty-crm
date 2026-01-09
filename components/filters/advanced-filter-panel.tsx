"use client"

import { useState } from "react"
import { Filter, X, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/buttons/button"
import { Input } from "@/components/inputs/input"
import { Label } from "@/components/layout/label"
import { Select } from "@/components/inputs/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/dialogs/sheet"
import { Badge } from "@/components/badges/badge"
import { cn } from "@/lib/utils"

export interface FilterField {
  key: string
  label: string
  type: "text" | "select" | "date" | "number"
  options?: { label: string; value: string }[]
  operators?: string[]
}

export interface FilterCondition {
  id: string
  field: string
  operator: string
  value: string
}

interface AdvancedFilterPanelProps {
  fields: FilterField[]
  onApply: (conditions: FilterCondition[]) => void
  className?: string
}

/**
 * AdvancedFilterPanel - Complex filtering with multiple conditions
 *
 * Usage:
 * const filterFields: FilterField[] = [
 *   { key: "name", label: "Name", type: "text" },
 *   { key: "status", label: "Status", type: "select", options: [...] },
 *   { key: "price", label: "Price", type: "number", operators: ["=", ">", "<"] },
 * ]
 *
 * <AdvancedFilterPanel
 *   fields={filterFields}
 *   onApply={handleApplyFilters}
 * />
 */
export function AdvancedFilterPanel({
  fields,
  onApply,
  className,
}: AdvancedFilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [conditions, setConditions] = useState<FilterCondition[]>([])

  const defaultOperators = {
    text: ["contains", "equals", "starts with", "ends with"],
    select: ["equals", "not equals"],
    date: ["equals", "before", "after"],
    number: ["=", ">", "<", ">=", "<="],
  }

  const addCondition = () => {
    const firstField = fields[0]
    if (!firstField) return

    const newCondition: FilterCondition = {
      id: Math.random().toString(36).substring(7),
      field: firstField.key,
      operator: firstField.operators?.[0] || defaultOperators[firstField.type][0],
      value: "",
    }

    setConditions([...conditions, newCondition])
  }

  const removeCondition = (id: string) => {
    setConditions(conditions.filter((c) => c.id !== id))
  }

  const updateCondition = (
    id: string,
    updates: Partial<FilterCondition>
  ) => {
    setConditions(
      conditions.map((c) => (c.id === id ? { ...c, ...updates } : c))
    )
  }

  const handleApply = () => {
    const validConditions = conditions.filter((c) => c.value)
    onApply(validConditions)
    setIsOpen(false)
  }

  const handleClear = () => {
    setConditions([])
    onApply([])
  }

  const activeFilterCount = conditions.filter((c) => c.value).length

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className={cn("relative", className)}>
          <Filter className="h-4 w-4 mr-2" />
          Advanced Filters
          {activeFilterCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-2 h-5 px-1.5 shadow-soft"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Advanced Filters</SheetTitle>
          <SheetDescription>
            Add multiple conditions to filter your results
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 mt-6">
          {/* Filter Conditions */}
          {conditions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Filter className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No filters added yet</p>
              <p className="text-xs mt-1">
                Click &quot;Add Condition&quot; to start filtering
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {conditions.map((condition, index) => {
                const field = fields.find((f) => f.key === condition.field)
                if (!field) return null

                const operators =
                  field.operators || defaultOperators[field.type]

                return (
                  <div
                    key={condition.id}
                    className="p-3 border rounded-lg bg-muted/30 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">
                        Condition {index + 1}
                      </Label>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeCondition(condition.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Field Selection */}
                    <Select
                      value={condition.field}
                      onValueChange={(value) =>
                        updateCondition(condition.id, { field: value })
                      }
                      placeholder="Select field"
                      triggerClassName="h-9"
                      options={fields.map((field) => ({
                        value: field.key,
                        label: field.label
                      }))}
                    />

                    {/* Operator Selection */}
                    <Select
                      value={condition.operator}
                      onValueChange={(value) =>
                        updateCondition(condition.id, { operator: value })
                      }
                      placeholder="Select operator"
                      triggerClassName="h-9"
                      options={operators.map((op) => ({
                        value: op,
                        label: op
                      }))}
                    />

                    {/* Value Input */}
                    {field.type === "select" ? (
                      <Select
                        value={condition.value}
                        onValueChange={(value) =>
                          updateCondition(condition.id, { value })
                        }
                        placeholder="Select value"
                        triggerClassName="h-9"
                        options={field.options || []}
                      />
                    ) : (
                      <Input
                        type={field.type}
                        placeholder="Enter value"
                        value={condition.value}
                        onChange={(e) =>
                          updateCondition(condition.id, {
                            value: e.target.value,
                          })
                        }
                        className="h-9"
                      />
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Add Condition Button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={addCondition}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Condition
          </Button>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleClear}
              disabled={conditions.length === 0}
            >
              Clear All
            </Button>
            <Button className="flex-1" onClick={handleApply}>
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
