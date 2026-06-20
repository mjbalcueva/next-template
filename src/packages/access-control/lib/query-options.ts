"use client"

import { queryOptions } from "@tanstack/react-query"

import { fetchMyPermissions } from "../api/permissions.api"

export const permissionsKeys = {
  all: ["auth", "permissions"] as const,
}

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
