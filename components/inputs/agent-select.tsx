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
import { searchAgents } from "@/lib/api/users"
import type { User } from "@/types"

interface AgentSelectProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function AgentSelect({
  value,
  onValueChange,
  placeholder = "Select agent...",
  disabled = false,
}: AgentSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [agents, setAgents] = React.useState<User[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  // Debounced search
  React.useEffect(() => {
    const timer = setTimeout(async () => {
      setIsLoading(true)
      try {
        const results = await searchAgents(searchQuery)
        setAgents(results)
      } catch (error) {
        console.error("Failed to search agents:", error)
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Load initial agents on mount
  React.useEffect(() => {
    const loadInitialAgents = async () => {
      setIsLoading(true)
      try {
        const results = await searchAgents("")
        setAgents(results)
      } catch (error) {
        console.error("Failed to load agents:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadInitialAgents()
  }, [])

  const selectedAgent = agents.find((agent) => agent.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedAgent ? (
            <div className="flex items-center gap-2">
              <span>{selectedAgent.fullName}</span>
              <span className="text-xs text-muted-foreground">
                ({selectedAgent.email})
              </span>
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
            placeholder="Search by name or email..."
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
                <CommandEmpty>No agent found.</CommandEmpty>
                <CommandGroup>
                  {agents.map((agent) => (
                    <CommandItem
                      key={agent.id}
                      value={agent.id}
                      onSelect={(currentValue) => {
                        onValueChange(currentValue === value ? "" : currentValue)
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === agent.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span>{agent.fullName}</span>
                        <span className="text-xs text-muted-foreground">
                          {agent.email} • {agent.role}
                        </span>
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
  )
}
