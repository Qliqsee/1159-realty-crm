import { LucideIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/card"
import { cn } from "@/lib/utils"

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
  color,
  bgColor
}: MetricCardProps) {
  // Use legacy props if provided (for backward compatibility)
  const isLegacy = color && bgColor

  return (
    <Card className="shadow-soft hover:shadow-soft-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <div className={isLegacy ? cn("p-2 rounded-lg", bgColor) : metricCardVariants({ variant })}>
            <Icon className={isLegacy ? cn("h-4 w-4", color) : iconVariants({ variant })} />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={`text-xs ${change.startsWith('+') ? 'text-green-600 dark:text-green-400' : change.startsWith('-') ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}>
            {change} {changeLabel}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
