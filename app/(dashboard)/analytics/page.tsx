"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/cards/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/navigation/tabs"
import { Button } from "@/components/buttons/button"
import {
  BarChart3,
  Users,
  MapPin,
  UserCheck,
  DollarSign,
  Building2,
  TrendingUp,
  Download,
  Calendar,
  PieChart,
  Activity,
} from "lucide-react"
import {
  RevenueForecastChart,
  SalesAnalyticsChart,
  AgentPerformanceChart,
  ConversionFunnelChart,
  PropertyPerformanceChart,
  CommissionTrendsChart,
  PaymentCollectionChart,
} from "@/components/charts"

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("30d")

  // Mock metrics - in production, these would come from API
  const metrics = [
    {
      title: "Total Revenue",
      value: "₦450M",
      change: "+18.2%",
      icon: DollarSign,
      color: "text-primary dark:text-primary",
      bgColor: "bg-primary/10 dark:bg-primary/20",
    },
    {
      title: "Total Sales",
      value: "342",
      change: "+12.5%",
      icon: BarChart3,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Active Clients",
      value: "892",
      change: "+7.1%",
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Conversion Rate",
      value: "32.8%",
      change: "+2.3%",
      icon: TrendingUp,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Reporting</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive insights, reports, and predictive analytics
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-2">
            <Button
              variant={dateRange === "7d" ? "default" : "outline"}
              size="sm"
              onClick={() => setDateRange("7d")}
              className="shadow-soft"
            >
              7 Days
            </Button>
            <Button
              variant={dateRange === "30d" ? "default" : "outline"}
              size="sm"
              onClick={() => setDateRange("30d")}
              className="shadow-soft"
            >
              30 Days
            </Button>
            <Button
              variant={dateRange === "90d" ? "default" : "outline"}
              size="sm"
              onClick={() => setDateRange("90d")}
              className="shadow-soft"
            >
              90 Days
            </Button>
            <Button
              variant={dateRange === "1y" ? "default" : "outline"}
              size="sm"
              onClick={() => setDateRange("1y")}
              className="shadow-soft"
            >
              1 Year
            </Button>
          </div>
          <Button className="shadow-soft">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.title} className="shadow-soft hover:shadow-soft-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <div className={`${metric.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className={`text-xs ${metric.change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {metric.change} from last period
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Sales
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Customers
          </TabsTrigger>
          <TabsTrigger value="locations" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Locations
          </TabsTrigger>
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Agents
          </TabsTrigger>
        </TabsList>

        {/* Sales Reports Tab */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <RevenueForecastChart />
            <SalesAnalyticsChart />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <PropertyPerformanceChart />
            <PaymentCollectionChart />
          </div>

          {/* Sales by Property Type */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Sales by Property Type</CardTitle>
              <CardDescription>Distribution of sales across property categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { type: "Residential Land", sales: 156, revenue: "₦234M", percentage: 45, color: "bg-primary" },
                  { type: "Commercial Land", sales: 89, revenue: "₦178M", percentage: 38, color: "bg-blue-500" },
                  { type: "Farmland", sales: 67, revenue: "₦56M", percentage: 12, color: "bg-green-500" },
                  { type: "Apartments", sales: 30, revenue: "₦45M", percentage: 5, color: "bg-purple-500" },
                ].map((item) => (
                  <div key={item.type} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.type}</span>
                      <span className="text-muted-foreground">
                        {item.sales} sales • {item.revenue}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} transition-all`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customer Behavior Tab */}
        <TabsContent value="customers" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <ConversionFunnelChart />

            {/* Customer Lifetime Value */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Customer Lifetime Value Analysis</CardTitle>
                <CardDescription>Average value per customer segment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { segment: "Premium Buyers", ltv: "₦8.5M", customers: 45, trend: "+15%" },
                    { segment: "Regular Buyers", ltv: "₦3.2M", customers: 234, trend: "+8%" },
                    { segment: "First-time Buyers", ltv: "₦1.8M", customers: 567, trend: "+12%" },
                    { segment: "Installment Only", ltv: "₦1.2M", customers: 892, trend: "+5%" },
                  ].map((item) => (
                    <div key={item.segment} className="p-4 rounded-lg bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{item.segment}</span>
                        <span className="text-sm text-green-600 dark:text-green-400">{item.trend}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">{item.ltv}</span>
                        <span className="text-sm text-muted-foreground">
                          avg • {item.customers} customers
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Repeat Purchase Prediction */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Repeat Purchase Prediction</CardTitle>
              <CardDescription>Clients likely to purchase again based on behavior patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "John Adebayo", probability: 92, lastPurchase: "3 months ago", visits: 12 },
                  { name: "Sarah Okafor", probability: 87, lastPurchase: "2 months ago", visits: 8 },
                  { name: "Michael Chen", probability: 78, lastPurchase: "4 months ago", visits: 15 },
                  { name: "Fatima Hassan", probability: 71, lastPurchase: "1 month ago", visits: 6 },
                  { name: "David Okonkwo", probability: 68, lastPurchase: "5 months ago", visits: 10 },
                ].map((client) => (
                  <div key={client.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {client.lastPurchase} • {client.visits} site visits
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {client.probability}% likely
                      </div>
                      <div className="text-xs text-muted-foreground">to repurchase</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Behavior Trends */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Payment Behavior Trends</CardTitle>
              <CardDescription>Analysis of payment patterns and completion rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium">On-time Payments</span>
                  </div>
                  <div className="text-2xl font-bold">78%</div>
                  <div className="text-xs text-muted-foreground">of all installments</div>
                </div>
                <div className="p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-sm font-medium">Late Payments</span>
                  </div>
                  <div className="text-2xl font-bold">18%</div>
                  <div className="text-xs text-muted-foreground">1-7 days overdue</div>
                </div>
                <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/30">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <span className="text-sm font-medium">Default Risk</span>
                  </div>
                  <div className="text-2xl font-bold">4%</div>
                  <div className="text-xs text-muted-foreground">&gt;30 days overdue</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Location Performance Tab */}
        <TabsContent value="locations" className="space-y-6">
          {/* Fast-Selling Locations */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Fast-Selling Location Prediction</CardTitle>
              <CardDescription>Locations with high demand and quick sales velocity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { location: "Lekki, Lagos", avgDays: 12, demand: 95, sales: 89, trend: "up" },
                  { location: "Abuja Municipal, FCT", avgDays: 18, demand: 88, sales: 67, trend: "up" },
                  { location: "Victoria Island, Lagos", avgDays: 15, demand: 85, sales: 54, trend: "stable" },
                  { location: "Ikeja, Lagos", avgDays: 24, demand: 78, sales: 45, trend: "up" },
                  { location: "Port Harcourt, Rivers", avgDays: 32, demand: 72, sales: 38, trend: "down" },
                ].map((loc, idx) => (
                  <div key={loc.location} className="p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          idx === 0 ? 'bg-primary text-primary-foreground' :
                          idx === 1 ? 'bg-muted text-foreground' :
                          idx === 2 ? 'bg-muted text-foreground' :
                          'bg-muted/50 text-muted-foreground'
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-medium">{loc.location}</p>
                          <p className="text-xs text-muted-foreground">
                            {loc.sales} sales • Avg {loc.avgDays} days to sell
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{loc.demand}%</div>
                        <div className="text-xs text-muted-foreground">demand score</div>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-yellow-500 transition-all"
                        style={{ width: `${loc.demand}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Price Trend Analysis */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Price Trend by Area</CardTitle>
                <CardDescription>Average price changes over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { area: "Lekki", current: "₦4.5M/plot", change: "+23%", trend: "up" },
                    { area: "Abuja", current: "₦3.8M/plot", change: "+18%", trend: "up" },
                    { area: "Ibeju", current: "₦2.1M/plot", change: "+35%", trend: "up" },
                    { area: "Epe", current: "₦1.8M/plot", change: "+12%", trend: "up" },
                  ].map((area) => (
                    <div key={area.area} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium">{area.area}</p>
                        <p className="text-sm text-muted-foreground">{area.current}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                          {area.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Location Demand Forecast</CardTitle>
                <CardDescription>Predicted demand for next quarter</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { location: "Lekki Phase 2", forecast: "High", confidence: 92 },
                    { location: "Ibeju-Lekki", forecast: "Very High", confidence: 88 },
                    { location: "Sangotedo", forecast: "High", confidence: 85 },
                    { location: "Ajah", forecast: "Medium", confidence: 76 },
                  ].map((item) => (
                    <div key={item.location} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.location}</span>
                        <span className={`text-sm font-semibold ${
                          item.forecast === "Very High" ? "text-green-600 dark:text-green-400" :
                          item.forecast === "High" ? "text-blue-600 dark:text-blue-400" :
                          "text-yellow-600 dark:text-yellow-400"
                        }`}>
                          {item.forecast} Demand
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-yellow-500"
                            style={{ width: `${item.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{item.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Agent Performance Tab */}
        <TabsContent value="agents" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <AgentPerformanceChart />
            <CommissionTrendsChart />
          </div>

          {/* Top Performers */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Top Performing Agents</CardTitle>
              <CardDescription>Ranked by sales performance and conversion rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Oluwaseun Ajayi", sales: 45, revenue: "₦67.5M", conversion: 42, commission: "₦47.3M" },
                  { name: "Chioma Obi", sales: 38, revenue: "₦52.3M", conversion: 38, commission: "₦36.6M" },
                  { name: "Ahmed Musa", sales: 32, revenue: "₦45.8M", conversion: 35, commission: "₦32.1M" },
                  { name: "Grace Eze", sales: 28, revenue: "₦38.2M", conversion: 33, commission: "₦26.7M" },
                  { name: "Ibrahim Yusuf", sales: 24, revenue: "₦32.1M", conversion: 31, commission: "₦22.5M" },
                ].map((agent, idx) => (
                  <div key={agent.name} className="p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                        idx === 0 ? 'bg-primary text-primary-foreground' :
                        idx === 1 ? 'bg-muted text-foreground' :
                        idx === 2 ? 'bg-muted text-foreground' :
                        'bg-muted/50 text-muted-foreground'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {agent.sales} sales • {agent.conversion}% conversion rate
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-border/50">
                      <div>
                        <p className="text-xs text-muted-foreground">Total Revenue</p>
                        <p className="text-sm font-semibold">{agent.revenue}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Commission Earned</p>
                        <p className="text-sm font-semibold text-primary">{agent.commission}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Commission Reports */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Commission Breakdown</CardTitle>
                <CardDescription>Agent vs Partner commissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-primary/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Agent Commissions (70%)</span>
                      <UserCheck className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-2xl font-bold">₦315M</div>
                    <div className="text-xs text-muted-foreground">Total paid to agents</div>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Partner Commissions (30%)</span>
                      <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold">₦135M</div>
                    <div className="text-xs text-muted-foreground">Total paid to partners</div>
                  </div>
                  <div className="p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Pending Commissions</span>
                      <Activity className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="text-2xl font-bold">₦42M</div>
                    <div className="text-xs text-muted-foreground">Awaiting release</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Lead-to-Sale Ratios</CardTitle>
                <CardDescription>Conversion efficiency by agent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { agent: "Oluwaseun A.", ratio: "42%", leads: 107, sales: 45 },
                    { agent: "Chioma O.", ratio: "38%", leads: 100, sales: 38 },
                    { agent: "Ahmed M.", ratio: "35%", leads: 91, sales: 32 },
                    { agent: "Grace E.", ratio: "33%", leads: 85, sales: 28 },
                  ].map((item) => (
                    <div key={item.agent} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.agent}</span>
                        <span className="text-muted-foreground">
                          {item.sales}/{item.leads} leads
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-yellow-500"
                            style={{ width: item.ratio }}
                          />
                        </div>
                        <span className="text-sm font-semibold">{item.ratio}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Predictive Insights Section */}
      <Card className="shadow-soft border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle>Predictive Insights</CardTitle>
          </div>
          <CardDescription>Data-driven recommendations based on mathematical analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-yellow-500/10">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Property Recommendation</span>
              </div>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Lekki Phase 2</strong> properties are predicted to sell
                <strong className="text-green-600 dark:text-green-400"> 35% faster</strong> based on current trends.
                Consider prioritizing listings in this area.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold">Client Engagement</span>
              </div>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">45 clients</strong> show high repeat purchase probability.
                Targeted outreach could generate
                <strong className="text-primary"> ₦180M+</strong> in additional revenue.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-red-500/10 to-orange-500/10">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-red-600 dark:text-red-400" />
                <span className="text-sm font-semibold">Risk Assessment</span>
              </div>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">127 enrollments</strong> at risk of default.
                Early intervention on overdue payments could prevent
                <strong className="text-red-600 dark:text-red-400"> ₦32M</strong> in potential losses.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
