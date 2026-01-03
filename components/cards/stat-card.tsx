import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type ColorScheme = "default" | "primary" | "blue" | "green" | "purple" | "red" | "orange"

interface StatCardProps {
  label: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: number
    label: string
    isPositive: boolean
  }
  colorScheme?: ColorScheme
  className?: string
}

const colorSchemes = {
  default: {
    card: "bg-card",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    label: "text-muted-foreground",
    value: "",
    description: "text-muted-foreground"
  },
  primary: {
    card: "bg-card",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    label: "text-muted-foreground",
    value: "",
    description: "text-muted-foreground"
  },
  blue: {
    card: "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    label: "text-blue-800 dark:text-blue-300",
    value: "text-blue-900 dark:text-blue-100",
    description: "text-blue-600 dark:text-blue-400"
  },
  green: {
    card: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
    iconBg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
    label: "text-green-800 dark:text-green-300",
    value: "text-green-900 dark:text-green-100",
    description: "text-green-600 dark:text-green-400"
  },
  purple: {
    card: "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    iconColor: "text-purple-600 dark:text-purple-400",
    label: "text-purple-800 dark:text-purple-300",
    value: "text-purple-900 dark:text-purple-100",
    description: "text-purple-600 dark:text-purple-400"
  },
  red: {
    card: "bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20",
    iconBg: "bg-red-100 dark:bg-red-900/30",
    iconColor: "text-red-600 dark:text-red-400",
    label: "text-red-800 dark:text-red-300",
    value: "text-red-900 dark:text-red-100",
    description: "text-red-600 dark:text-red-400"
  },
  orange: {
    card: "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20",
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
    iconColor: "text-orange-600 dark:text-orange-400",
    label: "text-orange-800 dark:text-orange-300",
    value: "text-orange-900 dark:text-orange-100",
    description: "text-orange-600 dark:text-orange-400"
  }
}

export function StatCard({
  label,
  value,
  description,
  icon: Icon,
  trend,
  colorScheme = "default",
  className,
}: StatCardProps) {
  const scheme = colorSchemes[colorScheme]

  return (
    <div className={cn("rounded-lg p-4 shadow-soft", scheme.card, className)}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={cn("p-2 rounded-lg", scheme.iconBg)}>
            <Icon className={cn("h-5 w-5", scheme.iconColor)} />
          </div>
        )}
        <div className="flex-1">
          <p className={cn("text-sm font-medium", scheme.label)}>{label}</p>
          <p className={cn("text-2xl font-bold", scheme.value || "")}>{value}</p>
          {description && (
            <p className={cn("text-xs mt-1", scheme.description)}>{description}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-1">
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                )}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-muted-foreground">{trend.label}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
