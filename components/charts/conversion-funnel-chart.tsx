"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Filter } from "lucide-react"

const funnelData = [
  { stage: "Leads Generated", count: 1234, percentage: 100, color: "#3b82f6" },
  { stage: "Contacted", count: 987, percentage: 80, color: "#8b5cf6" },
  { stage: "Qualified", count: 654, percentage: 53, color: "#ec4899" },
  { stage: "Proposal Sent", count: 456, percentage: 37, color: "#f59e0b" },
  { stage: "Negotiation", count: 298, percentage: 24, color: "#10b981" },
  { stage: "Converted", count: 187, percentage: 15, color: "#FFD700" },
]

export function ConversionFunnelChart() {
  const conversionRate = funnelData[funnelData.length - 1].percentage
  const dropOffStage = funnelData.reduce((max, curr, idx, arr) => {
    if (idx === 0) return max
    const dropOff = arr[idx - 1].percentage - curr.percentage
    return dropOff > (arr[max - 1].percentage - arr[max].percentage) ? idx : max
  }, 1)

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Client Conversion Funnel</CardTitle>
            <CardDescription>Lead to Client Conversion Pipeline</CardDescription>
          </div>
          <Filter className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={funnelData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis type="number" className="text-xs" />
            <YAxis dataKey="stage" type="category" width={130} className="text-xs" />
            <Tooltip
              formatter={(value: number, name: string, props: any) => [
                `${value} (${props.payload.percentage}%)`,
                'Count'
              ]}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {funnelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Overall Conversion Rate</p>
            <p className="text-2xl font-bold text-primary">{conversionRate}%</p>
          </div>
          <div className="p-4 bg-red-500/10 rounded-lg">
            <p className="text-sm text-muted-foreground">Biggest Drop-off</p>
            <p className="text-sm font-semibold text-red-600 dark:text-red-400">
              {funnelData[dropOffStage - 1].stage} → {funnelData[dropOffStage].stage}
            </p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Optimization Opportunity:</strong> Focus on improving the
            <strong className="text-red-600 dark:text-red-400"> {funnelData[dropOffStage - 1].stage} → {funnelData[dropOffStage].stage}</strong> stage
            to reduce the {(funnelData[dropOffStage - 1].percentage - funnelData[dropOffStage].percentage).toFixed(0)}% drop-off rate.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
