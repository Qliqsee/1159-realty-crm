"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/cards/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Trophy, TrendingUp } from "lucide-react"

const agentData = [
  { agent: "Michael Chen", sales: 85, revenue: 125000000, target: 100000000 },
  { agent: "Sarah Williams", sales: 72, revenue: 98000000, target: 90000000 },
  { agent: "James Anderson", sales: 68, revenue: 87000000, target: 85000000 },
  { agent: "Emily Davis", sales: 54, revenue: 72000000, target: 75000000 },
  { agent: "Robert Wilson", sales: 48, revenue: 65000000, target: 70000000 },
]

export function AgentPerformanceChart() {
  const topAgent = agentData[0]
  const totalRevenue = agentData.reduce((sum, d) => sum + d.revenue, 0)

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Agent Performance</CardTitle>
            <CardDescription>Top 5 Agents by Sales & Revenue</CardDescription>
          </div>
          <Trophy className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={agentData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis type="number" className="text-xs" tickFormatter={(value) => `₦${(value / 1000000).toFixed(0)}M`} />
            <YAxis dataKey="agent" type="category" width={120} className="text-xs" />
            <Tooltip
              formatter={(value: number) => `₦${value.toLocaleString()}`}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="target" fill="#e0e0e0" name="Target" radius={[0, 4, 4, 0]} />
            <Bar dataKey="revenue" fill="#FFD700" name="Actual Revenue" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 p-4 bg-gradient-to-r from-primary/10 to-green-500/10 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-4 w-4 text-primary" />
            <p className="text-sm font-semibold">Top Performer</p>
          </div>
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">{topAgent.agent}</strong> leads with {topAgent.sales} sales
            and <strong className="text-primary">₦{(topAgent.revenue / 1000000).toFixed(1)}M</strong> in revenue,
            exceeding target by <strong className="text-green-600 dark:text-green-400">
              {((topAgent.revenue - topAgent.target) / topAgent.target * 100).toFixed(1)}%
            </strong>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
