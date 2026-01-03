import { LucideIcon } from "lucide-react"
import { StatCard } from "./stat-card"
import { cn } from "@/lib/utils"

export interface QuickStat {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    label: string
    isPositive: boolean
  }
  iconColor?: string
}

interface QuickStatsProps {
  stats: QuickStat[]
  columns?: 2 | 3 | 4
  className?: string
}

export function QuickStats({ stats, columns = 4, className }: QuickStatsProps) {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  }

  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          trend={stat.trend}
          iconColor={stat.iconColor}
        />
      ))}
    </div>
  )
}
