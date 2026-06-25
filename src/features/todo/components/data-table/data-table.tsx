"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import {
  ArrowDown01Icon,
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
import { createActiveFilterBadges, getColumnFilterKey } from "../../lib/filter-state"

import { ColumnFilterPopover } from "./column-filter-popover"
import { columnFilterConfig, type ColumnFilterDef } from "./columns"

// ═══════════════════════════════════════════════════════════════════════
// URL parsers & types
// ═══════════════════════════════════════════════════════════════════════

const STORAGE_KEY = "todo-table-filters"

const filterParsers = {
  status: parseAsStringEnum(["all", "done", "open"]).withDefault("all"),
  search: parseAsString.withDefault(""),
  sortBy: parseAsString.withDefault(""),
  sortDir: parseAsStringEnum(["asc", "desc"]).withDefault("desc"),
  col_status: parseAsStringEnum(["all", "done", "open"]).withDefault("all"),
  col_text: parseAsString.withDefault(""),
  col_createdAt: parseAsString.withDefault(""),
  col_id: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(10),
}

export type TodoTableFilterValues = {
  status: "all" | "done" | "open"
  search: string
  sortBy: string
  sortDir: "asc" | "desc"
  col_status: "all" | "done" | "open"
  col_text: string
  col_createdAt: string
  col_id: string
  page: number
  pageSize: number
}

// ═══════════════════════════════════════════════════════════════════════
// Pure filtering
// ═══════════════════════════════════════════════════════════════════════

function filterTodos(todos: Todo[], f: TodoTableFilterValues): Todo[] {
  let rows = todos

  if (f.status !== "all") rows = rows.filter(t => t.done === (f.status === "done"))
  if (f.search) {
    const q = f.search.toLowerCase()
    rows = rows.filter(t => t.text.toLowerCase().includes(q))
  }
  if (f.col_status !== "all") rows = rows.filter(t => t.done === (f.col_status === "done"))
  if (f.col_text) {
    const q = f.col_text.toLowerCase()
    rows = rows.filter(t => t.text.toLowerCase().includes(q))
  }
  if (f.col_createdAt) {
    const q = f.col_createdAt.toLowerCase()
    rows = rows.filter(t => t.createdAt.toLowerCase().includes(q))
  }
  if (f.col_id) {
    const q = f.col_id.toLowerCase()
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
      const hasNonSort = Object.keys(patch).some(
        k => k !== "sortBy" && k !== "sortDir" && k !== "page" && k !== "pageSize"
      )
      void setUrlFilters({
        ...filters,
        ...patch,
        ...(hasNonSort ? { page: 1 } : {}),
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

  // Sorting: derived from URL (not duplicated in useState)
  const sorting: SortingState = filters.sortBy
    ? [{ id: filters.sortBy, desc: filters.sortDir === "desc" }]
    : []

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
    manualSorting: true,
    onSortingChange: updater => {
      const next = typeof updater === "function" ? updater(sorting) : updater
      if (next.length > 0) {
        const { id, desc } = next[0]
        setFilters({ sortBy: id, sortDir: desc ? "desc" : "asc" })
      } else {
        setFilters({ sortBy: "" })
      }
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const totalPages = table.getPageCount()
  const pageIndex = table.getState().pagination.pageIndex + 1

  // Active filter badges
  const activeFilterBadges = useMemo(() => {
    return createActiveFilterBadges<TodoTableFilterValues>({
      filters,
      setFilters,
      definitions: [
        { key: "status", emptyValue: "all", label: value => `Status: ${value}` },
        { key: "search", emptyValue: "", label: value => `Search: "${value}"` },
        { key: "col_status", emptyValue: "all", label: value => `Col-Status: ${value}` },
        { key: "col_text", emptyValue: "", label: value => `Col-Task: "${value}"` },
        {
          key: "col_createdAt",
          emptyValue: "",
          label: value => `Col-Created: "${value}"`,
        },
        { key: "col_id", emptyValue: "", label: value => `Col-ID: "${value}"` },
      ],
    })
  }, [filters, setFilters])

  const clearAll = useCallback(() => {
    void setUrlFilters({
      status: "all",
      search: "",
      sortBy: "",
      sortDir: "desc",
      col_status: "all",
      col_text: "",
      col_createdAt: "",
      col_id: "",
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
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(hg => (
              <TableRow key={hg.id}>
                {hg.headers.map(header => {
                  const colId = header.column.id
                  const fDef = getColFilterDef(colId)
                  const fKey = getColumnFilterKey(filters, colId)
                  const colVal = fKey ? (filters[fKey] as string) : ""

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
                        {fDef && fKey && (
                          <ColumnFilterPopover
                            colId={colId}
                            filterDef={fDef}
                            currentValue={colVal}
                            onValueChange={v =>
                              setFilters({ [fKey]: v } as Partial<TodoTableFilterValues>)
                            }
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
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">
            Page {pageIndex} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pageIndex <= 1}
              onClick={() => {
                table.setPageIndex(pageIndex - 2)
                setFilters({ page: pageIndex - 1 })
              }}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pageIndex >= totalPages}
              onClick={() => {
                table.setPageIndex(pageIndex)
                setFilters({ page: pageIndex + 1 })
              }}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
