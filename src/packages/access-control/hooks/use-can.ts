"use client"

import { useAtomValue } from "jotai"

import { canAllAtom, canAnyAtom, canAtom } from "../lib/atoms"
import type { Permission } from "../lib/constants"

/** Check a single permission. */
export function useCan(permission: Permission): boolean {
  return useAtomValue(canAtom(permission))
}

/** Check ALL permissions (AND). */
export function useCanAll(permissions: readonly Permission[]): boolean {
  return useAtomValue(canAllAtom(permissions))
}

/** Check ANY permission (OR). */
export function useCanAny(permissions: readonly Permission[]): boolean {
  return useAtomValue(canAnyAtom(permissions))
}
