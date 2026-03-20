"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ModernDatepickerProps {
  date?: Date
  onDateChange: (date: Date | undefined) => void
  placeholder?: string
  className?: string
}

export function ModernDatepicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  className,
}: ModernDatepickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex h-11 w-full items-center justify-start rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-left text-sm font-normal text-white ring-offset-background transition-all hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#7b39fc] cursor-pointer",
            !date && "text-white/20",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-white/10 bg-[#0c0a14] backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          initialFocus
          className="bg-transparent text-white"
        />
      </PopoverContent>
    </Popover>
  )
}
