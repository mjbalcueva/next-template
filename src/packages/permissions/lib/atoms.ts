/**
 * Jotai permission atoms — function-based permission checks.
 *
 * These derive from the current user's role (via `userAtom`)
 * and the static `ROLE_PERMISSIONS` matrix.
 */

import { atom, type Getter } from "jotai"

import { userAtom } from "@/features/auth/atoms"

import { ROLE_PERMISSIONS, type Permission } from "./constants"

/** The permissions for the currently logged-in user (derived from role). */
export const permissionsAtom = atom<readonly Permission[]>((get: Getter) => {
  const user = get(userAtom)
  if (!user) return []
  return ROLE_PERMISSIONS[user.role] ?? []
})

/** Check a single permission. */
export const canAtom = (permission: Permission) =>
  atom((get: Getter) => (get(permissionsAtom) as readonly string[]).includes(permission))

/** Check ALL permissions (AND). */
export const canAllAtom = (permissions: readonly Permission[]) =>
  atom((get: Getter) => {
    const current = get(permissionsAtom)
    return permissions.every(p => (current as readonly string[]).includes(p))
  })

/** Check ANY permission (OR). */
export const canAnyAtom = (permissions: readonly Permission[]) =>
  atom((get: Getter) => {
    const current = get(permissionsAtom)
    return permissions.some(p => (current as readonly string[]).includes(p))
  })
