"use client"

import { useAuthStore } from "../store/auth.store"

/** The current user profile, or `null` if not authenticated. */
export function useUser() {
  return useAuthStore(s => s.session?.user ?? null)
}

/** `true` when a session exists (user is authenticated). */
export function useIsAuthenticated() {
  return useAuthStore(s => s.session !== null)
}

/** `true` after AuthProvider finishes its initialization check. */
export function useIsInitialized() {
  return useAuthStore(s => s.isInitialized)
}
