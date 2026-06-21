/**
 * TanStack Query query options for the permissions feature.
 *
 * Uses the same `createQueryKeys` factory as other features for consistency.
 * NOTE: No `"use client"` — this file is used server-side for prefetching.
 */

import { queryOptions } from "@tanstack/react-query"

import { createQueryKeys } from "@/packages/tanstack/lib/query-factory"

import { fetchMyPermissions } from "../api/permissions.api"

export const permissionsKeys = createQueryKeys("auth", ["permissions"] as const)

/**
 * Canonical query options for the current user's permissions.
 *
 * `staleTime: Infinity` means calling this 500 times across the UI
 * costs 1 network request. React Query deduplicates automatically.
 */
export function permissionsQueryOptions() {
  return queryOptions({
    queryKey: permissionsKeys.all,
    queryFn: fetchMyPermissions,
    staleTime: Infinity,
  })
}
