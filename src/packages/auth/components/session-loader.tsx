"use client"

import { useEffect, type ReactNode } from "react"

import { refreshSession } from "../store/auth.actions"

/**
 * Fetches the current session on mount and hydrates the zustand store.
 * Mount once in the root layout — every `useAuthStore()` call reads
 * from the same module-level singleton, no React Context needed.
 */
export function SessionLoader({ children }: { children: ReactNode }) {
  useEffect(() => {
    void refreshSession()
  }, [])

  return <>{children}</>
}
