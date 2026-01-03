"use client"

import { MapPin } from "lucide-react"
import { Input } from "@/components/inputs/input"
import { Label } from "@/components/layout/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/inputs/select"
import { cn } from "@/lib/utils"

export interface Address {
  street: string
  city: string
  state: string
  country: string
  postalCode: string
}

interface AddressInputProps {
  value: Address
  onChange: (value: Address) => void
  className?: string
}

const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa",
  "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo",
  "Ekiti", "Enugu", "FCT", "Gombe", "Imo", "Jigawa",
  "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
]

const countries = [
  { code: "NG", name: "Nigeria" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "AE", name: "United Arab Emirates" },
]

export function AddressInput({
  value,
  onChange,
  className,
}: AddressInputProps) {
  const handleChange = (field: keyof Address, fieldValue: string) => {
    onChange({ ...value, [field]: fieldValue })
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Street Address */}
      <div className="space-y-2">
        <Label>Street Address</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="123 Main Street"
            value={value.street}
            onChange={(e) => handleChange("street", e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* City and State */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>City</Label>
          <Input
            placeholder="Enter city"
            value={value.city}
            onChange={(e) => handleChange("city", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>State</Label>
          <Select
            value={value.state}
            onValueChange={(val) => handleChange("state", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
              {nigerianStates.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Postal Code and Country */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Postal Code</Label>
          <Input
            placeholder="100001"
            value={value.postalCode}
            onChange={(e) => handleChange("postalCode", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Country</Label>
          <Select
            value={value.country}
            onValueChange={(val) => handleChange("country", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
