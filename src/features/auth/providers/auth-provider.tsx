"use client"

import { useEffect } from "react"

import { useFetchUser } from "@/features/auth/hooks/use-fetch-user"
import { useIsAuthenticated, useUser } from "@/features/auth/hooks/use-session"
import { setInitialized } from "@/features/auth/store/auth.actions"

/**
 * Handles auth initialization — fetches the current user profile
 * on mount if a token exists but the user hasn't been loaded yet.
 *
 * Does NOT gate content.  Use `<Protected>`, `<Can>`, etc.
 * directly in layouts and pages where needed.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useIsAuthenticated()
  const user = useUser()
  const { mutate: fetchUser } = useFetchUser()

  useEffect(() => {
    if (isAuthenticated && !user) {
      fetchUser(undefined, {
        onSettled: () => setInitialized(),
      })
    } else {
      setInitialized()
    }
  }, [isAuthenticated, user, fetchUser])

  return <>{children}</>
}
