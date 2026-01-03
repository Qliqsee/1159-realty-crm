"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { navigationCategories } from "@/lib/navigation"
import { useAuthStore } from "@/lib/store/auth-store"
import { PermissionManager } from "@/lib/permissions/permission-manager"
import type { Permission } from "@/lib/permissions/types"
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react"
import * as LucideIcons from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)
  const [expandedCategory, setExpandedCategory] = useState<string>("")

  const toggleCategory = (label: string) => {
    setExpandedCategory((prev) => (prev === label ? "" : label))
  }

  // Auto-expand category containing active route
  useEffect(() => {
    const findCategoryWithActiveRoute = () => {
      for (const category of navigationCategories) {
        const hasActiveItem = category.items.some(item => item.href === pathname)
        if (hasActiveItem) {
          return category.label
        }
      }
      // Default to first category if no active route found
      return navigationCategories[0]?.label || ""
    }

    const activeCategory = findCategoryWithActiveRoute()
    setExpandedCategory(activeCategory)
  }, [pathname])

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[iconName]
    return Icon ? <Icon className="h-4 w-4" /> : null
  }

  const filterNavItems = (items: typeof navigationCategories[0]["items"]) => {
    if (!user) return []

    return items.filter((item) => {
      // Check permission first (if specified)
      if (item.permission) {
        const hasPermission = PermissionManager.hasPermission(user, item.permission as Permission)
        if (!hasPermission) return false
      }

      // Check role (if specified and permission not used)
      if (item.roles && item.roles.length > 0) {
        const hasRole = item.roles.includes(user.role)
        if (!hasRole) return false
      }

      // If no restrictions or passed checks, show item
      return true
    })
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen bg-card shadow-soft-lg transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto",
          "w-64 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo & Close Button */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-br from-primary/10 to-accent/10">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-yellow-600 flex items-center justify-center shadow-soft">
              <span className="text-lg font-bold text-primary-foreground">1159</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm bg-gradient-to-r from-primary to-yellow-600 bg-clip-text text-transparent">
                1159 REALTY
              </span>
              <span className="text-xs text-muted-foreground">CRM Portal</span>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navigationCategories.map((category) => {
            const filteredItems = filterNavItems(category.items)
            if (filteredItems.length === 0) return null

            const isExpanded = expandedCategory === category.label

            return (
              <div key={category.label}>
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.label)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wide rounded-md transition-colors",
                    "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  <span>{category.label}</span>
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </button>

                {/* Category Items */}
                {isExpanded && (
                  <div className="mt-1 space-y-0.5 ml-2">
                    {filteredItems.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 text-sm rounded-md transition-all",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-soft font-medium"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                          )}
                        >
                          {getIcon(item.icon)}
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className="ml-auto bg-destructive text-destructive-foreground text-xs rounded-full px-2 py-0.5">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* User Info */}
        {user && (
          <div className="p-4 bg-muted/30 mt-auto">
            <div className="text-xs text-muted-foreground mb-1">Logged in as</div>
            <div className="font-medium text-sm truncate">{user.fullName}</div>
            <div className="text-xs text-primary font-semibold mt-0.5">{user.role}</div>
          </div>
        )}
      </aside>
    </>
  )
}
