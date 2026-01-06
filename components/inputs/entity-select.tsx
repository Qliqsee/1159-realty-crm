"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/buttons/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/overlays/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/overlays/popover"

export interface EntityOption {
  id: string
  label: string
  sublabel?: string
}

interface EntitySelectProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  disabled?: boolean
  error?: string
  helperText?: string
  options?: EntityOption[]
  onSearch?: (query: string) => Promise<EntityOption[]>
  className?: string
}

export function EntitySelect({
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  disabled = false,
  error,
  helperText,
  options: externalOptions,
  onSearch,
  className,
}: EntitySelectProps) {
  const [open, setOpen] = React.useState(false)
  const [options, setOptions] = React.useState<EntityOption[]>(externalOptions || [])
  const [isLoading, setIsLoading] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const hasError = !!error

  // Debounced search when onSearch is provided
  React.useEffect(() => {
    if (!onSearch) return

    const timer = setTimeout(async () => {
      setIsLoading(true)
      try {
        const results = await onSearch(searchQuery)
        setOptions(results)
      } catch (error) {
        console.error("Failed to search:", error)
        setOptions([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, onSearch])

  // Load initial options on mount when onSearch is provided
  React.useEffect(() => {
    if (!onSearch) return

    const loadInitialOptions = async () => {
      setIsLoading(true)
      try {
        const results = await onSearch("")
        setOptions(results)
      } catch (error) {
        console.error("Failed to load options:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadInitialOptions()
  }, [onSearch])

  // Update options when external options change
  React.useEffect(() => {
    if (externalOptions) {
      setOptions(externalOptions)
    }
  }, [externalOptions])

  // Filter options locally if no onSearch function
  const filteredOptions = React.useMemo(() => {
    if (onSearch) return options
    if (!searchQuery) return options
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.sublabel?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [options, searchQuery, onSearch])

  const selectedOption = options.find((option) => option.id === value)

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              hasError && "border-red-600 focus:border-red-600"
            )}
            disabled={disabled}
          >
            {selectedOption ? (
              <div className="flex items-center gap-2 truncate">
                <span className="truncate">{selectedOption.label}</span>
                {selectedOption.sublabel && (
                  <span className="text-xs text-muted-foreground truncate">
                    ({selectedOption.sublabel})
                  </span>
                )}
              </div>
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <>
                  <CommandEmpty>{emptyText}</CommandEmpty>
                  <CommandGroup>
                    {filteredOptions.map((option) => (
                      <CommandItem
                        key={option.id}
                        value={option.id}
                        onSelect={(currentValue) => {
                          onValueChange(currentValue === value ? "" : currentValue)
                          setOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === option.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span>{option.label}</span>
                          {option.sublabel && (
                            <span className="text-xs text-muted-foreground">
                              {option.sublabel}
                            </span>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
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
