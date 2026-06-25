"use client"

import { useQuery } from "@tanstack/react-query"

import { useUser } from "@/features/auth/hooks/use-session"

import { permissionsQueryOptions } from "./query-options"

/**
 * Universal hook — returns the current user's permissions.
 *
 * Keyed by `userId` so switching accounts triggers a fresh fetch.
 * Disabled when no user is loaded (avoids firing without a valid token).
 *
 * `staleTime: Infinity` means calling this 500 times across the UI
 * costs 1 network request. React Query deduplicates automatically.
 */
export function useResolvedPermissions(): readonly string[] {
  const userId = useUser()?.id
  const { data } = useQuery(permissionsQueryOptions(userId))
  return data?.permissions ?? []
}

// ─── Permission checks (one hook each, backed by useResolvedPermissions) ──

/** Check a single `"resource:action"` string. */
export function useCan(permission: string): boolean {
  const perms = useResolvedPermissions()
  return perms.includes(permission)
}

/** Check ALL permissions (AND). */
export function useCanAll(permissions: readonly string[]): boolean {
  const perms = useResolvedPermissions()
  return permissions.every(p => perms.includes(p))
}

/** Check ANY permission (OR). */
export function useCanAny(permissions: readonly string[]): boolean {
  const perms = useResolvedPermissions()
  return permissions.some(p => perms.includes(p))
}

/** Check if the user has ANY permission on the given resource. */
export function useCanResource(resource: string): boolean {
  const perms = useResolvedPermissions()
  const prefix = `${resource}:`
  return perms.some(p => p.startsWith(prefix))
}

/** Check if the user has a specific action on ANY resource. */
export function useCanAction(action: string): boolean {
  const perms = useResolvedPermissions()
  const suffix = `:${action}`
  return perms.some(p => p.endsWith(suffix))
}

/** ABAC check — exact match or `"resource:manage"` wildcard. */
export function useCanAbac(resource: string, action: string): boolean {
  const perms = useResolvedPermissions()
  const required = `${resource}:${action}`
  const wildcard = `${resource}:manage`
  return perms.includes(required) || perms.includes(wildcard)
}

// ─── Available values (derived from the user's own permissions) ──────

/** All permissions the current user has. Alias for `useResolvedPermissions`. */
export const usePermissions = useResolvedPermissions

/** All permissions the current user has. */
export function useAvailablePermissions(): readonly string[] {
  return useResolvedPermissions()
}

/** Unique resource names the user has access to. */
export function useAvailableResources(): readonly string[] {
  const perms = useResolvedPermissions()
  return [...new Set(perms.map(p => p.split(":")[0]!))]
}

/** Unique action names the user can perform. */
export function useAvailableActions(): readonly string[] {
  const perms = useResolvedPermissions()
  return [...new Set(perms.map(p => p.split(":")[1]!).filter(Boolean))]
}
