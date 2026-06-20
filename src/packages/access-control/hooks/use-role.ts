"use client"

import { selectUser, useAuthStore } from "@/features/auth/lib/store"

import type { Role } from "../lib/constants"

/** Get the current user's role. */
export function useRole(): Role | null {
  const user = useAuthStore(selectUser)
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

/** Available roles (for dropdowns, admin panels, etc.) — sourced from the backend. */
export { useAvailableRoles } from "../lib/store"
