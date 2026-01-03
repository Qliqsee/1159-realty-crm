import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

export interface TimelineItem {
  id: string
  title: string
  description?: string
  date: Date
  user?: {
    name: string
    avatar?: string
  }
  icon?: React.ComponentType<{ className?: string }>
  variant?: "default" | "success" | "warning" | "danger"
}

interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

export function Timeline({ items, className }: TimelineProps) {
  const variantColors = {
    default: "bg-primary",
    success: "bg-green-600",
    warning: "bg-yellow-600",
    danger: "bg-red-600",
  }

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item, index) => {
        const Icon = item.icon
        const isLast = index === items.length - 1

        return (
          <div key={item.id} className="relative flex gap-4">
            {/* Timeline Line */}
            {!isLast && (
              <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-muted" />
            )}

            {/* Icon/Dot */}
            <div className="relative flex-shrink-0">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full shadow-soft",
                  variantColors[item.variant || "default"]
                )}
              >
                {Icon ? (
                  <Icon className="h-4 w-4 text-white" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-white" />
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 pb-8">
              <div className="rounded-lg bg-card p-4 shadow-soft">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h4 className="font-semibold text-sm">{item.title}</h4>
                    {item.user && (
                      <p className="text-xs text-muted-foreground mt-1">
                        by {item.user.name}
                      </p>
                    )}
                  </div>
                  <time className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(item.date, { addSuffix: true })}
                  </time>
                </div>
                {item.description && (
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
