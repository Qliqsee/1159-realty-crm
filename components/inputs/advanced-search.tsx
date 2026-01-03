"use client"

import { useState } from "react"
import { Search, X, Filter } from "lucide-react"
import { Button } from "@/components/buttons/button"
import { Input } from "@/components/inputs/input"
import { Label } from "@/components/layout/label"
import { Select } from "@/components/inputs/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/overlays/popover"
import { cn } from "@/lib/utils"

export interface SearchField {
  key: string
  label: string
  type: "text" | "select" | "date" | "number"
  options?: { label: string; value: string }[]
  placeholder?: string
}

interface AdvancedSearchProps {
  fields: SearchField[]
  onSearch: (filters: Record<string, string>) => void
  placeholder?: string
  className?: string
}

/**
 * AdvancedSearch - Powerful search with multiple field filters
 *
 * Usage:
 * const searchFields: SearchField[] = [
 *   { key: "name", label: "Name", type: "text", placeholder: "Enter name..." },
 *   { key: "status", label: "Status", type: "select", options: [...] },
 *   { key: "date", label: "Date", type: "date" },
 * ]
 *
 * <AdvancedSearch fields={searchFields} onSearch={handleSearch} />
 */
export function AdvancedSearch({
  fields,
  onSearch,
  placeholder = "Search...",
  className,
}: AdvancedSearchProps) {
  const [quickSearch, setQuickSearch] = useState("")
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [isOpen, setIsOpen] = useState(false)

  const handleQuickSearch = () => {
    onSearch({ quick: quickSearch })
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleAdvancedSearch = () => {
    onSearch(filters)
    setIsOpen(false)
  }

  const handleClearFilters = () => {
    setFilters({})
    setQuickSearch("")
    onSearch({})
  }

  const activeFilterCount = Object.keys(filters).filter(
    (key) => filters[key]
  ).length

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Quick Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={quickSearch}
          onChange={(e) => setQuickSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleQuickSearch()}
          className="pl-9 pr-9"
        />
        {quickSearch && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => setQuickSearch("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Advanced Filter Button */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="relative">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm">Advanced Filters</h4>
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="h-auto p-0 text-xs"
                >
                  Clear all
                </Button>
              )}
            </div>

            {/* Filter Fields */}
            <div className="space-y-3">
              {fields.map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <Label className="text-xs">{field.label}</Label>
                  {field.type === "select" ? (
                    <Select
                      value={filters[field.key] || ""}
                      onValueChange={(value) =>
                        handleFilterChange(field.key, value)
                      }
                      placeholder={field.placeholder || `Select ${field.label}`}
                      triggerClassName="h-9"
                      options={field.options || []}
                    />
                  ) : (
                    <Input
                      type={field.type}
                      placeholder={field.placeholder || field.label}
                      value={filters[field.key] || ""}
                      onChange={(e) =>
                        handleFilterChange(field.key, e.target.value)
                      }
                      className="h-9"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleAdvancedSearch}
                className="flex-1"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Search Button */}
      <Button onClick={handleQuickSearch}>
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </div>
  )
}
