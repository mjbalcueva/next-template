"use client"

import { useCallback, useEffect, useRef } from "react"

import { Delete02Icon, FilterHorizontalIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/core/components/ui/button"
import { Calendar } from "@/core/components/ui/calendar"
import { Input } from "@/core/components/ui/input"
import { Label } from "@/core/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/core/components/ui/popover"
import { cn } from "@/core/lib/utils"

import type { ColumnFilterDef } from "./columns"

const DEBOUNCE_MS = 1000

interface ColumnFilterPopoverProps {
  colId: string
  filterDef: ColumnFilterDef
  currentValue: string
  onValueChange: (v: string) => void
}

export function ColumnFilterPopover({
  colId,
  filterDef,
  currentValue,
  onValueChange,
}: ColumnFilterPopoverProps) {
  const isActive = filterDef.type === "select" ? currentValue !== "all" : currentValue !== ""

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground -mr-2 h-7 px-1.5"
          >
            <HugeiconsIcon
              icon={FilterHorizontalIcon}
              className={isActive ? "text-primary" : ""}
              strokeWidth={2}
            />
          </Button>
        }
      />
      <PopoverContent className="w-52 p-2" align="start">
        {filterDef.type === "select" && filterDef.options ? (
          <div className="flex flex-col gap-1">
            {filterDef.options.map(opt => (
              <Button
                key={opt.value}
                variant={currentValue === opt.value ? "default" : "ghost"}
                size="sm"
                className="justify-start"
                onClick={() => onValueChange(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        ) : filterDef.type === "date" ? (
          <DateFilterContent currentValue={currentValue} onValueChange={onValueChange} />
        ) : (
          <TextFilterContent
            currentValue={currentValue}
            placeholder={filterDef.placeholder ?? `Filter ${colId}\u2026`}
            onValueChange={onValueChange}
          />
        )}
      </PopoverContent>
    </Popover>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// Text filter (debounced input)
// ═══════════════════════════════════════════════════════════════════════

function TextFilterContent({
  currentValue,
  placeholder,
  onValueChange,
}: {
  currentValue: string
  placeholder: string
  onValueChange: (v: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cbRef = useRef(onValueChange)

  useEffect(() => {
    cbRef.current = onValueChange
  })

  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== currentValue) {
      inputRef.current.value = currentValue
    }
  }, [currentValue])

  const handleChange = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      if (inputRef.current) {
        cbRef.current(inputRef.current.value)
      }
    }, DEBOUNCE_MS)
  }, [])

  const handleClear = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = ""
      handleChange()
    }
  }, [handleChange])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-muted-foreground text-xs">{placeholder}</Label>
      <div className="flex items-center gap-1">
        <Input
          ref={inputRef}
          placeholder={placeholder}
          defaultValue={currentValue}
          onChange={handleChange}
          className="h-8 text-sm"
        />
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={handleClear}>
          <HugeiconsIcon icon={Delete02Icon} className="size-4" strokeWidth={2} />
        </Button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// Date filter (calendar picker)
// ═══════════════════════════════════════════════════════════════════════

function DateFilterContent({
  currentValue,
  onValueChange,
}: {
  currentValue: string
  onValueChange: (v: string) => void
}) {
  const selected = currentValue ? new Date(`${currentValue}T00:00:00`) : undefined

  const handleSelect = useCallback(
    (date: Date | undefined) => {
      onValueChange(date ? date.toISOString().slice(0, 10) : "")
    },
    [onValueChange]
  )

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label className="text-muted-foreground text-xs">
          {currentValue
            ? new Date(`${currentValue}T00:00:00`).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "Pick a date\u2026"}
        </Label>
        {currentValue && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            onClick={() => onValueChange("")}
          >
            <HugeiconsIcon icon={Delete02Icon} className="size-3.5" strokeWidth={2} />
          </Button>
        )}
      </div>
      <Calendar
        mode="single"
        selected={selected}
        onSelect={handleSelect}
        month={selected}
        captionLayout="dropdown"
        className={cn("p-0 [--cell-size:--spacing(7.5)]")}
      />
    </div>
  )
}
