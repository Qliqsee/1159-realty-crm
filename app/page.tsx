"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/cards/card";
import { useAuthStore } from "@/lib/store/auth-store";
import {
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  UserCheck,
  Receipt,
  FileText,
  Handshake,
  Wallet,
  ShoppingBag,
} from "lucide-react";
import { MetricCard } from "@/components/cards/metric-card";

export default function Home() {
  const user = useAuthStore((state) => state.user);

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
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-background p-6 rounded-lg shadow-soft">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.firstName || "User"}! 👋</h1>
        <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your real estate business today.</p>
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

      {/* Overview Section */}
      <div className="space-y-6">
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
                <CardTitle className="text-lg">My Payment Collections</CardTitle>
                <CardDescription>Your clients&apos; payment status breakdown</CardDescription>
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
      </div>
    </div>
  );
}
