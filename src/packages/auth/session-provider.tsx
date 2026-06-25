"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"

import type { AuthSession, AuthUser, Permission } from "./schemas"

type SessionContextValue = {
  session: AuthSession | null
  user: AuthUser | null
  permissions: readonly Permission[]
  isAuthenticated: boolean
  setSession: (session: AuthSession | null) => void
  setUser: (user: AuthUser) => void
  setPermissions: (permissions: readonly Permission[]) => void
  clearSession: () => void
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({
  children,
  initialSession,
}: {
  children: ReactNode
  initialSession: AuthSession | null
}) {
  const [session, setSession] = useState<AuthSession | null>(initialSession)

  const value = useMemo<SessionContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      permissions: session?.permissions ?? [],
      isAuthenticated: session !== null,
      setSession,
      setUser: user => setSession(current => (current ? { ...current, user } : null)),
      setPermissions: permissions =>
        setSession(current => (current ? { ...current, permissions: [...permissions] } : null)),
      clearSession: () => setSession(null),
    }),
    [session]
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const context = useContext(SessionContext)

  if (!context) {
    throw new Error("useSession must be used within a SessionProvider")
  }

  return context
}
