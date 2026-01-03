"use client"

import { Filter, X } from "lucide-react"
import { Button } from "@/components/buttons/button"
import { Badge } from "@/components/badges/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/overlays/dropdown-menu"
import { ReactNode } from "react"

export interface FilterValue {
  key: string
  label: string
  value: string
}

interface FilterToolbarProps {
  filters: FilterValue[]
  onRemoveFilter: (key: string) => void
  onClearAll: () => void
  children?: ReactNode
}

export function FilterToolbar({
  filters,
  onRemoveFilter,
  onClearAll,
  children,
}: FilterToolbarProps) {
  if (filters.length === 0 && !children) return null

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-muted/30 rounded-lg">
      {filters.length > 0 && (
        <>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>Filters:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Badge
                key={filter.key}
                variant="secondary"
                className="pl-2 pr-1 shadow-soft"
              >
                <span className="text-xs">
                  {filter.label}: {filter.value}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 hover:bg-transparent"
                  onClick={() => onRemoveFilter(filter.key)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-xs"
          >
            Clear all
          </Button>
        </>
      )}

      {children && (
        <div className="ml-auto flex items-center gap-2">
          {children}
        </div>
      )}
    </div>
  )
}
