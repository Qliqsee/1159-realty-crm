"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { BarChart3 } from "lucide-react"

const salesData = [
  { month: "Jan", outright: 12, installment: 28, total: 40 },
  { month: "Feb", outright: 15, installment: 32, total: 47 },
  { month: "Mar", outright: 18, installment: 35, total: 53 },
  { month: "Apr", outright: 14, installment: 30, total: 44 },
  { month: "May", outright: 20, installment: 38, total: 58 },
  { month: "Jun", outright: 22, installment: 42, total: 64 },
  { month: "Jul", outright: 19, installment: 40, total: 59 },
  { month: "Aug", outright: 25, installment: 45, total: 70 },
  { month: "Sep", outright: 23, installment: 43, total: 66 },
]

export function SalesAnalyticsChart() {
  const totalSales = salesData.reduce((sum, d) => sum + d.total, 0)
  const avgMonthlySales = (totalSales / salesData.length).toFixed(1)
  const installmentPercentage = ((salesData.reduce((sum, d) => sum + d.installment, 0) / totalSales) * 100).toFixed(1)

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sales Analytics</CardTitle>
            <CardDescription>Outright vs. Installment Sales (2024)</CardDescription>
          </div>
          <BarChart3 className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="outright" fill="#FFD700" name="Outright Purchase" radius={[4, 4, 0, 0]} />
            <Bar dataKey="installment" fill="#82ca9d" name="Installment Plan" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Average Monthly Sales</p>
            <p className="text-2xl font-bold text-primary">{avgMonthlySales}</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Installment Preference</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{installmentPercentage}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
