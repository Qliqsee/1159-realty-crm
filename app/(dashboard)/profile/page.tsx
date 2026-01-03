"use client"

import { useState } from "react"
import { useAuthStore } from "@/lib/store/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/common/status-badge"
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Camera,
  Save,
  Lock,
  Activity,
} from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    email: user?.email || "",
  })

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleSave = async () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      updateUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        email: formData.email,
      })

      toast.success("Profile updated successfully")
      setIsEditing(false)
      setIsSaving(false)
    }, 1000)
  }

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      email: user?.email || "",
    })
    setIsEditing(false)
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    )
  }

  const statusColors = {
    Active: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
    Inactive: "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300",
    Suspended: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Header Card */}
      <Card className="shadow-soft">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Avatar */}
            <div className="relative group">
              <Avatar className="h-24 w-24 ring-4 ring-background shadow-soft">
                <AvatarImage src={user.avatar} alt={user.fullName} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-yellow-600 text-primary-foreground text-2xl">
                  {getInitials(user.fullName)}
                </AvatarFallback>
              </Avatar>
              <button
                className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground shadow-soft opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => toast.info("Avatar upload coming soon")}
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{user.fullName}</h2>
                <StatusBadge
                  status={user.status}
                  className={statusColors[user.status]}
                />
              </div>
              <div className="grid gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="font-medium">{user.role}</span>
                  {user.department && <span>• {user.department}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{user.phone}</span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} className="shadow-soft">
                <User className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>
              {isEditing ? "Update your personal details" : "Your personal details"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 shadow-soft"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="flex-1 shadow-soft"
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                    <p className="text-base font-medium">{user.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                    <p className="text-base">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                    <p className="text-base">{user.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">User ID</p>
                    <p className="text-base font-mono text-sm">{user.id}</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Information
            </CardTitle>
            <CardDescription>Your role and access details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Role</p>
              <p className="text-base font-medium">{user.role}</p>
            </div>
            {user.department && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Department</p>
                <p className="text-base">{user.department}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-muted-foreground">Account Status</p>
              <div className="mt-1">
                <StatusBadge
                  status={user.status}
                  className={statusColors[user.status]}
                />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Member Since</p>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-base">
                  {format(new Date(user.createdAt), "MMMM dd, yyyy")}
                </p>
              </div>
            </div>
            {user.lastLogin && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Login</p>
                <div className="flex items-center gap-2 mt-1">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <p className="text-base">
                    {format(new Date(user.lastLogin), "MMM dd, yyyy 'at' hh:mm a")}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Security Section */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>Manage your password and security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div>
              <p className="font-medium">Password</p>
              <p className="text-sm text-muted-foreground">
                Last updated: Never
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => toast.info("Password change coming soon")}
              className="shadow-soft"
            >
              Change Password
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => toast.info("2FA setup coming soon")}
              className="shadow-soft"
            >
              Enable 2FA
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Permissions Section */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Permissions
          </CardTitle>
          <CardDescription>Your role-based access permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground mb-3">
              You have <strong>{user.permissions?.length || 0}</strong> permission modules assigned to your role.
            </p>
            <div className="flex flex-wrap gap-2">
              {user.permissions && user.permissions.length > 0 ? (
                user.permissions.map((permission, index) => (
                  <div
                    key={index}
                    className="px-3 py-1.5 rounded-md bg-primary/10 text-primary text-sm font-medium"
                  >
                    {permission.module}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic">No permissions assigned</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
