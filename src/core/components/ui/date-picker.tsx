"use client"

import { useState } from "react"

import { Calendar03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { format } from "date-fns"

import { Button } from "@/core/components/ui/button"
import { Calendar } from "@/core/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/core/components/ui/popover"
import { cn } from "@/core/lib/utils"

interface DatePickerProps {
  date: Date | undefined
  onSelect: (date: Date | undefined) => void
  placeholder?: string
  className?: string
}

export function DatePicker({
  date,
  onSelect,
  placeholder = "Pick a date",
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start gap-2 text-left font-normal",
              !date && "text-muted-foreground",
              className
            )}
          >
            <HugeiconsIcon icon={Calendar03Icon} className="size-4 shrink-0" />
            {date ? format(date, "PPP") : placeholder}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={d => {
            onSelect(d)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
