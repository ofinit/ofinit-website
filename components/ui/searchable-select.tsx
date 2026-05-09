"use client"

import { useMemo, useState } from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

export type SearchableSelectOption = { value: string; label: string; keywords?: string }

export function SearchableSelect({
  value,
  options,
  placeholder,
  searchPlaceholder = "Search...",
  disabled,
  onChange,
  className,
}: {
  value: string
  options: SearchableSelectOption[]
  placeholder: string
  searchPlaceholder?: string
  disabled?: boolean
  onChange: (value: string) => void
  className?: string
}) {
  const [open, setOpen] = useState(false)

  const selectedLabel = useMemo(() => {
    return options.find((o) => o.value === value)?.label ?? ""
  }, [options, value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-between font-normal hover:bg-muted hover:text-foreground data-[state=open]:bg-muted",
            className,
          )}
          disabled={disabled}
          aria-expanded={open}
        >
          <span className={cn("truncate", !selectedLabel && "text-muted-foreground")}>
            {selectedLabel || placeholder}
          </span>
          <ChevronsUpDownIcon className="ml-2 size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={`${opt.label} ${opt.keywords ?? ""}`.trim()}
                  className="data-[selected=true]:bg-muted data-[selected=true]:text-foreground"
                  onSelect={() => {
                    onChange(opt.value)
                    setOpen(false)
                  }}
                >
                  <CheckIcon className={cn("mr-2 size-4", value === opt.value ? "opacity-100" : "opacity-0")} />
                  <span className="truncate">{opt.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

