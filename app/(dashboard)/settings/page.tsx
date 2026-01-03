"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/cards/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/navigation/tabs"
import { Button } from "@/components/buttons/button"
import { Input } from "@/components/inputs/input"
import { Label } from "@/components/layout/label"
import { Switch } from "@/components/inputs/switch"
import { Textarea } from "@/components/inputs/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/inputs/select"
import {
  Settings,
  CreditCard,
  Percent,
  Mail,
  MessageSquare,
  Shield,
  Sprout,
  Save,
  RefreshCw,
  Bell,
  Globe,
  Database,
} from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (section: string) => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    toast.success(`${section} settings saved successfully`)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings & Configuration</h1>
          <p className="text-muted-foreground mt-1">
            Manage system settings, integrations, and configurations
          </p>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Permissions
          </TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-6">
          {/* System Settings */}
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <CardTitle>System Settings</CardTitle>
              </div>
              <CardDescription>Configure general system preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    defaultValue="1159 REALTY"
                    className="shadow-soft"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input
                    id="support-email"
                    type="email"
                    defaultValue="support@1159realty.com"
                    className="shadow-soft"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-phone">Support Phone</Label>
                  <Input
                    id="support-phone"
                    defaultValue="+234 800 1159 000"
                    className="shadow-soft"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="africa-lagos">
                    <SelectTrigger className="shadow-soft">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="africa-lagos">Africa/Lagos (WAT)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="africa-cairo">Africa/Cairo (EET)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select defaultValue="ngn">
                    <SelectTrigger className="shadow-soft">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ngn">Nigerian Naira (₦)</SelectItem>
                      <SelectItem value="usd">US Dollar ($)</SelectItem>
                      <SelectItem value="gbp">British Pound (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select defaultValue="dd-mm-yyyy">
                    <SelectTrigger className="shadow-soft">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable to temporarily disable public access
                  </p>
                </div>
                <Switch id="maintenance-mode" />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-backup">Automatic Backups</Label>
                  <p className="text-sm text-muted-foreground">
                    Daily database backups at 2:00 AM
                  </p>
                </div>
                <Switch id="auto-backup" defaultChecked />
              </div>

              <Button onClick={() => handleSave("General")} disabled={isSaving} className="shadow-soft">
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings Tab */}
        <TabsContent value="payment" className="space-y-6">
          {/* Payment Gateway Configuration */}
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <CardTitle>Payment Gateway Configuration</CardTitle>
              </div>
              <CardDescription>Configure payment processing settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="payment-provider">Payment Provider</Label>
                <Select defaultValue="paystack">
                  <SelectTrigger className="shadow-soft">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paystack">Paystack</SelectItem>
                    <SelectItem value="flutterwave">Flutterwave</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="public-key">Public Key</Label>
                <Input
                  id="public-key"
                  type="password"
                  placeholder="pk_live_xxxxxxxxxxxxx"
                  className="shadow-soft"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="secret-key">Secret Key</Label>
                <Input
                  id="secret-key"
                  type="password"
                  placeholder="sk_live_xxxxxxxxxxxxx"
                  className="shadow-soft"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="space-y-0.5">
                  <Label htmlFor="test-mode">Test Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Use test credentials for development
                  </p>
                </div>
                <Switch id="test-mode" />
              </div>

              <Button onClick={() => handleSave("Payment Gateway")} disabled={isSaving} className="shadow-soft">
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>

          {/* Interest Rate Settings */}
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Percent className="h-5 w-5 text-primary" />
                <CardTitle>Interest Rate Settings</CardTitle>
              </div>
              <CardDescription>Configure installment interest rates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="default-interest">Default Interest Rate (%)</Label>
                  <Input
                    id="default-interest"
                    type="number"
                    step="0.1"
                    defaultValue="12"
                    className="shadow-soft"
                  />
                  <p className="text-xs text-muted-foreground">Applied to installment payments</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="premium-interest">Premium Rate (%)</Label>
                  <Input
                    id="premium-interest"
                    type="number"
                    step="0.1"
                    defaultValue="8"
                    className="shadow-soft"
                  />
                  <p className="text-xs text-muted-foreground">For premium/VIP clients</p>
                </div>
              </div>

              <Button onClick={() => handleSave("Interest Rates")} disabled={isSaving} className="shadow-soft">
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>

          {/* Overdue Penalty Settings */}
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Percent className="h-5 w-5 text-red-600 dark:text-red-400" />
                <CardTitle>Overdue Penalty Settings</CardTitle>
              </div>
              <CardDescription>Configure penalties for late payments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="penalty-rate">Penalty Rate (%)</Label>
                  <Input
                    id="penalty-rate"
                    type="number"
                    step="0.1"
                    defaultValue="5"
                    className="shadow-soft"
                  />
                  <p className="text-xs text-muted-foreground">Applied per month overdue</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grace-period">Grace Period (days)</Label>
                  <Input
                    id="grace-period"
                    type="number"
                    defaultValue="7"
                    className="shadow-soft"
                  />
                  <p className="text-xs text-muted-foreground">Before penalty is applied</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-penalty">Automatic Penalty Application</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically apply penalties to overdue invoices
                  </p>
                </div>
                <Switch id="auto-penalty" defaultChecked />
              </div>

              <Button onClick={() => handleSave("Overdue Penalties")} disabled={isSaving} className="shadow-soft">
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>

          {/* Farming Fee Settings */}
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sprout className="h-5 w-5 text-green-600 dark:text-green-400" />
                <CardTitle>Farming Fee Settings</CardTitle>
              </div>
              <CardDescription>Configure farming fee for land properties</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="farming-fee">Annual Farming Fee (₦)</Label>
                  <Input
                    id="farming-fee"
                    type="number"
                    defaultValue="50000"
                    className="shadow-soft"
                  />
                  <p className="text-xs text-muted-foreground">Per plot per year</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="farming-due-day">Payment Due Day</Label>
                  <Select defaultValue="1">
                    <SelectTrigger className="shadow-soft">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st of every month</SelectItem>
                      <SelectItem value="15">15th of every month</SelectItem>
                      <SelectItem value="custom">Custom schedule</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="space-y-0.5">
                  <Label htmlFor="enforce-30day">Enforce 30-Day Rule</Label>
                  <p className="text-sm text-muted-foreground">
                    Require farming fee within 30 days of enrollment
                  </p>
                </div>
                <Switch id="enforce-30day" defaultChecked />
              </div>

              <Button onClick={() => handleSave("Farming Fee")} disabled={isSaving} className="shadow-soft">
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          {/* Email Templates */}
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <CardTitle>Email Templates</CardTitle>
              </div>
              <CardDescription>Configure email notification templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email-template">Template Type</Label>
                <Select defaultValue="welcome">
                  <SelectTrigger className="shadow-soft">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="welcome">Welcome Email</SelectItem>
                    <SelectItem value="payment-reminder">Payment Reminder</SelectItem>
                    <SelectItem value="payment-confirmation">Payment Confirmation</SelectItem>
                    <SelectItem value="kyc-approval">KYC Approval</SelectItem>
                    <SelectItem value="kyc-rejection">KYC Rejection</SelectItem>
                    <SelectItem value="enrollment">Enrollment Confirmation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-subject">Email Subject</Label>
                <Input
                  id="email-subject"
                  defaultValue="Welcome to 1159 Realty"
                  className="shadow-soft"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-body">Email Body</Label>
                <Textarea
                  id="email-body"
                  rows={8}
                  className="shadow-soft font-mono text-sm"
                  defaultValue={`Hello {{firstName}},

Welcome to 1159 Realty! We're excited to have you on board.

Your account has been created successfully. You can now:
- Browse available properties
- Complete your KYC
- Make payments and track your enrollments

Best regards,
The 1159 Realty Team`}
                />
                <p className="text-xs text-muted-foreground">
                  Available variables: {"{"}firstName{"}"}, {"{"}lastName{"}"}, {"{"}email{"}"}, {"{"}propertyName{"}"}
                </p>
              </div>

              <Button onClick={() => handleSave("Email Template")} disabled={isSaving} className="shadow-soft">
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Template"}
              </Button>
            </CardContent>
          </Card>

          {/* SMS Templates */}
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <CardTitle>SMS Templates</CardTitle>
              </div>
              <CardDescription>Configure SMS notification templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="sms-template">Template Type</Label>
                <Select defaultValue="payment-reminder">
                  <SelectTrigger className="shadow-soft">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="payment-reminder">Payment Reminder</SelectItem>
                    <SelectItem value="payment-confirmation">Payment Confirmation</SelectItem>
                    <SelectItem value="appointment">Appointment Reminder</SelectItem>
                    <SelectItem value="overdue">Overdue Notice</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sms-body">SMS Message</Label>
                <Textarea
                  id="sms-body"
                  rows={4}
                  className="shadow-soft"
                  defaultValue="Hi {{firstName}}, your next payment of {{amount}} is due on {{dueDate}}. Pay now: {{paymentLink}}"
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum 160 characters • Available variables: {"{"}firstName{"}"}, {"{"}amount{"}"}, {"{"}dueDate{"}"}
                </p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-enabled">Enable SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send automated SMS notifications
                  </p>
                </div>
                <Switch id="sms-enabled" defaultChecked />
              </div>

              <Button onClick={() => handleSave("SMS Template")} disabled={isSaving} className="shadow-soft">
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Template"}
              </Button>
            </CardContent>
          </Card>

          {/* WhatsApp Settings */}
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
                <CardTitle>WhatsApp Business API</CardTitle>
              </div>
              <CardDescription>Configure WhatsApp alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="whatsapp-number">Business Phone Number</Label>
                <Input
                  id="whatsapp-number"
                  placeholder="+234 800 0000 000"
                  className="shadow-soft"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp-api-key">API Key</Label>
                <Input
                  id="whatsapp-api-key"
                  type="password"
                  placeholder="Enter WhatsApp Business API key"
                  className="shadow-soft"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="space-y-0.5">
                  <Label htmlFor="whatsapp-alerts">Sales Team Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Send WhatsApp alerts to sales team for new leads
                  </p>
                </div>
                <Switch id="whatsapp-alerts" defaultChecked />
              </div>

              <Button onClick={() => handleSave("WhatsApp")} disabled={isSaving} className="shadow-soft">
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-6">
          {/* Role Permissions Configuration */}
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Role Permissions Configuration</CardTitle>
              </div>
              <CardDescription>Manage access control for different user roles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="role-select">Select Role</Label>
                <Select defaultValue="agent">
                  <SelectTrigger className="shadow-soft">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="agent">Agent</SelectItem>
                    <SelectItem value="cst">CST</SelectItem>
                    <SelectItem value="accounting">Accounting</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium">Module Permissions</p>
                {[
                  { module: "Leads", permissions: ["view", "create", "edit", "delete"] },
                  { module: "Properties", permissions: ["view", "create", "edit", "delete"] },
                  { module: "Clients", permissions: ["view", "create", "edit", "delete"] },
                  { module: "Enrollments", permissions: ["view", "create", "edit", "delete"] },
                  { module: "Analytics", permissions: ["view"] },
                  { module: "Settings", permissions: ["view", "edit"] },
                ].map((item) => (
                  <div key={item.module} className="p-4 rounded-lg bg-muted/30">
                    <p className="font-medium mb-3">{item.module}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {item.permissions.map((perm) => (
                        <div key={perm} className="flex items-center space-x-2">
                          <Switch id={`${item.module}-${perm}`} defaultChecked={perm === "view"} />
                          <Label htmlFor={`${item.module}-${perm}`} className="text-sm capitalize">
                            {perm}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <Button onClick={() => handleSave("Role Permissions")} disabled={isSaving} className="shadow-soft">
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Permissions"}
              </Button>
            </CardContent>
          </Card>

          {/* Release Configuration */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Release Configuration</CardTitle>
              <CardDescription>Configure auto-release settings for commissions and refunds</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="release-mode">Release Mode</Label>
                <Select defaultValue="auto-all">
                  <SelectTrigger className="shadow-soft">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto-all">Auto-release for all except specified users</SelectItem>
                    <SelectItem value="auto-specific">Auto-release only for specified users</SelectItem>
                    <SelectItem value="manual">Manual approval required for all</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="release-threshold">Auto-Release Threshold (₦)</Label>
                <Input
                  id="release-threshold"
                  type="number"
                  defaultValue="500000"
                  className="shadow-soft"
                />
                <p className="text-xs text-muted-foreground">
                  Amounts above this require manual approval
                </p>
              </div>

              <Button onClick={() => handleSave("Release Configuration")} disabled={isSaving} className="shadow-soft">
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* System Information */}
      <Card className="shadow-soft border-muted">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-muted-foreground">System Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <div>
              <p className="text-muted-foreground">Version</p>
              <p className="font-medium">v1.0.0</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Backup</p>
              <p className="font-medium">Today, 2:00 AM</p>
            </div>
            <div>
              <p className="text-muted-foreground">Database Size</p>
              <p className="font-medium">2.4 GB</p>
            </div>
            <div>
              <p className="text-muted-foreground">Uptime</p>
              <p className="font-medium">45 days</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
