"use client"

import { DollarSign } from "lucide-react"
import { Input } from "@/components/inputs/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/inputs/select"
import { cn } from "@/lib/utils"

interface CurrencyInputProps {
  value: number | string
  onChange: (value: number) => void
  currency?: string
  onCurrencyChange?: (currency: string) => void
  placeholder?: string
  className?: string
}

const currencies = [
  { code: "NGN", symbol: "₦", label: "Nigerian Naira (NGN)" },
  { code: "USD", symbol: "$", label: "US Dollar (USD)" },
  { code: "GBP", symbol: "£", label: "British Pound (GBP)" },
  { code: "EUR", symbol: "€", label: "Euro (EUR)" },
  { code: "AED", symbol: "د.إ", label: "UAE Dirham (AED)" },
]

export function CurrencyInput({
  value,
  onChange,
  currency = "NGN",
  onCurrencyChange,
  placeholder = "0.00",
  className,
}: CurrencyInputProps) {
  const selectedCurrency = currencies.find((c) => c.code === currency)

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
    <div className={cn("flex gap-2", className)}>
      <Select value={currency} onValueChange={onCurrencyChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {currencies.map((curr) => (
            <SelectItem key={curr.code} value={curr.code}>
              {curr.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
          {selectedCurrency?.symbol}
        </span>
        <Input
          type="text"
          placeholder={placeholder}
          value={displayValue}
          onChange={handleChange}
          className="pl-8"
        />
      </div>
    </div>
  )
}
