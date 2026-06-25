"use client"

import {
  hasAbacPermission,
  hasActionPermission,
  hasAnyPermission,
  hasEveryPermission,
  hasPermission,
  hasResourcePermission,
} from "./permissions"
import type { Permission } from "./schemas"
import { useSession } from "./session-provider"

export function useUser() {
  return useSession().user
}

export function useIsAuthenticated() {
  return useSession().isAuthenticated
}

export function useResolvedPermissions(): readonly Permission[] {
  return useSession().permissions
}

export function useCan(permission: Permission) {
  return hasPermission(useResolvedPermissions(), permission)
}

export function useCanAll(permissions: readonly Permission[]) {
  return hasEveryPermission(useResolvedPermissions(), permissions)
}

export function useCanAny(permissions: readonly Permission[]) {
  return hasAnyPermission(useResolvedPermissions(), permissions)
}

export function useCanResource(resource: string) {
  return hasResourcePermission(useResolvedPermissions(), resource)
}

export function useCanAction(action: string) {
  return hasActionPermission(useResolvedPermissions(), action)
}

export function useCanAbac(resource: string, action: string) {
  return hasAbacPermission(useResolvedPermissions(), resource, action)
}

export const usePermissions = useResolvedPermissions
export const useAvailablePermissions = useResolvedPermissions

export function useAvailableResources() {
  const permissions = useResolvedPermissions()
  return [...new Set(permissions.map(permission => permission.split(":")[0]).filter(Boolean))]
}

export function useAvailableActions() {
  const permissions = useResolvedPermissions()
  return [...new Set(permissions.map(permission => permission.split(":")[1]).filter(Boolean))]
}
