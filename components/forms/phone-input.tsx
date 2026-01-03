"use client"

import { useState } from "react"
import { Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  countryCode?: string
  onCountryCodeChange?: (code: string) => void
  placeholder?: string
  className?: string
}

const countryCodes = [
  { code: "+234", country: "NG", label: "Nigeria (+234)" },
  { code: "+1", country: "US", label: "United States (+1)" },
  { code: "+44", country: "GB", label: "United Kingdom (+44)" },
  { code: "+971", country: "AE", label: "UAE (+971)" },
  { code: "+91", country: "IN", label: "India (+91)" },
  { code: "+86", country: "CN", label: "China (+86)" },
]

export function PhoneInput({
  value,
  onChange,
  countryCode = "+234",
  onCountryCodeChange,
  placeholder = "Phone number",
  className,
}: PhoneInputProps) {
  const [selectedCode, setSelectedCode] = useState(countryCode)

  const handleCodeChange = (code: string) => {
    setSelectedCode(code)
    onCountryCodeChange?.(code)
  }

  const formatPhoneNumber = (input: string) => {
    // Remove non-digits
    const digits = input.replace(/\D/g, "")

    // Format based on country (basic formatting)
    if (selectedCode === "+234" && digits.length > 0) {
      // Nigerian format: 0803 123 4567
      if (digits.length <= 4) return digits
      if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`
      return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 11)}`
    }

    return digits
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    onChange(formatted)
  }

  return (
    <div className={cn("flex gap-2", className)}>
      <Select value={selectedCode} onValueChange={handleCodeChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {countryCodes.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              {country.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="relative flex-1">
        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="tel"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className="pl-9"
        />
      </div>
    </div>
  )
}
