/**
 * Fetch and cache the permissions mapping from the backend.
 *
 * The mapping is fetched once on app startup and stored in a Jotai atom.
 * `permissionsAtom` reads from this mapping to resolve what the current
 * user can do.
 */

import { atom } from "jotai"

import { $fetch } from "@/packages/tanstack/lib/client"

export interface PermissionsMapping {
  permissions: readonly string[]
  roles: readonly string[]
  rolePermissions: Record<string, readonly string[]>
}

/** The fetched permissions mapping (null until loaded). */
export const permissionsMappingAtom = atom<PermissionsMapping | null>(null)

/** Fetch the permissions mapping from the backend. */
export async function fetchPermissionsMapping(): Promise<PermissionsMapping> {
  return $fetch("/@get/mock/permissions")
}
