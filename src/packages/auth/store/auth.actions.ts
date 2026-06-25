"use client"

import { useMemo } from "react"

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

export function useUser() {
  return useAuthStore(s => s.user)
}

export function useIsAuthenticated() {
  return useAuthStore(s => s.user !== null)
}

export function usePermissions() {
  return useAuthStore(s => s.permissions)
}

/**
 * Returns the full store, matching the old `useSession()` / `useAuth()` shape.
 * Prefer narrower hooks above when you only need one field.
 */
export function useAuth() {
  const user = useAuthStore(s => s.user)
  const permissions = useAuthStore(s => s.permissions)
  const refreshSession = useAuthStore(s => s.refreshSession)
  const setSession = useAuthStore(s => s.setSession)
  const setUser = useAuthStore(s => s.setUser)
  const setPermissions = useAuthStore(s => s.setPermissions)
  const clearSession = useAuthStore(s => s.clearSession)

  return useMemo(
    () => ({
      user,
      permissions,
      isAuthenticated: user !== null,
      refreshSession,
      setSession,
      setUser,
      setPermissions,
      clearSession,
    }),
    [user, permissions, refreshSession, setSession, setUser, setPermissions, clearSession]
  )
}

// ─── Permission checks ─────────────────────────────────────────────────

export function useCan(permission: Permission) {
  const permissions = useAuthStore(s => s.permissions)
  return hasPermission(permissions, permission)
}

export function useCanAll(permissions: readonly Permission[]) {
  const all = useAuthStore(s => s.permissions)
  return hasEveryPermission(all, permissions)
}

export function useCanAny(permissions: readonly Permission[]) {
  const all = useAuthStore(s => s.permissions)
  return hasAnyPermission(all, permissions)
}

export function useCanResource(resource: string) {
  const permissions = useAuthStore(s => s.permissions)
  return hasResourcePermission(permissions, resource)
}

export function useCanAction(action: string) {
  const permissions = useAuthStore(s => s.permissions)
  return hasActionPermission(permissions, action)
}

export function useCanAbac(resource: string, action: string) {
  const permissions = useAuthStore(s => s.permissions)
  return hasAbacPermission(permissions, resource, action)
}

export function useHasRole(roles: readonly string[]) {
  const user = useAuthStore(s => s.user)
  return hasRole(user, roles)
}

// ─── Derived ───────────────────────────────────────────────────────────

export function useAvailableResources() {
  const permissions = useAuthStore(s => s.permissions)
  return [...new Set(permissions.map(p => p.split(":")[0]).filter(Boolean))]
}

export function useAvailableActions() {
  const permissions = useAuthStore(s => s.permissions)
  return [...new Set(permissions.map(p => p.split(":")[1]).filter(Boolean))]
}
