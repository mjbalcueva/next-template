/**
 * Jotai permission atoms — function-based permission checks.
 *
 * These derive from the current user's role (via `userAtom`)
 * and the dynamically-fetched `permissionsMappingAtom`.
 */

import { atom, type Getter } from "jotai"

import { userAtom } from "@/features/auth/lib/atoms"

import type { Permission } from "./constants"
import { permissionsMappingAtom } from "./fetch-permissions"

/** The permissions for the currently logged-in user (derived from role + fetched mapping). */
export const permissionsAtom = atom<readonly Permission[]>((get: Getter) => {
  const user = get(userAtom)
  const mapping = get(permissionsMappingAtom)
  if (!user || !mapping) return []
  return (mapping.rolePermissions[user.role] as readonly Permission[]) ?? []
})

/** Check a single permission. Returns false when permission is undefined. */
export const canAtom = (permission: Permission | undefined) =>
  atom((get: Getter) => {
    if (!permission) return false
    return (get(permissionsAtom) as readonly string[]).includes(permission)
  })

/** Check ALL permissions (AND). Returns false when permissions is undefined. */
export const canAllAtom = (permissions: readonly Permission[] | undefined) =>
  atom((get: Getter) => {
    if (!permissions) return false
    const current = get(permissionsAtom)
    return permissions.every(p => (current as readonly string[]).includes(p))
  })

/** Check ANY permission (OR). Returns false when anyOf is undefined. */
export const canAnyAtom = (permissions: readonly Permission[] | undefined) =>
  atom((get: Getter) => {
    if (!permissions) return false
    const current = get(permissionsAtom)
    return permissions.some(p => (current as readonly string[]).includes(p))
  })
