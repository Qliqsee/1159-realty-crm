import * as React from "react"
import { Eye, EyeOff, type LucideIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 shadow-soft",
  {
    variants: {
      variant: {
        default: "border-input focus:border-primary",
        error: "border-red-600 focus:border-red-600",
        success: "border-green-600 focus:border-green-600",
        gold: "border-yellow-600 focus:border-yellow-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  error?: string
  helperText?: string
  icon?: LucideIcon
  iconPosition?: "left" | "right"
  showPasswordToggle?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, error, helperText, icon: Icon, iconPosition = "left", showPasswordToggle, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const inputType = showPasswordToggle ? (showPassword ? "text" : "password") : type
    const hasError = !!error
    const finalVariant = hasError ? "error" : variant

    const inputElement = (
      <input
        type={inputType}
        className={cn(
          inputVariants({ variant: finalVariant }),
          Icon && iconPosition === "left" && "pl-10",
          Icon && iconPosition === "right" && "pr-10",
          showPasswordToggle && "pr-10",
          className
        )}
        ref={ref}
        {...props}
      />
    )

    if (!Icon && !showPasswordToggle && !error && !helperText) {
      return inputElement
    }

    const iconColor = finalVariant === "gold" ? "text-yellow-600 dark:text-yellow-500" : "text-muted-foreground";

    return (
      <div className="w-full">
        <div className="relative">
          {Icon && iconPosition === "left" && (
            <Icon className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4", iconColor)} />
          )}
          {inputElement}
          {Icon && iconPosition === "right" && !showPasswordToggle && (
            <Icon className={cn("absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4", iconColor)} />
          )}
          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 hover:text-foreground",
                iconColor
              )}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
        {(error || helperText) && (
          <p className={cn(
            "text-xs mt-1.5",
            hasError ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
