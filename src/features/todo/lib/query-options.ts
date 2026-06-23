/**
 * TanStack Query query options for the todos feature.
 *
 * Uses object-based query keys (2026 standard) for:
 * - Named destructuring from QueryFunctionContext
 * - Order-independent fuzzy matching for cache invalidation
 */

import { queryOptions } from "@tanstack/react-query"

import { k } from "@/packages/tanstack/lib/query-factory"

import { getTodo, listTodos } from "../api/todos.api"

// ─── Query key factory (object keys) ────────────────────────────────────

export const todoKeys = {
  all: k("todos"),
  lists: () => k("todos", { entity: "list" }),
  list: (status?: string) => k("todos", { entity: "list", ...(status ? { status } : {}) }),
  details: () => k("todos", { entity: "detail" }),
  detail: (id: string) => k("todos", { entity: "detail", id }),
}

// ─── Query options ──────────────────────────────────────────────────────

export const todoListQueryOptions = () =>
  queryOptions({
    queryKey: todoKeys.list(),
    queryFn: listTodos,
  })

export const todoDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: todoKeys.detail(id),
    queryFn: () => getTodo(id),
  })
