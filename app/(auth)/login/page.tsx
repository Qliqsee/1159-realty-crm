"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/buttons/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/cards/card"
import { Input } from "@/components/inputs/input"
import { Label } from "@/components/layout/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/inputs/select"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { useAuthStore } from "@/lib/store/auth-store"
import { validateLogin, QUICK_LOGIN } from "@/lib/data/mock-users"
import { toast } from "sonner"
import { UserRole } from "@/types"
import { setUserCookie } from "@/lib/cookies"

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string>("")

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role)
    const roleEmail = QUICK_LOGIN[role as keyof typeof QUICK_LOGIN]
    setEmail(roleEmail)
    setPassword("password123")
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error("Please fill in all fields")
      return
    }

    setIsLoading(true)

    // Mock authentication delay
    setTimeout(async () => {
      const user = validateLogin(email, password)

      if (!user) {
        toast.error("Invalid email or password")
        setIsLoading(false)
        return
      }

      // Set user in Zustand store (localStorage)
      login(user)

      // Set user cookie on server-side
      try {
        await setUserCookie(user)
      } catch (error) {
        console.error("Failed to set user cookie:", error)
        toast.error("Failed to save session. Please try again.")
        setIsLoading(false)
        return
      }

      toast.success(`Welcome back, ${user.fullName}!`)
      router.push("/")
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/10 to-background p-4">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md shadow-soft-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary to-yellow-600 flex items-center justify-center shadow-soft-md">
            <span className="text-3xl font-bold text-primary-foreground">1159</span>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-yellow-600 bg-clip-text text-transparent">
            1159 REALTY
          </CardTitle>
          <CardDescription className="text-base">
            CRM & Admin Portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Quick Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role">Quick Login (Testing)</Label>
              <Select value={selectedRole} onValueChange={handleRoleSelect}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role to auto-fill credentials" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="cst">CST (Customer Service)</SelectItem>
                  <SelectItem value="cstManager">CST Manager</SelectItem>
                  <SelectItem value="accounting">Accounting</SelectItem>
                  <SelectItem value="accountingManager">Accounting Manager</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="salesManager">Sales Manager</SelectItem>
                  <SelectItem value="operations">Operations Manager</SelectItem>
                  <SelectItem value="media">Media Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@1159realty.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <Button type="submit" className="w-full shadow-soft-md" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          {/* Demo Info */}
          <div className="mt-6 p-4 rounded-lg bg-muted/50 space-y-2">
            <p className="text-sm font-semibold text-center text-foreground">
              Testing Information
            </p>
            <div className="space-y-1 text-xs text-muted-foreground text-center">
              <p>All users have password: <strong>password123</strong></p>
              <p>Select a role above to auto-fill credentials</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
