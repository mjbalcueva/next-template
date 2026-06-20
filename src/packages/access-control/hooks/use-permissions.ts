"use client"

import { useAtomValue } from "jotai"

import { permissionsAtom } from "../lib/atoms"
import type { Permission } from "../lib/constants"

/** Get all permissions for the current user. */
export function usePermissions(): readonly Permission[] {
  return useAtomValue(permissionsAtom)
}
