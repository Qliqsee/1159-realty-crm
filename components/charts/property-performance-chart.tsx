"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/cards/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Building2, TrendingUp } from "lucide-react"

const propertyData = [
  { name: "Lekki Gardens", value: 28, revenue: 340000000, color: "#FFD700" },
  { name: "Ikoyi Heights", value: 18, revenue: 420000000, color: "#3b82f6" },
  { name: "Victoria Island", value: 15, revenue: 380000000, color: "#10b981" },
  { name: "Banana Island", value: 12, revenue: 560000000, color: "#8b5cf6" },
  { name: "Ajah Estates", value: 22, revenue: 180000000, color: "#f59e0b" },
  { name: "Others", value: 5, revenue: 95000000, color: "#6b7280" },
]

export function PropertyPerformanceChart() {
  const totalProperties = propertyData.reduce((sum, d) => sum + d.value, 0)
  const totalRevenue = propertyData.reduce((sum, d) => sum + d.revenue, 0)
  const topProperty = propertyData.reduce((max, curr) => curr.revenue > max.revenue ? curr : max)

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Property Performance</CardTitle>
            <CardDescription>Sales Distribution by Property</CardDescription>
          </div>
          <Building2 className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={propertyData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={110}
              fill="#8884d8"
              dataKey="value"
            >
              {propertyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string, props: any) => [
                `${value} sales (₦${(props.payload.revenue / 1000000).toFixed(1)}M)`,
                ''
              ]}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Properties Sold</p>
            <p className="text-2xl font-bold text-primary">{totalProperties}</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              ₦{(totalRevenue / 1000000).toFixed(0)}M
            </p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <p className="text-sm font-semibold">Best Performer</p>
          </div>
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">{topProperty.name}</strong> generates the highest revenue per sale at
            <strong className="text-primary"> ₦{(topProperty.revenue / topProperty.value / 1000000).toFixed(1)}M</strong> average,
            contributing <strong className="text-green-600 dark:text-green-400">
              {((topProperty.revenue / totalRevenue) * 100).toFixed(1)}%
            </strong> of total revenue.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
