"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModernSelectProps {
  value: string
  onValueChange: (value: string) => void
  options: { label: string; value: string }[]
  placeholder?: string
  className?: string
  triggerClassName?: string
}

export function ModernSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select an option",
  className,
  triggerClassName,
}: ModernSelectProps) {
  return (
    <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
      <SelectPrimitive.Trigger
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white ring-offset-background placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#7b39fc] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:bg-white/10 cursor-pointer",
          triggerClassName
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className={cn(
            "relative z-50 min-w-[8rem] overflow-hidden rounded-xl border border-white/10 bg-[#0c0a14] text-white shadow-2xl animate-in fade-in-80 zoom-in-95 backdrop-blur-md",
            className
          )}
          position="popper"
          sideOffset={5}
        >
          <SelectPrimitive.Viewport className="p-1">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className="relative flex w-full cursor-pointer select-none items-center rounded-lg py-2.5 pl-8 pr-2 text-sm outline-none focus:bg-[#7b39fc]/20 focus:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors"
              >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  <SelectPrimitive.ItemIndicator>
                    <Check className="h-4 w-4 text-[#9055ff]" />
                  </SelectPrimitive.ItemIndicator>
                </span>
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}
