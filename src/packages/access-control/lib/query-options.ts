/**
 * TanStack Query query options for the permissions feature.
 *
 * Uses object-based query keys (2026 standard).
 * NOTE: No `"use client"` — this file is used server-side for prefetching.
 */

import { queryOptions } from "@tanstack/react-query"

import { k } from "@/packages/tanstack/lib/query-factory"

import { fetchMyPermissions } from "../api/permissions.api"

export const permissionsKeys = {
  all: k("auth"),
  /** Scoped to a specific user — prevents cross-user cache leaks. */
  byUser: (userId: string) => k("auth", { entity: "permissions", userId }),
}

/**
 * Canonical query options for the current user's permissions.
 *
 * Keyed by `userId` so switching accounts (logout → login as different
 * user) triggers a fresh fetch instead of serving the previous user's
 * stale `Infinity` cache.
 *
 * @param userId - The current user's id. When `undefined` the query is
 *   disabled (no authenticated user).
 */
export function permissionsQueryOptions(userId: string | undefined) {
  return queryOptions({
    queryKey: userId ? permissionsKeys.byUser(userId) : permissionsKeys.all,
    queryFn: fetchMyPermissions,
    staleTime: Infinity,
    enabled: !!userId,
    retry: 3,
  })
}
