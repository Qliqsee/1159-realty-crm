"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/cards/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/navigation/tabs"
import { Button } from "@/components/buttons/button"
import { SearchInput } from "@/components/inputs/search-input"
import { Badge } from "@/components/badges/badge"
import {
  Users,
  DollarSign,
  TrendingUp,
  UserCheck,
  Link2,
  Filter,
  Download,
  Eye,
  Copy,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart3,
  Target,
} from "lucide-react"
import { useAuthStore } from "@/lib/store/auth-store"
import { toast } from "sonner"

export default function AgentDashboardPage() {
  const user = useAuthStore((state) => state.user)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("clients")

  // Mock data - in production, these would come from API
  const agentMetrics = {
    totalClients: 45,
    activeEnrollments: 32,
    totalCommissions: "₦47.3M",
    pendingCommissions: "₦8.5M",
    conversionRate: 42,
    newLeadsThisMonth: 12,
  }

  const enrolledClients = [
    {
      id: "1",
      name: "John Adebayo",
      email: "john.adebayo@email.com",
      phone: "+234 801 234 5678",
      property: "Lekki Gardens Phase 2",
      enrollmentDate: "2024-01-15",
      paymentType: "Installment",
      totalAmount: "₦3,500,000",
      amountPaid: "₦2,100,000",
      progress: 60,
      status: "Ongoing",
      commission: "₦1,470,000",
      commissionStatus: "Pending",
    },
    {
      id: "2",
      name: "Sarah Okafor",
      email: "sarah.okafor@email.com",
      phone: "+234 802 345 6789",
      property: "Abuja Estate Phase 1",
      enrollmentDate: "2024-02-20",
      paymentType: "Outright",
      totalAmount: "₦5,200,000",
      amountPaid: "₦5,200,000",
      progress: 100,
      status: "Completed",
      commission: "₦3,640,000",
      commissionStatus: "Paid",
    },
    {
      id: "3",
      name: "Michael Chen",
      email: "michael.chen@email.com",
      phone: "+234 803 456 7890",
      property: "Ibeju Commercial Land",
      enrollmentDate: "2024-03-10",
      paymentType: "Installment",
      totalAmount: "₦4,800,000",
      amountPaid: "₦1,200,000",
      progress: 25,
      status: "Ongoing",
      commission: "₦840,000",
      commissionStatus: "Pending",
    },
    {
      id: "4",
      name: "Fatima Hassan",
      email: "fatima.hassan@email.com",
      phone: "+234 804 567 8901",
      property: "Victoria Island Apartment",
      enrollmentDate: "2024-01-08",
      paymentType: "Installment",
      totalAmount: "₦6,500,000",
      amountPaid: "₦6,500,000",
      progress: 100,
      status: "Completed",
      commission: "₦4,550,000",
      commissionStatus: "Paid",
    },
    {
      id: "5",
      name: "David Okonkwo",
      email: "david.okonkwo@email.com",
      phone: "+234 805 678 9012",
      property: "Epe Farmland 500sqm",
      enrollmentDate: "2024-03-25",
      paymentType: "Installment",
      totalAmount: "₦2,100,000",
      amountPaid: "₦420,000",
      progress: 20,
      status: "Ongoing",
      commission: "₦294,000",
      commissionStatus: "Pending",
    },
  ]

  const performanceMetrics = [
    { month: "Jan", sales: 8, revenue: "₦12.5M", commission: "₦8.75M" },
    { month: "Feb", sales: 12, revenue: "₦18.3M", commission: "₦12.81M" },
    { month: "Mar", sales: 15, revenue: "₦21.8M", commission: "₦15.26M" },
    { month: "Apr", sales: 10, revenue: "₦14.7M", commission: "₦10.29M" },
  ]

  const handleGeneratePaymentLink = (clientName: string) => {
    const paymentLink = `https://pay.1159realty.com/pay/${Math.random().toString(36).substr(2, 9)}`
    navigator.clipboard.writeText(paymentLink)
    toast.success(`Payment link generated for ${clientName}`, {
      description: "Link copied to clipboard",
    })
  }

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link)
    toast.success("Link copied to clipboard")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
      case "Ongoing":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
      case "Freeze":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
      case "Cancelled":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getCommissionStatusIcon = (status: string) => {
    switch (status) {
      case "Paid":
        return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      case "Cancelled":
        return <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Agent Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome, {user?.firstName}! Manage your clients and track your commissions
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="shadow-soft">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button className="shadow-soft">
            <Link2 className="mr-2 h-4 w-4" />
            Generate Payment Link
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-soft hover:shadow-soft-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Enrolled Clients
            </CardTitle>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agentMetrics.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              {agentMetrics.activeEnrollments} active enrollments
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-soft-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Commissions
            </CardTitle>
            <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-lg">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agentMetrics.totalCommissions}</div>
            <p className="text-xs text-green-600 dark:text-green-400">
              70% of all sales in tree
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-soft-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Conversion Rate
            </CardTitle>
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
              <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agentMetrics.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {agentMetrics.newLeadsThisMonth} new leads this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs: Clients vs Performance */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="clients" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Clients
          </TabsTrigger>
          <TabsTrigger value="commissions" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Commissions
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        {/* Clients Tab */}
        <TabsContent value="clients" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search clients by name, email, or property..."
              className="flex-1"
            />
            <Button variant="outline" className="shadow-soft">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Client Cards */}
          <div className="space-y-4">
            {enrolledClients.map((client) => (
              <Card key={client.id} className="shadow-soft hover:shadow-soft-md transition-shadow">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <UserCheck className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{client.name}</CardTitle>
                        <CardDescription>
                          {client.email} • {client.phone}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getStatusColor(client.status)}>
                        {client.status}
                      </Badge>
                      <Badge variant="outline" className="shadow-soft">
                        {client.paymentType}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Property Info */}
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-sm text-muted-foreground">Property</p>
                    <p className="font-medium">{client.property}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Enrolled on {new Date(client.enrollmentDate).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Payment Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Payment Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {client.amountPaid} / {client.totalAmount}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-yellow-500 transition-all"
                        style={{ width: `${client.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{client.progress}% completed</p>
                  </div>

                  {/* Commission Info */}
                  <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-primary/5">
                    <div>
                      <p className="text-xs text-muted-foreground">Your Commission (70%)</p>
                      <p className="text-lg font-bold text-primary">{client.commission}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getCommissionStatusIcon(client.commissionStatus)}
                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        <p className="text-sm font-medium">{client.commissionStatus}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="shadow-soft"
                      onClick={() => handleGeneratePaymentLink(client.name)}
                    >
                      <Link2 className="mr-2 h-4 w-4" />
                      Generate Payment Link
                    </Button>
                    <Button size="sm" variant="outline" className="shadow-soft">
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Commissions Tab */}
        <TabsContent value="commissions" className="space-y-6">
          {/* Commission Summary */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Total Earned</CardTitle>
                <CardDescription>Lifetime commission earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{agentMetrics.totalCommissions}</div>
                <p className="text-sm text-muted-foreground mt-2">
                  From {enrolledClients.length} enrolled clients
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Pending Release</CardTitle>
                <CardDescription>Awaiting payment release</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {agentMetrics.pendingCommissions}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  From {enrolledClients.filter(c => c.commissionStatus === "Pending").length} active enrollments
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Commission Breakdown */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Commission Breakdown by Client</CardTitle>
              <CardDescription>Detailed earnings from each enrollment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {enrolledClients.map((client) => (
                  <div key={client.id} className="p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium">{client.name}</p>
                        <p className="text-xs text-muted-foreground">{client.property}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{client.commission}</p>
                        <div className="flex items-center gap-1 justify-end">
                          {getCommissionStatusIcon(client.commissionStatus)}
                          <span className="text-xs text-muted-foreground">{client.commissionStatus}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Total: {client.totalAmount}</span>
                      <span>Paid: {client.amountPaid} ({client.progress}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Commission Note */}
          <Card className="shadow-soft border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <DollarSign className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Commission Structure</p>
                  <p className="text-sm text-muted-foreground">
                    As an agent, you earn <strong className="text-primary">70% commission</strong> on all sales in your tree,
                    including direct enrollments and referrals from your network. Commissions are released based on the
                    configured payment schedule.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          {/* Performance Metrics */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-soft">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  This Month Sales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
                <p className="text-xs text-green-600 dark:text-green-400">+25% from last month</p>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  This Month Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦21.8M</div>
                <p className="text-xs text-green-600 dark:text-green-400">+19% from last month</p>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  This Month Commission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">₦15.26M</div>
                <p className="text-xs text-green-600 dark:text-green-400">+19% from last month</p>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg Deal Size
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦1.45M</div>
                <p className="text-xs text-blue-600 dark:text-blue-400">per enrollment</p>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Performance Table */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Monthly Performance Trend</CardTitle>
              <CardDescription>Your sales, revenue, and commission over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceMetrics.map((metric) => (
                  <div key={metric.month} className="p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold">{metric.month} 2024</span>
                      <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Sales</p>
                        <p className="text-lg font-bold">{metric.sales}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                        <p className="text-lg font-bold">{metric.revenue}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Commission</p>
                        <p className="text-lg font-bold text-primary">{metric.commission}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Insights */}
          <Card className="shadow-soft border-green-500/20 bg-green-500/5">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1 text-green-700 dark:text-green-400">
                    Great Performance!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    You&apos;re performing <strong className="text-foreground">25% above average</strong> compared to other agents.
                    Your conversion rate of <strong className="text-foreground">{agentMetrics.conversionRate}%</strong> is
                    in the top 20%. Keep up the excellent work!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
