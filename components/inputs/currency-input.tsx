"use client"

import { Input } from "@/components/inputs/input"
import { cn } from "@/lib/utils"

interface CurrencyInputProps {
  value: number | string
  onChange: (value: number) => void
  placeholder?: string
  className?: string
  error?: string
}

export function CurrencyInput({
  value,
  onChange,
  placeholder = "0.00",
  className,
  error,
}: CurrencyInputProps) {

  const formatNumber = (num: string) => {
    // Remove non-digits and decimal points
    const cleaned = num.replace(/[^\d.]/g, "")

    // Ensure only one decimal point
    const parts = cleaned.split(".")
    if (parts.length > 2) {
      return parts[0] + "." + parts.slice(1).join("")
    }

    // Add thousand separators
    if (parts[0]) {
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    return parts.join(".")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value)
    const numericValue = parseFloat(formatted.replace(/,/g, "")) || 0
    onChange(numericValue)
  }

  const displayValue = typeof value === "number" ? formatNumber(value.toString()) : formatNumber(value)

  return (
    <div className={cn("relative w-full", className)}>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium z-10">
        ₦
      </span>
      <Input
        type="text"
        placeholder={placeholder}
        value={displayValue}
        onChange={handleChange}
        className="pl-8"
        error={error}
      />
    </div>
  )
}
