"use client"

import { type ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/core/components/ui/badge"

import type { Todo } from "../../api/todos.schema"

// ─── Column definitions ────────────────────────────────────────────────

export const todoColumns: ColumnDef<Todo, unknown>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ getValue }) => `${getValue<string>().slice(0, 8)}…`,
    enableSorting: false,
    size: 110,
  },
  {
    id: "status",
    accessorKey: "done",
    header: "Status",
    cell: ({ getValue }) => (
      <Badge variant={getValue<boolean>() ? "default" : "secondary"}>
        {getValue<boolean>() ? "Done" : "Open"}
      </Badge>
    ),
    size: 100,
  },
  {
    accessorKey: "text",
    header: "Task",
    size: 300,
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
    sortingFn: "datetime",
    size: 140,
  },
]

// ─── Per-column filter configuration ───────────────────────────────────
// Each key matches a column `id` or `accessorKey`.

export type ColumnFilterType = "select" | "text"

export interface ColumnFilterDef {
  type: ColumnFilterType
  placeholder?: string
  options?: { label: string; value: string }[]
}

export const columnFilterConfig: Record<string, ColumnFilterDef> = {
  status: {
    type: "select",
    options: [
      { label: "All", value: "all" },
      { label: "Done", value: "done" },
      { label: "Open", value: "open" },
    ],
  },
  text: {
    type: "text",
    placeholder: "Filter tasks…",
  },
  createdAt: {
    type: "text",
    placeholder: "Filter date…",
  },
  id: {
    type: "text",
    placeholder: "Filter ID…",
  },
}
