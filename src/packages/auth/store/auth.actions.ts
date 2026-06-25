"use client"

import { useMemo } from "react"

import { useShallow } from "zustand/shallow"

import {
  hasAbacPermission,
  hasActionPermission,
  hasAnyPermission,
  hasEveryPermission,
  hasPermission,
  hasResourcePermission,
  hasRole,
} from "../lib/permissions"
import type { Permission } from "../lib/schemas"

import { useAuthStore } from "./auth.store"

// ─── Core state ────────────────────────────────────────────────────────

/**
 * Returns the current user or `null`.
 *
 * @example
 * const user = useUser()
 * console.log(user?.name) // "Jane Member"
 */
export function useUser() {
  return useAuthStore(s => s.user)
}

/**
 * Whether the user is authenticated.  Derived from `user !== null`.
 *
 * @example
 * const isAuthenticated = useIsAuthenticated()
 * if (!isAuthenticated) return <LoginLink />
 */
export function useIsAuthenticated() {
  return useAuthStore(s => s.user !== null)
}

/**
 * Returns the flat list of resolved permissions (e.g. `["todos:create", "admin:access"]`).
 *
 * @example
 * const permissions = usePermissions()
 * const canEdit = permissions.includes("todos:update")
 */
export function usePermissions() {
  return useAuthStore(s => s.permissions)
}

/**
 * Returns the full session shape — user, permissions, and all store actions.
 * Uses `useShallow` so components only re-render when the picked values change.
 *
 * @example
 * const { user, isAuthenticated, clearSession } = useAuth()
 * await clearSession()
 */
export function useAuth() {
  return useAuthStore(
    useShallow(s => ({
      user: s.user,
      permissions: s.permissions,
      isAuthenticated: s.user !== null,
      refreshSession: s.refreshSession,
      setSession: s.setSession,
      setUser: s.setUser,
      setPermissions: s.setPermissions,
      clearSession: s.clearSession,
    }))
  )
}

// ─── Permission checks ─────────────────────────────────────────────────

/**
 * Check a single permission string.
 *
 * @example
 * const canCreate = useCan("todos:create")
 * {canCreate && <CreateButton />}
 */
export function useCan(permission: Permission) {
  const permissions = useAuthStore(s => s.permissions)
  return hasPermission(permissions, permission)
}

/**
 * Check that the user has **every** listed permission.
 *
 * @example
 * const canManage = useCanAll(["todos:create", "todos:delete"])
 */
export function useCanAll(permissions: readonly Permission[]) {
  const all = useAuthStore(s => s.permissions)
  return hasEveryPermission(all, permissions)
}

/**
 * Check that the user has **at least one** of the listed permissions.
 *
 * @example
 * const canModify = useCanAny(["todos:update", "todos:delete"])
 */
export function useCanAny(permissions: readonly Permission[]) {
  const all = useAuthStore(s => s.permissions)
  return hasAnyPermission(all, permissions)
}

/**
 * Check any permission matching a resource prefix (e.g. `"todos"` matches `"todos:create"`, `"todos:delete"`).
 *
 * @example
 * const hasTodoAccess = useCanResource("todos")
 */
export function useCanResource(resource: string) {
  const permissions = useAuthStore(s => s.permissions)
  return hasResourcePermission(permissions, resource)
}

/**
 * Check any permission matching an action suffix (e.g. `"delete"` matches `"todos:delete"`, `"posts:delete"`).
 *
 * @example
 * const canDeleteAnything = useCanAction("delete")
 */
export function useCanAction(action: string) {
  const permissions = useAuthStore(s => s.permissions)
  return hasActionPermission(permissions, action)
}

/**
 * ABAC-style check for a specific resource + action pair.
 * Also matches `"resource:manage"` wildcards.
 *
 * @example
 * const canDeleteTodo = useCanAbac("todos", "delete")
 */
export function useCanAbac(resource: string, action: string) {
  const permissions = useAuthStore(s => s.permissions)
  return hasAbacPermission(permissions, resource, action)
}

/**
 * Check if the user has one of the given roles.
 *
 * @example
 * const isAdmin = useHasRole(["admin"])
 * const isStaff = useHasRole(["admin", "moderator"])
 */
export function useHasRole(roles: readonly string[]) {
  const user = useAuthStore(s => s.user)
  return hasRole(user, roles)
}

// ─── Derived ───────────────────────────────────────────────────────────

/**
 * Returns all distinct resource prefixes from the user's permissions.
 *
 * @example
 * const resources = useAvailableResources() // ["todos", "admin", "settings"]
 */
export function useAvailableResources() {
  const permissions = useAuthStore(s => s.permissions)
  return useMemo(
    () => [...new Set(permissions.map(p => p.split(":")[0]).filter(Boolean))],
    [permissions]
  )
}

/**
 * Returns all distinct action suffixes from the user's permissions.
 *
 * @example
 * const actions = useAvailableActions() // ["create", "read", "update", "delete"]
 */
export function useAvailableActions() {
  const permissions = useAuthStore(s => s.permissions)
  return useMemo(
    () => [...new Set(permissions.map(p => p.split(":")[1]).filter(Boolean))],
    [permissions]
  )
}
