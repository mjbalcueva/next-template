"use client"

import { useMemo } from "react"

import { useQuery } from "@tanstack/react-query"
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table"
import { parseAsInteger, parseAsStringLiteral, useQueryState } from "nuqs"

import { Checkbox } from "@/core/components/ui/checkbox"

import type { Todo } from "../api/todos.schema"
import { todoListQueryOptions } from "../lib/query-options"
import {
  todoTableFiltersStore,
  useTodoTableFilters,
  type TodoTableFilters,
} from "../store/filter.store"

// ─── Column definition ────────────────────────────────────────────────

const col = createColumnHelper<Todo>()

const columns = [
  col.display({
    id: "done",
    header: "✓",
    cell: info => (
      <Checkbox checked={info.row.original.done} disabled className="pointer-events-none" />
    ),
    enableSorting: false,
    size: 40,
  }),
  col.accessor("text", { header: "Task", size: 300 }),
  col.accessor("createdAt", {
    header: "Created",
    cell: info => new Date(info.getValue()).toLocaleDateString(),
  }),
]

// ─── Nuqs parsers ──────────────────────────────────────────────────────

const statusParser = parseAsStringLiteral(["all", "done", "open"] as const)
const sortByParser = parseAsStringLiteral(["text", "createdAt", "status"] as const)
const dirParser = parseAsStringLiteral(["asc", "desc"] as const)

// ─── Hook ──────────────────────────────────────────────────────────────

export function useTodoTable() {
  const filters = useTodoTableFilters()

  // URL state — falls back to Zustand (which falls back to localStorage)
  const storeInit = todoTableFiltersStore.getState()
  const [urlStatus, setUrlStatus] = useQueryState(
    "stats",
    statusParser.withDefault(storeInit.status)
  )
  const [urlSortBy, setUrlSortBy] = useQueryState("srt", sortByParser.withDefault(storeInit.sortBy))
  const [urlSortDir, setUrlSortDir] = useQueryState("dir", dirParser.withDefault(storeInit.sortDir))
  const [urlPage, setUrlPage] = useQueryState("page", parseAsInteger.withDefault(storeInit.page))
  const [urlPp, setUrlPp] = useQueryState("pp", parseAsInteger.withDefault(storeInit.pageSize))

  // Merge: URL wins over Zustand (shareable link beats local preference)
  const active: TodoTableFilters = {
    status: urlStatus ?? filters.status,
    sortBy: urlSortBy ?? filters.sortBy,
    sortDir: urlSortDir ?? filters.sortDir,
    page: urlPage ?? filters.page,
    pageSize: urlPp ?? filters.pageSize,
  }

  // Persist changes to both targets
  function set<K extends keyof TodoTableFilters>(key: K, value: TodoTableFilters[K]) {
    useTodoTableFilters.setState(s => {
      s[key] = value
    })
    switch (key) {
      case "status":
        setUrlStatus(value as TodoTableFilters["status"])
        break
      case "sortBy":
        setUrlSortBy(value as TodoTableFilters["sortBy"])
        break
      case "sortDir":
        setUrlSortDir(value as TodoTableFilters["sortDir"])
        break
      case "page":
        setUrlPage(value as TodoTableFilters["page"])
        break
      case "pageSize":
        setUrlPp(value as TodoTableFilters["pageSize"])
        break
    }
  }

  // ── Data ──
  const { data: todos } = useQuery(todoListQueryOptions())

  // ── Client-side filtering / sorting ──
  const filtered = useMemo(() => {
    let rows = todos ?? []
    if (active.status !== "all") rows = rows.filter(t => t.done === (active.status === "done"))
    return rows
  }, [todos, active.status])

  const sorting: SortingState = [{ id: active.sortBy, desc: active.sortDir === "desc" }]

  const table = useReactTable({
    data: filtered,
    columns,
    state: {
      sorting,
      pagination: { pageIndex: active.page - 1, pageSize: active.pageSize },
    },
    onSortingChange: updater => {
      const next = typeof updater === "function" ? updater(sorting) : updater
      if (next.length) {
        set("sortBy", next[0].id as TodoTableFilters["sortBy"])
        set("sortDir", next[0].desc ? "desc" : "asc")
      }
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: false,
    manualSorting: false,
  })

  return { table, active, set }
}
