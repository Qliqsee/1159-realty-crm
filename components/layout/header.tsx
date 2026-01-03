"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Menu, Bell, User, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/buttons/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/overlays/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/display/avatar"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { useAuthStore } from "@/lib/store/auth-store"
import { toast } from "sonner"
import { removeUserCookie } from "@/lib/cookies"
import { ConfirmationDialog } from "@/components/dialogs/confirmation-dialog"
import { cn } from "@/lib/utils"

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const handleLogout = async () => {
    // Remove user from Zustand store and client-side cookie
    logout()

    // Remove server-side cookie
    try {
      await removeUserCookie()
    } catch (error) {
      console.error("Failed to remove user cookie:", error)
    }

    toast.success("Logged out successfully")
    router.push("/login")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="sticky top-0 z-30 w-full bg-card shadow-soft">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left: Menu Button (Mobile) */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <Button variant="outline" size="icon" className="relative shadow-soft">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center shadow-soft">
              3
            </span>
          </Button>

          {/* User Menu */}
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "flex items-center gap-2 shadow-soft hover:shadow-soft-md transition-all",
                  isDropdownOpen && "bg-accent shadow-soft-md"
                )}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profileImage} alt={user?.fullName} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user ? getInitials(user.fullName) : "??"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium">{user?.fullName}</span>
                  <span className="text-xs text-muted-foreground">{user?.role}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setIsDropdownOpen(false)
                  setShowLogoutDialog(true)
                }}
                className="text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Logout Confirmation Dialog */}
          <ConfirmationDialog
            open={showLogoutDialog}
            onOpenChange={setShowLogoutDialog}
            onConfirm={handleLogout}
            title="Confirm Logout"
            description="Are you sure you want to logout? You will need to login again to access your account."
            confirmText="Logout"
            cancelText="Cancel"
            variant="destructive"
          />
        </div>
      </div>
    </header>
  )
}
