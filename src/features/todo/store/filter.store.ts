"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

export interface TodoTableFilters {
  status: "all" | "done" | "open"
  sortBy: "text" | "createdAt" | "status"
  sortDir: "asc" | "desc"
  page: number
  pageSize: number
}

const todoTableFiltersStore = create<TodoTableFilters>()(
  immer(
    persist(
      (): TodoTableFilters => ({
        status: "all",
        sortBy: "createdAt",
        sortDir: "desc",
        page: 1,
        pageSize: 10,
      }),
      { name: "todo-table-filters" }
    )
  )
)

export const useTodoTableFilters = todoTableFiltersStore
export { todoTableFiltersStore }
