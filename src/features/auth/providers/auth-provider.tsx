"use client"

import { useEffect } from "react"

import { useShallow } from "zustand/react/shallow"

import { useFetchUserMutation } from "@/features/auth/lib/mutations"
import { setInitialized } from "@/features/auth/store/auth.actions"
import { useAuthStore } from "@/features/auth/store/auth.store"

/**
 * Handles auth initialization — fetches the current user profile
 * on mount if a token exists but the user hasn't been loaded yet.
 *
 * Does NOT gate content.  Use `<Protected>`, `<Can>`, etc.
 * directly in layouts and pages where needed.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore(
    useShallow(s => ({
      user: s.session?.user ?? null,
      isAuthenticated: s.session !== null,
    }))
  )
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
  }, [isAuthenticated, user, fetchUser])

  return <>{children}</>
}
