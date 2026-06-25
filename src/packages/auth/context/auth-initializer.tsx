"use client"

import { useEffect, type ReactNode } from "react"

import { useAuthStore } from "../store/auth.store"

/**
 * Mounts once in the root layout and triggers the initial session fetch.
 * With the module-level zustand store, no React Context wrapper is needed —
 * every `useAuthStore()` call reads from the same singleton.
 */
export function AuthInitializer({ children }: { children: ReactNode }) {
  const refreshSession = useAuthStore(s => s.refreshSession)

  useEffect(() => {
    void refreshSession()
  }, [refreshSession])

  return <>{children}</>
}
