"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { DollarSign } from "lucide-react"

const commissionData = [
  { month: "Jan", agent: 8500000, partner: 3500000, total: 12000000 },
  { month: "Feb", agent: 9200000, partner: 3800000, total: 13000000 },
  { month: "Mar", agent: 10500000, partner: 4200000, total: 14700000 },
  { month: "Apr", agent: 9800000, partner: 3900000, total: 13700000 },
  { month: "May", agent: 11200000, partner: 4500000, total: 15700000 },
  { month: "Jun", agent: 12800000, partner: 5100000, total: 17900000 },
  { month: "Jul", agent: 11500000, partner: 4600000, total: 16100000 },
  { month: "Aug", agent: 13200000, partner: 5300000, total: 18500000 },
  { month: "Sep", agent: 12900000, partner: 5200000, total: 18100000 },
]

export function CommissionTrendsChart() {
  const totalCommissions = commissionData.reduce((sum, d) => sum + d.total, 0)
  const avgMonthlyCommission = totalCommissions / commissionData.length
  const agentPercentage = ((commissionData.reduce((sum, d) => sum + d.agent, 0) / totalCommissions) * 100).toFixed(1)

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Commission Trends</CardTitle>
            <CardDescription>Agent vs. Partner Commissions (2024)</CardDescription>
          </div>
          <DollarSign className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={commissionData}>
            <defs>
              <linearGradient id="colorAgent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFD700" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#FFD700" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorPartner" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" tickFormatter={(value) => `₦${(value / 1000000).toFixed(0)}M`} />
            <Tooltip
              formatter={(value: number) => [`₦${value.toLocaleString()}`, '']}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="agent"
              stroke="#FFD700"
              fillOpacity={1}
              fill="url(#colorAgent)"
              name="Agent Commission"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="partner"
              stroke="#82ca9d"
              fillOpacity={1}
              fill="url(#colorPartner)"
              name="Partner Commission"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Avg Monthly Total</p>
            <p className="text-2xl font-bold text-primary">₦{(avgMonthlyCommission / 1000000).toFixed(1)}M</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Agent Share</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{agentPercentage}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
