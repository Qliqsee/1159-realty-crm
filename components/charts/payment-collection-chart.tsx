"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Clock, AlertCircle } from "lucide-react"

const collectionData = {
  onTime: { count: 287, amount: 342000000, percentage: 84 },
  pending: { count: 43, amount: 52000000, percentage: 13 },
  overdue: { count: 12, amount: 11000000, percentage: 3 },
  total: { count: 342, amount: 405000000 }
}

const installmentData = [
  { property: "Lekki Gardens Phase 2", collected: 85, target: 100, amount: 127500000 },
  { property: "Ikoyi Heights Tower A", collected: 92, target: 100, amount: 184000000 },
  { property: "Victoria Island Block C", collected: 78, target: 100, amount: 156000000 },
  { property: "Banana Island Estate", collected: 95, target: 100, amount: 237500000 },
  { property: "Ajah Mega City", collected: 71, target: 100, amount: 85200000 },
]

export function PaymentCollectionChart() {
  const collectionRate = collectionData.onTime.percentage
  const avgCollectionRate = installmentData.reduce((sum, d) => sum + d.collected, 0) / installmentData.length

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle>Payment Collection Rates</CardTitle>
        <CardDescription>Installment Payment Status & Performance</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Overall Collection Status */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <p className="text-sm font-semibold text-green-600 dark:text-green-400">On Time</p>
            </div>
            <p className="text-2xl font-bold">{collectionData.onTime.count}</p>
            <p className="text-xs text-muted-foreground">₦{(collectionData.onTime.amount / 1000000).toFixed(0)}M</p>
            <p className="text-xs font-semibold text-green-600 dark:text-green-400 mt-1">
              {collectionData.onTime.percentage}%
            </p>
          </div>

          <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">Pending</p>
            </div>
            <p className="text-2xl font-bold">{collectionData.pending.count}</p>
            <p className="text-xs text-muted-foreground">₦{(collectionData.pending.amount / 1000000).toFixed(0)}M</p>
            <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 mt-1">
              {collectionData.pending.percentage}%
            </p>
          </div>

          <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <p className="text-sm font-semibold text-red-600 dark:text-red-400">Overdue</p>
            </div>
            <p className="text-2xl font-bold">{collectionData.overdue.count}</p>
            <p className="text-xs text-muted-foreground">₦{(collectionData.overdue.amount / 1000000).toFixed(0)}M</p>
            <p className="text-xs font-semibold text-red-600 dark:text-red-400 mt-1">
              {collectionData.overdue.percentage}%
            </p>
          </div>
        </div>

        {/* Property-wise Collection Progress */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground">Collection Progress by Property</h4>
          {installmentData.map((property) => (
            <div key={property.property} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{property.property}</p>
                <div className="flex items-center gap-3">
                  <p className="text-xs text-muted-foreground">₦{(property.amount / 1000000).toFixed(1)}M</p>
                  <p className="text-sm font-semibold text-primary">{property.collected}%</p>
                </div>
              </div>
              <Progress value={property.collected} className="h-2" />
            </div>
          ))}
        </div>

        {/* Insights */}
        <div className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-primary/10 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Predictive Insight:</strong> With an average collection rate of
            <strong className="text-primary"> {avgCollectionRate.toFixed(1)}%</strong> and
            <strong className="text-green-600 dark:text-green-400"> {collectionRate}% on-time payments</strong>,
            the system is performing {avgCollectionRate >= 85 ? 'excellently' : 'well'}.
            Focus on the <strong className="text-orange-600 dark:text-orange-400">{collectionData.pending.count} pending</strong> and
            <strong className="text-red-600 dark:text-red-400"> {collectionData.overdue.count} overdue</strong> payments
            to maintain healthy cash flow.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
