"use client"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const searchInputVariants = cva(
  "pl-9 pr-9",
  {
    variants: {
      variant: {
        default: "",
        gold: "border-yellow-600 focus-visible:ring-yellow-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const searchIconVariants = cva(
  "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4",
  {
    variants: {
      variant: {
        default: "text-muted-foreground",
        gold: "text-yellow-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface SearchInputProps extends VariantProps<typeof searchInputVariants> {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  debounce?: number
  className?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  debounce = 300,
  variant,
  className,
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue)
    }, debounce)

    return () => clearTimeout(timer)
  }, [localValue, debounce, onChange])

  const handleClear = () => {
    setLocalValue("")
    onChange("")
  }

  return (
    <div className={cn("relative", className)}>
      <Search className={searchIconVariants({ variant })} />
      <Input
        type="text"
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className={searchInputVariants({ variant })}
      />
      {localValue && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
