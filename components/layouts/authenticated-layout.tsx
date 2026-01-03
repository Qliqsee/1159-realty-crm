"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/common/sidebar"
import { Header } from "@/components/common/header"

interface AuthenticatedLayoutProps {
  children: React.ReactNode
}

// Routes that should NOT show the authenticated layout (Sidebar + Header)
const PUBLIC_ROUTES = ["/login", "/forgot-password", "/reset-password"]

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Check if current route is a public route (should not show layout)
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route))

  // If it's a public route, just render children without layout
  if (isPublicRoute) {
    return <>{children}</>
  }

  // Otherwise, render with authenticated layout (Sidebar + Header)
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
