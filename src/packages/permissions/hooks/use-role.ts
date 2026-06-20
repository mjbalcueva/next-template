"use client"

import { useAtomValue } from "jotai"

import { userAtom } from "@/features/auth/atoms"

import { ROLES, type Role } from "../lib/constants"

/** Get the current user's role. */
export function useRole(): Role | null {
  const user = useAtomValue(userAtom)
  return user?.role ?? null
}

/** Check if the current user has a specific role. */
export function useHasRole(role: Role): boolean {
  return useRole() === role
}

/** Check if the current user has any of the given roles. */
export function useHasAnyRole(roles: readonly Role[]): boolean {
  const currentRole = useRole()
  return currentRole !== null && (roles as readonly string[]).includes(currentRole)
}

/** Available roles (for dropdowns, admin panels, etc.). */
export function useAvailableRoles(): readonly Role[] {
  return ROLES
}
