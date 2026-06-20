"use client"

/**
 * Fetch and cache the permissions mapping from the backend.
 *
 * The mapping is fetched once on app startup via React Query
 * and stored in a Zustand store.  Permission hooks derive
 * from the current user's role + this mapping.
 */
import { useQuery } from "@tanstack/react-query"

import { $fetch } from "@/packages/tanstack/lib/client"

import type { PermissionsMapping } from "./store"

export type { PermissionsMapping }

/** Fetch the permissions mapping from the backend. */
export async function fetchPermissionsMapping(): Promise<PermissionsMapping> {
  return $fetch("/@get/mock/permissions")
}

/**
 * React Query hook — fetches the permissions mapping once on mount
 * and stores it in the Zustand store.
 */
export function usePermissionsMappingQuery() {
  return useQuery({
    queryKey: ["permissions", "mapping"] as const,
    queryFn: fetchPermissionsMapping,
    staleTime: Infinity,
  })
}
