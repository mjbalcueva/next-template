/**
 * Zustand permissions store — derived from the current user's role
 * and the dynamically-fetched permissions mapping.
 *
 * Pattern: REST API → React Query (query) → Zustand
 *
 * The mapping is fetched once on app startup via React Query
 * and stored here.  Permission checks derive from user role +
 * rolePermissions mapping.
 */

import { create } from "zustand"

import { selectUser, useAuthStore } from "@/features/auth/lib/store"

import type { Permission, Role } from "./constants"

// ─── ABAC request ───────────────────────────────────────────────────

/**
 * Attribute-Based Access Control request.
 *
 * The frontend only checks if the user has the right `"resource:action"`
 * permission (or the `"resource:manage"` wildcard).  All attribute-based
 * logic (ownership, team membership, etc.) is evaluated **server-side**
 * by the backend — the frontend never sends contextual data like
 * `ownerId` because the client can lie.
 *
 * @example
 *   useCanAbac({ resource: "documents", action: "update" })
 */
export interface AbacRequest {
  /** The resource type (e.g. `"documents"`, `"projects"`). */
  resource: string
  /** The action to check (e.g. `"read"`, `"delete"`). */
  action: string
}

// ─── Permissions mapping shape ───────────────────────────────────────

export interface PermissionsMapping {
  permissions: readonly string[]
  roles: readonly string[]
  rolePermissions: Record<string, readonly string[]>
}

// ─── State ───────────────────────────────────────────────────────────

interface PermissionsState {
  /** The permission mapping fetched from /@get/mock/permissions. */
  mapping: PermissionsMapping | null

  setMapping: (mapping: PermissionsMapping) => void
}

export const usePermissionsStore = create<PermissionsState>()(set => ({
  mapping: null,
  setMapping: mapping => set({ mapping }),
}))

// ─── Derived selectors ───────────────────────────────────────────────

/** The permissions for the currently logged-in user (derived from role + mapping). */
export const selectPermissions = (): readonly string[] => {
  const { mapping } = usePermissionsStore.getState()
  const user = selectUser(useAuthStore.getState())
  if (!user || !mapping) return []
  return (mapping.rolePermissions[user.role] as readonly string[]) ?? []
}

/** Check a single permission. */
export const selectCan = (permission: Permission | undefined): boolean => {
  if (!permission) return false
  return selectPermissions().includes(permission)
}

/** Check ALL permissions (AND). */
export const selectCanAll = (permissions: readonly Permission[] | undefined): boolean => {
  if (!permissions) return false
  const current = selectPermissions()
  return permissions.every(p => current.includes(p))
}

/** Check ANY permission (OR). */
export const selectCanAny = (permissions: readonly Permission[] | undefined): boolean => {
  if (!permissions) return false
  const current = selectPermissions()
  return permissions.some(p => current.includes(p))
}

// ─── Hooks (React-friendly wrappers that subscribe to both stores) ──

function useResolvedPermissions(): readonly Permission[] {
  const mapping = usePermissionsStore(s => s.mapping)
  const user = useAuthStore(selectUser)
  if (!user || !mapping) return []
  return (mapping.rolePermissions[user.role] as readonly Permission[]) ?? []
}

/** Subscribe to the current user's resolved permissions. */
export function usePermissions(): readonly Permission[] {
  return useResolvedPermissions()
}

// ─── Permission check: string form ──────────────────────────────────

/** Check a single `"resource:action"` permission string. */
export function useCan(permission: Permission | undefined): boolean
/** Check a split `{ resource, action }` permission. */
export function useCan(opts: { resource: string; action: string } | undefined): boolean
export function useCan(
  permissionOrOpts: Permission | { resource: string; action: string } | undefined
): boolean {
  const perms = useResolvedPermissions()

  if (!permissionOrOpts) return false

  // Split form: { resource, action }
  if (typeof permissionOrOpts === "object") {
    const needle = `${permissionOrOpts.resource}:${permissionOrOpts.action}`
    return (perms as readonly string[]).includes(needle)
  }

  // String form: "resource:action"
  return (perms as readonly string[]).includes(permissionOrOpts)
}

/** Check if the user has ANY permission on the given resource (e.g. `"todos:*"`). */
export function useCanResource(resource: string): boolean {
  const perms = useResolvedPermissions()
  const prefix = `${resource}:`
  return (perms as readonly string[]).some(p => p.startsWith(prefix))
}

/** Check if the user has a specific action on ANY resource (e.g. `"*:delete"`). */
export function useCanAction(action: string): boolean {
  const perms = useResolvedPermissions()
  const suffix = `:${action}`
  return (perms as readonly string[]).some(p => p.endsWith(suffix))
}

/** Check ALL permissions (AND). */
export function useCanAll(permissions: readonly Permission[] | undefined): boolean {
  const perms = useResolvedPermissions()
  if (!permissions) return false
  return permissions.every(p => (perms as readonly string[]).includes(p))
}

/** Check ANY permission (OR). */
export function useCanAny(permissions: readonly Permission[] | undefined): boolean {
  const perms = useResolvedPermissions()
  if (!permissions) return false
  return permissions.some(p => (perms as readonly string[]).includes(p))
}

// ─── ABAC (Attribute-Based Access Control) ──────────────────────────

/**
 * Check access using ABAC semantics.
 *
 * Looks for an exact `"resource:action"` match OR a `"resource:manage"`
 * wildcard.  The frontend is dumb — it only checks the permission string.
 * All attribute-based logic (ownership, conditions) is evaluated by the
 * backend using the auth token.
 *
 * @example
 *   const canEdit = useCanAbac({ resource: "documents", action: "update" })
 */
export function useCanAbac(request: AbacRequest): boolean {
  const perms = useResolvedPermissions()
  const required = `${request.resource}:${request.action}`
  const wildcard = `${request.resource}:manage`
  return (perms as readonly string[]).some(p => p === required || p === wildcard)
}

// ─── Available values (derived from the backend, not hardcoded) ─────

/** All permissions the backend knows about (for admin panels, UIs, etc.). */
export function useAvailablePermissions(): readonly Permission[] {
  const mapping = usePermissionsStore(s => s.mapping)
  return mapping?.permissions ?? []
}

/** Unique resource names extracted from the permissions list. */
export function useAvailableResources(): readonly string[] {
  const perms = useAvailablePermissions()
  return [...new Set(perms.map(p => p.split(":")[0]!))]
}

/** Unique action names extracted from the permissions list. */
export function useAvailableActions(): readonly string[] {
  const perms = useAvailablePermissions()
  return [...new Set(perms.map(p => p.split(":")[1]!).filter(Boolean))]
}

/** All roles the backend knows about (for dropdowns, admin panels, etc.). */
export function useAvailableRoles(): readonly Role[] {
  const mapping = usePermissionsStore(s => s.mapping)
  return mapping?.roles ?? []
}
