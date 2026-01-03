"use client"

import { useState } from "react"
import { DataTable } from "@/components/tables/data-table"
import { PageHeader } from "./page-header"
import { QuickStats, QuickStat } from "./quick-stats"
import { FilterToolbar, FilterValue } from "./filter-toolbar"
import { LoadingSkeleton } from "./loading-skeleton"
import { EmptyState } from "./empty-state"
import { ColumnDef } from "@tanstack/react-table"
import { LucideIcon } from "lucide-react"
import { ReactNode } from "react"

interface DataTableWrapperProps<TData> {
  title: string
  description?: string
  data: TData[]
  columns: ColumnDef<TData, unknown>[]
  searchKey: string
  searchPlaceholder?: string
  isLoading?: boolean
  stats?: QuickStat[]
  filters?: FilterValue[]
  onRemoveFilter?: (key: string) => void
  onClearFilters?: () => void
  actions?: ReactNode
  emptyIcon?: LucideIcon
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: () => void
  emptyActionLabel?: string
}

export function DataTableWrapper<TData>({
  title,
  description,
  data,
  columns,
  searchKey,
  searchPlaceholder,
  isLoading = false,
  stats,
  filters = [],
  onRemoveFilter,
  onClearFilters,
  actions,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  emptyAction,
  emptyActionLabel,
}: DataTableWrapperProps<TData>) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title={title} description={description} />
        {stats && <LoadingSkeleton variant="stat" count={stats.length} />}
        <LoadingSkeleton variant="table" count={5} />
      </div>
    )
  }

  const showEmpty = !isLoading && data.length === 0 && filters.length === 0

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader title={title} description={description} actions={actions} />

      {/* Quick Stats */}
      {stats && stats.length > 0 && <QuickStats stats={stats} />}

      {/* Filter Toolbar */}
      {(filters.length > 0 || onClearFilters) && (
        <FilterToolbar
          filters={filters}
          onRemoveFilter={onRemoveFilter || (() => {})}
          onClearAll={onClearFilters || (() => {})}
        />
      )}

      {/* Data Table or Empty State */}
      {showEmpty && emptyIcon ? (
        <div className="rounded-lg bg-card shadow-soft p-8">
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle || `No ${title.toLowerCase()} found`}
            description={emptyDescription || `Get started by creating your first ${title.toLowerCase().slice(0, -1)}.`}
            actionLabel={emptyActionLabel}
            onAction={emptyAction}
          />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data}
          searchKey={searchKey}
          searchPlaceholder={searchPlaceholder}
        />
      )}
    </div>
  )
}
