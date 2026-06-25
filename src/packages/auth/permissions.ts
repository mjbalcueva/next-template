import type { AuthUser, Permission } from "./schemas"

export function hasPermission(permissions: readonly Permission[], permission: Permission) {
  return permissions.includes(permission)
}

export function hasEveryPermission(
  permissions: readonly Permission[],
  requiredPermissions: readonly Permission[]
) {
  return requiredPermissions.every(permission => permissions.includes(permission))
}

export function hasAnyPermission(
  permissions: readonly Permission[],
  requiredPermissions: readonly Permission[]
) {
  return requiredPermissions.some(permission => permissions.includes(permission))
}

export function hasResourcePermission(permissions: readonly Permission[], resource: string) {
  const prefix = `${resource}:`
  return permissions.some(permission => permission.startsWith(prefix))
}

export function hasActionPermission(permissions: readonly Permission[], action: string) {
  const suffix = `:${action}`
  return permissions.some(permission => permission.endsWith(suffix))
}

export function hasAbacPermission(
  permissions: readonly Permission[],
  resource: string,
  action: string
) {
  return permissions.includes(`${resource}:${action}`) || permissions.includes(`${resource}:manage`)
}

export function hasRole(user: AuthUser | null, roles: readonly string[]) {
  return user !== null && roles.includes(user.role)
}
