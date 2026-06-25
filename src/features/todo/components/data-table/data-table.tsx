"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import {
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  LayoutGridIcon,
  Search01Icon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs"

import { Badge } from "@/core/components/ui/badge"
import { Button } from "@/core/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu"
import { Input } from "@/core/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table"
import { useDebouncedInput } from "@/core/hooks/use-debounced-input"

import { usePersistentQueryStates } from "@/packages/use-persistent-query-states"

import type { Todo } from "../../api/todos.schema"
import { createActiveFilterBadges } from "../../lib/filter-state"

import { ColumnFilterPopover } from "./column-filter-popover"
import { columnFilterConfig, type ColumnFilterDef } from "./columns"

// ═══════════════════════════════════════════════════════════════════════
// URL parsers & types
// ═══════════════════════════════════════════════════════════════════════

const STORAGE_KEY = "todo-table-filters-v3"

/** All column IDs that can be sorted. */
const SORTABLE_COLUMNS = ["id", "status", "text", "createdAt"] as const
type SortableColumn = (typeof SORTABLE_COLUMNS)[number]

const filterParsers = {
  status: parseAsStringEnum(["all", "done", "open"]).withDefault("all"),
  search: parseAsString.withDefault(""),
  sort: parseAsString.withDefault(""),
  colFilters: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(10),
}

export type TodoTableFilterValues = {
  status: "all" | "done" | "open"
  search: string
  sort: string
  colFilters: string
  page: number
  pageSize: number
}

// ═══════════════════════════════════════════════════════════════════════
// Sort serialization helpers
// ═══════════════════════════════════════════════════════════════════════

/** Parse "col:dir,col:dir" into TanStack SortingState. */
function parseSort(raw: string): SortingState {
  if (!raw) return []
  return raw.split(",").flatMap(part => {
    const [col, dir] = part.split(":")
    if (SORTABLE_COLUMNS.includes(col as SortableColumn) && (dir === "asc" || dir === "desc")) {
      return [{ id: col, desc: dir === "desc" }]
    }
    return []
  })
}

/** Serialize SortingState into "col:dir,col:dir". */
function stringifySort(state: SortingState): string {
  return state
    .filter(s => SORTABLE_COLUMNS.includes(s.id as SortableColumn))
    .map(s => `${s.id}:${s.desc ? "desc" : "asc"}`)
    .join(",")
}

// ═══════════════════════════════════════════════════════════════════════
// Column filter serialization helpers
// ═══════════════════════════════════════════════════════════════════════

/** Parse "col:val|col:val" into a column→value map. */
function parseColFilters(raw: string): Record<string, string> {
  if (!raw) return {}
  const map: Record<string, string> = {}
  for (const part of raw.split("|")) {
    const idx = part.indexOf(":")
    if (idx === -1) continue
    const col = part.slice(0, idx)
    const val = part.slice(idx + 1)
    if (col && val) map[col] = val
  }
  return map
}

/** Serialize a column→value map into "col:val|col:val". Empty/"all" values are omitted. */
function stringifyColFilters(map: Record<string, string>): string {
  return Object.entries(map)
    .filter(([, v]) => v !== "" && v !== "all")
    .map(([col, val]) => `${col}:${val}`)
    .join("|")
}

/** Get the current filter value for a column. */
function getColFilterValue(filtersRaw: string, colId: string): string {
  return parseColFilters(filtersRaw)[colId] ?? ""
}

// ═══════════════════════════════════════════════════════════════════════
// Pure filtering
// ═══════════════════════════════════════════════════════════════════════

function filterTodos(todos: Todo[], f: TodoTableFilterValues): Todo[] {
  let rows = todos
  const colFilters = parseColFilters(f.colFilters)

  if (f.status !== "all") rows = rows.filter(t => t.done === (f.status === "done"))
  if (f.search) {
    const q = f.search.toLowerCase()
    rows = rows.filter(t => t.text.toLowerCase().includes(q))
  }

  // Dynamic column filters — no per-column boilerplate
  if (colFilters.status && colFilters.status !== "all") {
    rows = rows.filter(t => t.done === (colFilters.status === "done"))
  }
  if (colFilters.text) {
    const q = colFilters.text.toLowerCase()
    rows = rows.filter(t => t.text.toLowerCase().includes(q))
  }
  if (colFilters.createdAt) {
    rows = rows.filter(t => t.createdAt.startsWith(colFilters.createdAt))
  }
  if (colFilters.id) {
    const q = colFilters.id.toLowerCase()
    rows = rows.filter(t => t.id.toLowerCase().includes(q))
  }

  return rows
}

// ═══════════════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════════════

function getColFilterDef(colId: string): ColumnFilterDef | undefined {
  return columnFilterConfig[colId]
}

/** Generate page numbers with ellipsis for pagination display. */
function generatePageNumbers(
  current: number,
  total: number,
  maxVisible = 5
): (number | "ellipsis")[] {
  if (total <= maxVisible + 2) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | "ellipsis")[] = []
  const left = Math.max(2, current - Math.floor((maxVisible - 2) / 2))
  const right = Math.min(total - 1, left + maxVisible - 3)

  // Adjust left if right is maxed out
  const adjustedLeft = Math.max(2, right - (maxVisible - 3))

  pages.push(1)
  if (adjustedLeft > 2) pages.push("ellipsis")

  for (let i = adjustedLeft; i <= right; i++) {
    pages.push(i)
  }

  if (right < total - 1) pages.push("ellipsis")
  pages.push(total)

  return pages
}

// ═══════════════════════════════════════════════════════════════════════
// DataTable
// ═══════════════════════════════════════════════════════════════════════

interface DataTableProps {
  columns: ColumnDef<Todo, unknown>[]
  data: Todo[]
  isLoading: boolean
  onFilteredChange?: (filtered: Todo[]) => void
}

export function DataTable({ columns, data: rawData, isLoading, onFilteredChange }: DataTableProps) {
  const [filters, setUrlFilters] = usePersistentQueryStates({
    parsers: filterParsers,
    persist: true,
    storageKey: STORAGE_KEY,
    options: {
      history: "replace",
      shallow: false,
    },
  })

  // ── Set multiple filters without resetting others ──
  const setFilters = useCallback(
    (patch: Partial<TodoTableFilterValues>) => {
      const hasNonPage = Object.keys(patch).some(k => k !== "page" && k !== "pageSize")
      void setUrlFilters({
        ...filters,
        ...patch,
        ...(hasNonPage ? { page: 1 } : {}),
      })
    },
    [filters, setUrlFilters]
  )

  // Filtering (pure, memoized)
  const filtered = useMemo(() => filterTodos(rawData, filters), [rawData, filters])

  // Notify parent
  useEffect(() => {
    onFilteredChange?.(filtered)
  }, [filtered, onFilteredChange])

  // Debounced global search (uncontrolled input to avoid setState-in-effect)
  const [searchRef, handleSearchChange] = useDebouncedInput(filters.search, v =>
    setFilters({ search: v })
  )

  // Sorting: parsed from ordered "col:dir,col:dir" URL param
  const sorting: SortingState = useMemo(
    () => parseSort((filters as unknown as TodoTableFilterValues).sort),
    [filters]
  )

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const table = useReactTable({
    data: filtered,
    columns,
    state: {
      sorting,
      columnVisibility,
      pagination: {
        pageIndex: filters.page - 1,
        pageSize: filters.pageSize,
      },
    },
    enableMultiSort: true,
    isMultiSortEvent: () => true,
    onSortingChange: updater => {
      const next = typeof updater === "function" ? updater(sorting) : updater
      setFilters({ sort: stringifySort(next) })
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const totalPages = table.getPageCount()
  const pageIndex = table.getState().pagination.pageIndex + 1

  // Active filter badges — simple filters + dynamic column filters
  const activeFilterBadges = useMemo(() => {
    const simple = createActiveFilterBadges<TodoTableFilterValues>({
      filters,
      setFilters,
      definitions: [
        { key: "status", emptyValue: "all", label: value => `Status: ${value}` },
        { key: "search", emptyValue: "", label: value => `Search: "${value}"` },
      ],
    })

    const colFilters = parseColFilters((filters as unknown as TodoTableFilterValues).colFilters)
    const colBadges = Object.entries(colFilters).map(([col, val]) => ({
      key: `col_${col}`,
      label: `Col-${col}: "${val}"`,
      clear: () => {
        const next = { ...colFilters }
        delete next[col]
        setFilters({ colFilters: stringifyColFilters(next) } as Partial<TodoTableFilterValues>)
      },
    }))

    return [...simple, ...colBadges]
  }, [filters, setFilters])

  const clearAll = useCallback(() => {
    void setUrlFilters({
      status: "all",
      search: "",
      sort: "",
      colFilters: "",
      page: 1,
      pageSize: 10,
    } as Partial<TodoTableFilterValues>)
  }, [setUrlFilters])

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-52 flex-1">
          <HugeiconsIcon
            icon={Search01Icon}
            className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
          />
          <Input
            ref={searchRef}
            placeholder="Filter todos…"
            defaultValue={filters.search}
            onChange={handleSearchChange}
            className="pl-9"
          />
        </div>

        <Select
          value={filters.status}
          onValueChange={v => setFilters({ status: v as TodoTableFilterValues["status"] })}
        >
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="done">Done</SelectItem>
            <SelectItem value="open">Open</SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-sm font-medium shadow-xs transition-colors">
            <HugeiconsIcon icon={LayoutGridIcon} />
            Columns
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(col => col.getCanHide())
              .map(col => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  checked={col.getIsVisible()}
                  onCheckedChange={value => col.toggleVisibility(!!value)}
                >
                  {typeof col.columnDef.header === "string" ? col.columnDef.header : col.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Active filters */}
      {activeFilterBadges.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Active filters:</span>
          {activeFilterBadges.map(b => (
            <Badge key={b.key} variant="secondary" className="cursor-pointer" onClick={b.clear}>
              {b.label} ✕
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground h-6 px-2 text-xs"
            onClick={clearAll}
          >
            Clear all
          </Button>
          <span className="text-muted-foreground ml-auto text-xs">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(hg => (
              <TableRow key={hg.id}>
                {hg.headers.map(header => {
                  const colId = header.column.id
                  const fDef = getColFilterDef(colId)
                  const colFiltersRaw = (filters as unknown as TodoTableFilterValues).colFilters
                  const colVal = getColFilterValue(colFiltersRaw, colId)

                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                    >
                      <div className="flex items-center gap-1.5">
                        {header.column.getCanSort() ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="-ml-3"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <HugeiconsIcon icon={ArrowUp01Icon} className="size-3.5" />,
                              desc: <HugeiconsIcon icon={ArrowDown01Icon} className="size-3.5" />,
                            }[header.column.getIsSorted() as string] ?? (
                              <HugeiconsIcon
                                icon={UnfoldMoreIcon}
                                className="size-3.5 opacity-50"
                              />
                            )}
                          </Button>
                        ) : (
                          <span className="text-sm font-medium">
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </span>
                        )}
                        {fDef && (
                          <ColumnFilterPopover
                            colId={colId}
                            filterDef={fDef}
                            currentValue={colVal}
                            onValueChange={v => {
                              const allFilters = parseColFilters(colFiltersRaw)
                              if (v === "" || v === "all") {
                                delete allFilters[colId]
                              } else {
                                allFilters[colId] = v
                              }
                              setFilters({
                                colFilters: stringifyColFilters(allFilters),
                              } as Partial<TodoTableFilterValues>)
                            }}
                          />
                        )}
                      </div>
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: filters.pageSize }).map((_, i) => (
                <TableRow key={`sk-${i}`}>
                  {columns.map((_, ci) => (
                    <TableCell key={ci}>
                      <div className="bg-muted h-4 w-full animate-pulse rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <HugeiconsIcon icon={Search01Icon} className="text-muted-foreground size-8" />
                    <span className="text-muted-foreground font-medium">No todos found</span>
                    <span className="text-muted-foreground text-xs">
                      Try adjusting your filters
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Rows per page */}
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <span>Rows</span>
          <Select
            value={String(filters.pageSize)}
            onValueChange={v => {
              const size = Number(v)
              table.setPageSize(size)
              setFilters({ pageSize: size, page: 1 })
            }}
          >
            <SelectTrigger className="h-8 w-18">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 30, 50].map(s => (
                <SelectItem key={s} value={String(s)}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page info */}
        <span className="text-muted-foreground text-sm tabular-nums">
          {filtered.length === 0
            ? "0 results"
            : `${(pageIndex - 1) * filters.pageSize + 1}–${Math.min(pageIndex * filters.pageSize, filtered.length)} of ${filtered.length}`}
        </span>

        {/* Page controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            disabled={pageIndex <= 1}
            onClick={() => {
              table.setPageIndex(0)
              setFilters({ page: 1 })
            }}
            title="First page"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-3.5" strokeWidth={2} />
            <HugeiconsIcon icon={ArrowLeft01Icon} className="-ml-1 size-3.5" strokeWidth={2} />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="size-8"
            disabled={pageIndex <= 1}
            onClick={() => {
              table.previousPage()
              setFilters({ page: pageIndex - 1 })
            }}
            title="Previous page"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
          </Button>

          {generatePageNumbers(pageIndex, totalPages).map((p, i) =>
            p === "ellipsis" ? (
              <span key={`e-${i}`} className="text-muted-foreground px-1 text-sm select-none">
                …
              </span>
            ) : (
              <Button
                key={p}
                variant={p === pageIndex ? "default" : "outline"}
                size="icon"
                className="size-8 text-sm"
                onClick={() => {
                  table.setPageIndex(p - 1)
                  setFilters({ page: p })
                }}
              >
                {p}
              </Button>
            )
          )}

          <Button
            variant="outline"
            size="icon"
            className="size-8"
            disabled={pageIndex >= totalPages}
            onClick={() => {
              table.nextPage()
              setFilters({ page: pageIndex + 1 })
            }}
            title="Next page"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="size-8"
            disabled={pageIndex >= totalPages}
            onClick={() => {
              table.setPageIndex(totalPages - 1)
              setFilters({ page: totalPages })
            }}
            title="Last page"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" strokeWidth={2} />
            <HugeiconsIcon icon={ArrowRight01Icon} className="-ml-1 size-3.5" strokeWidth={2} />
          </Button>
        </div>
      </div>
    </div>
  )
}
