/**
 * TanStack Query query options for the todos feature.
 *
 * Following Tanner Linsley's best practices:
 *   - `queryOptions()` makes query configs reusable (useQuery, prefetchQuery, etc.)
 *   - Key factory avoids string duplication and ensures type safety.
 */

import { queryOptions } from "@tanstack/react-query"

import { createQueryKeys } from "@/packages/tanstack/lib/query-factory"

import { getTodo, listTodos } from "../api/todos.api"

// ─── Query key factory ──────────────────────────────────────────────────

export const todoKeys = createQueryKeys("todos", ["list", "detail"] as const)

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
