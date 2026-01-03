import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

interface ProgressBarProps {
  current: number
  total: number
  label?: string
  showPercentage?: boolean
  status?: "default" | "success" | "warning" | "danger"
  className?: string
}

export function ProgressBar({
  current,
  total,
  label,
  showPercentage = true,
  status = "default",
  className,
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0

  const statusColors = {
    default: "bg-primary",
    success: "bg-green-600",
    warning: "bg-yellow-600",
    danger: "bg-red-600",
  }

  return (
    <div className={cn("space-y-2", className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="font-medium">{label}</span>}
          {showPercentage && (
            <span className="text-muted-foreground">{percentage}%</span>
          )}
        </div>
      )}
      <div className="relative">
        <Progress value={percentage} className="h-2" />
        <div
          className={cn(
            "absolute top-0 left-0 h-2 rounded-full transition-all",
            statusColors[status]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {current.toLocaleString()} / {total.toLocaleString()}
        </span>
      </div>
    </div>
  )
}
