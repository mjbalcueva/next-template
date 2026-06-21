"use client"

import { useEffect } from "react"

import { useFetchUserMutation } from "@/features/auth/lib/mutations"
import { selectIsAuthenticated, selectUser, useAuthStore } from "@/features/auth/lib/store"

/**
 * Handles auth initialization — fetches the current user profile
 * on mount if a token exists but the user hasn't been loaded yet.
 *
 * Does NOT gate content.  Use `<Protected>`, `<Can>`, etc.
 * directly in layouts and pages where needed.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const user = useAuthStore(selectUser)
  const setInitialized = useAuthStore(s => s.setInitialized)
  // `mutate` from useMutation is stable across renders — safe in deps.
  const { mutate: fetchUser } = useFetchUserMutation()

  useEffect(() => {
    if (isAuthenticated && !user) {
      fetchUser(undefined, {
        onSettled: () => setInitialized(),
      })
    } else {
      setInitialized()
    }
  }, [isAuthenticated, user, fetchUser, setInitialized])

  return <>{children}</>
}
