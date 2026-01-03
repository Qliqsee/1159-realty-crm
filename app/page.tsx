"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/cards/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/navigation/tabs"
import { useAuthStore } from "@/lib/store/auth-store"
import {
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  UserCheck,
  Receipt,
  FileText,
  Handshake,
  BarChart3,
  PieChart,
  Wallet,
  ShoppingBag,
} from "lucide-react"
import { MetricCard } from "@/components/cards/metric-card"

export default function Home() {
  const user = useAuthStore((state) => state.user)

  const metrics = [
    {
      title: "Total Leads",
      value: "1,234",
      change: "+12.5%",
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Active Properties",
      value: "56",
      change: "+3",
      icon: Building2,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Total Revenue",
      value: "₦450M",
      change: "+18.2%",
      icon: DollarSign,
      color: "text-primary dark:text-primary",
      bgColor: "bg-primary/10 dark:bg-primary/20",
    },
    {
      title: "Active Clients",
      value: "892",
      change: "+7.1%",
      icon: UserCheck,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Enrollments",
      value: "342",
      change: "+5.4%",
      icon: FileText,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      title: "Pending Invoices",
      value: "127",
      change: "-3",
      icon: Receipt,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/30",
    },
    {
      title: "Partners",
      value: "48",
      change: "+6",
      icon: Handshake,
      color: "text-cyan-600 dark:text-cyan-400",
      bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
    },
    {
      title: "My Conversion Rate",
      value: "32.8%",
      change: "+2.3%",
      icon: TrendingUp,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      title: "My Total Sales",
      value: "45",
      change: "+12",
      icon: ShoppingBag,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    },
    {
      title: "My Revenue",
      value: "₦67.5M",
      change: "+18%",
      icon: DollarSign,
      color: "text-teal-600 dark:text-teal-400",
      bgColor: "bg-teal-100 dark:bg-teal-900/30",
    },
    {
      title: "My Commission",
      value: "₦47.3M",
      change: "+15%",
      icon: Wallet,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-background p-6 rounded-lg shadow-soft">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.firstName || "User"}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your real estate business today.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            icon={metric.icon}
            color={metric.color}
            bgColor={metric.bgColor}
          />
        ))}
      </div>

      {/* Tabs: Overview vs Analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">Recent Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Link
                      key={i}
                      href={`/leads/${i}`}
                      className="flex items-center gap-3 p-2 rounded-md bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Lead {i}</p>
                        <p className="text-xs text-muted-foreground">Contact pending</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">Recent Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Link
                      key={i}
                      href={`/properties/${i}`}
                      className="flex items-center gap-3 p-2 rounded-md bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Property {i}</p>
                        <p className="text-xs text-muted-foreground">Available</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">Pending Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link
                    href="/kyc"
                    className="flex items-center gap-3 p-2 rounded-md bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">KYC Reviews</p>
                      <p className="text-xs text-muted-foreground">12 pending</p>
                    </div>
                  </Link>
                  <Link
                    href="/payments"
                    className="flex items-center gap-3 p-2 rounded-md bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <Receipt className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Payment Reviews</p>
                      <p className="text-xs text-muted-foreground">8 pending</p>
                    </div>
                  </Link>
                  <Link
                    href="/partnerships"
                    className="flex items-center gap-3 p-2 rounded-md bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Handshake className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Partnership Apps</p>
                      <p className="text-xs text-muted-foreground">5 pending</p>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab - Personal User Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          {/* My Sales Funnel & Payment Status */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Personal Sales Funnel */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>My Sales Funnel</CardTitle>
                <CardDescription>Your lead-to-sale conversion pipeline</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { stage: "Leads Assigned", count: 107, percentage: 100, color: "bg-blue-500" },
                  { stage: "Contacted", count: 89, percentage: 83, color: "bg-cyan-500" },
                  { stage: "Qualified", count: 62, percentage: 58, color: "bg-green-500" },
                  { stage: "Proposal Sent", count: 51, percentage: 48, color: "bg-yellow-500" },
                  { stage: "Closed/Won", count: 45, percentage: 42, color: "bg-primary" },
                ].map((stage) => (
                  <div key={stage.stage} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{stage.stage}</span>
                      <span className="text-muted-foreground">
                        {stage.count} ({stage.percentage}%)
                      </span>
                    </div>
                    <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${stage.color} transition-all`}
                        style={{ width: `${stage.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
                <div className="pt-3 mt-3 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Conversion Rate:</span>
                    <span className="text-lg font-bold text-primary">42%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* My Payment Collections */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>My Payment Collections</CardTitle>
                <CardDescription>Your clients' payment status breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <div className="text-xs text-muted-foreground mb-1">Completed</div>
                    <div className="text-2xl font-bold text-green-700 dark:text-green-400">18</div>
                    <div className="text-xs text-muted-foreground">clients</div>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <div className="text-xs text-muted-foreground mb-1">Ongoing</div>
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">27</div>
                    <div className="text-xs text-muted-foreground">clients</div>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-border/50">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <p className="text-sm font-medium">Total Collected</p>
                      <p className="text-xs text-muted-foreground">All time</p>
                    </div>
                    <p className="text-lg font-bold text-primary">₦67.5M</p>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <p className="text-sm font-medium">Pending Payments</p>
                      <p className="text-xs text-muted-foreground">Outstanding</p>
                    </div>
                    <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">₦12.3M</p>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <p className="text-sm font-medium">Overdue</p>
                      <p className="text-xs text-muted-foreground">Requires follow-up</p>
                    </div>
                    <p className="text-lg font-bold text-red-600 dark:text-red-400">₦2.1M</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Personal Performance Insights */}
          <Card className="shadow-soft border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <TrendingUp className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-2 text-primary">Your Performance Insights</p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      🎯 Your conversion rate of <strong className="text-foreground">42%</strong> is{" "}
                      <strong className="text-green-600 dark:text-green-400">25% above</strong> the team average.
                    </p>
                    <p>
                      📈 <strong className="text-foreground">Lekki Gardens Phase 2</strong> is your best performer
                      with <strong className="text-foreground">12 sales</strong> this quarter.
                    </p>
                    <p>
                      💰 You have <strong className="text-foreground">₦2.1M in overdue payments</strong>.
                      Following up could unlock commission on completed sales.
                    </p>
                    <p>
                      ⭐ You're ranked <strong className="text-primary">#3</strong> in the sales team.
                      Keep up the excellent work!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
