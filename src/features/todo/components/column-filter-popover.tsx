"use client"

import { useCallback, useEffect, useRef } from "react"

import { Delete02Icon, FilterHorizontalIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Label } from "@/core/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/core/components/ui/popover"

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

  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cbRef = useRef(onValueChange)

  useEffect(() => {
    cbRef.current = onValueChange
  })

  // Sync DOM when external value changes
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
            {filterDef.options.map((opt) => (
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
        ) : (
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground text-xs">
              {filterDef.placeholder ?? `Filter ${colId}\u2026`}
            </Label>
            <div className="flex items-center gap-1">
              <Input
                ref={inputRef}
                placeholder={filterDef.placeholder ?? `Filter ${colId}\u2026`}
                defaultValue={currentValue}
                onChange={handleChange}
                className="h-8 text-sm"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={handleClear}
              >
                <HugeiconsIcon icon={Delete02Icon} className="size-4" strokeWidth={2} />
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
