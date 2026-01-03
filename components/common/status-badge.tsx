import { cn } from "@/lib/utils"
import { STATUS_COLORS } from "@/lib/constants"

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colorClass = STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS.Pending

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-soft",
        colorClass,
        className
      )}
    >
      {status}
    </span>
  )
}
