import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const textareaVariants = cva(
  "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus:outline-none focus:border-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm shadow-soft",
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

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  error?: string
  helperText?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, error, helperText, ...props }, ref) => {
    const hasError = !!error
    const finalVariant = hasError ? "error" : variant

    if (!error && !helperText) {
      return (
        <textarea
          className={cn(textareaVariants({ variant: finalVariant }), className)}
          ref={ref}
          {...props}
        />
      )
    }

    return (
      <div className="w-full">
        <textarea
          className={cn(textareaVariants({ variant: finalVariant }), className)}
          ref={ref}
          {...props}
        />
        {(error || helperText) && (
          <p
            className={cn(
              "text-xs mt-1.5",
              hasError ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea, textareaVariants }
