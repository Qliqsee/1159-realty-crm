"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/buttons/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/overlays/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/overlays/popover"
import { Badge } from "@/components/badges/badge"

export interface MultiSelectOption {
  label: string
  value: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  emptyText?: string
  className?: string
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select items...",
  emptyText = "No items found.",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)

  // Ensure value is always an array to prevent undefined errors
  const safeValue = value || []

  const handleSelect = (selectedValue: string) => {
    const newValue = safeValue.includes(selectedValue)
      ? safeValue.filter((v) => v !== selectedValue)
      : [...safeValue, selectedValue]
    onChange(newValue)
  }

  const handleRemove = (removedValue: string) => {
    onChange(safeValue.filter((v) => v !== removedValue))
  }

  const selectedLabels = options
    .filter((option) => safeValue.includes(option.value))
    .map((option) => option.label)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          <div className="flex gap-1 flex-wrap">
            {safeValue.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              selectedLabels.slice(0, 2).map((label, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="mr-1 shadow-soft"
                >
                  {label}
                </Badge>
              ))
            )}
            {safeValue.length > 2 && (
              <Badge variant="secondary" className="shadow-soft">
                +{safeValue.length - 2} more
              </Badge>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>{emptyText}</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={() => handleSelect(option.value)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    safeValue.includes(option.value)
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
