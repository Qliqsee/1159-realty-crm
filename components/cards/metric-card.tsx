import { LucideIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/card"
import { cn } from "@/lib/utils"

export type ColorScheme = "default" | "primary" | "blue" | "green" | "purple" | "red" | "orange"

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

const metricCardVariants = cva(
  "p-2 rounded-lg",
  {
    variants: {
      variant: {
        default: "bg-gray-100 dark:bg-gray-900/30",
        success: "bg-green-100 dark:bg-green-900/30",
        warning: "bg-yellow-100 dark:bg-yellow-900/30",
        danger: "bg-red-100 dark:bg-red-900/30",
        inactive: "bg-gray-200 dark:bg-gray-800/50",
        primary: "bg-blue-100 dark:bg-blue-900/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const iconVariants = cva(
  "h-4 w-4",
  {
    variants: {
      variant: {
        default: "text-gray-600 dark:text-gray-400",
        success: "text-green-600 dark:text-green-400",
        warning: "text-yellow-600 dark:text-yellow-400",
        danger: "text-red-600 dark:text-red-400",
        inactive: "text-gray-500 dark:text-gray-500",
        primary: "text-blue-600 dark:text-blue-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface MetricCardProps extends VariantProps<typeof metricCardVariants> {
  title: string
  value: string
  change?: string
  changeLabel?: string
  icon?: LucideIcon
  colorScheme?: ColorScheme
  // Legacy props for backward compatibility
  color?: string
  bgColor?: string
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel = "from last month",
  icon: Icon,
  variant,
  colorScheme,
  color,
  bgColor
}: MetricCardProps) {
  // Use legacy props if provided (for backward compatibility)
  const isLegacy = color && bgColor
  const scheme = colorScheme ? colorSchemes[colorScheme] : null

  return (
    <Card className={cn("shadow-soft hover:shadow-soft-md transition-shadow", scheme?.card)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={cn("text-sm font-medium", scheme ? scheme.label : "text-muted-foreground")}>
          {title}
        </CardTitle>
        {Icon && (
          <div className={scheme ? cn("p-2 rounded-lg", scheme.iconBg) : isLegacy ? cn("p-2 rounded-lg", bgColor) : metricCardVariants({ variant })}>
            <Icon className={scheme ? cn("h-4 w-4", scheme.iconColor) : isLegacy ? cn("h-4 w-4", color) : iconVariants({ variant })} />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", scheme?.value)}>{value}</div>
        {change && (
          <p className={`text-xs ${change.startsWith('+') ? 'text-green-600 dark:text-green-400' : change.startsWith('-') ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}>
            {change} {changeLabel}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
