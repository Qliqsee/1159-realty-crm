"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/cards/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts"
import { TrendingUp } from "lucide-react"

// Generate mock data with forecasting
const generateRevenueData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const currentMonth = 8 // September (0-indexed)

  return months.map((month, index) => {
    if (index <= currentMonth) {
      // Actual data (past months)
      return {
        month,
        actual: 30000000 + Math.random() * 20000000,
        forecast: null,
        type: "actual"
      }
    } else {
      // Forecasted data (future months)
      // Trend calculation: average growth rate applied to future months
      const baseValue = 45000000
      const growthRate = 1.08 // 8% growth
      const monthsAhead = index - currentMonth
      return {
        month,
        actual: null,
        forecast: baseValue * Math.pow(growthRate, monthsAhead) + (Math.random() * 5000000 - 2500000),
        type: "forecast"
      }
    }
  })
}

export function RevenueForecastChart() {
  const data = generateRevenueData()

  // Calculate trend
  const actualData = data.filter(d => d.actual !== null)
  const avgRevenue = actualData.reduce((sum, d) => sum + (d.actual || 0), 0) / actualData.length
  const lastMonthRevenue = actualData[actualData.length - 1]?.actual || 0
  const growthRate = ((lastMonthRevenue - avgRevenue) / avgRevenue * 100).toFixed(1)

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Revenue Forecast</CardTitle>
            <CardDescription>Actual vs. Predicted Revenue (2024)</CardDescription>
          </div>
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-semibold">+{growthRate}% Trend</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="month"
              className="text-xs"
            />
            <YAxis
              className="text-xs"
              tickFormatter={(value) => `₦${(value / 1000000).toFixed(0)}M`}
            />
            <Tooltip
              formatter={(value: number) => [`₦${value.toLocaleString()}`, '']}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <ReferenceLine
              x="Sep"
              stroke="hsl(var(--primary))"
              strokeDasharray="3 3"
              label={{ value: 'Current Month', position: 'top' }}
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#FFD700"
              strokeWidth={3}
              name="Actual Revenue"
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#82ca9d"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Forecasted Revenue"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Predictive Insight:</strong> Based on current trends,
            revenue is projected to reach <strong className="text-primary">₦52M+</strong> by December 2024,
            representing a <strong className="text-green-600 dark:text-green-400">{growthRate}% increase</strong> from the average.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
