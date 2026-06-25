"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import { ApiError } from "@/packages/api/errors"
import { apiFetch } from "@/packages/api/fetch"

import { AUTH_ENDPOINTS } from "./config"
import {
  authSessionSchema,
  authUserSchema,
  permissionsSchema,
  type AuthSession,
  type AuthUser,
  type Permission,
} from "./schemas"

type SessionContextValue = {
  session: AuthSession | null
  user: AuthUser | null
  permissions: readonly Permission[]
  isAuthenticated: boolean
  isLoading: boolean
  refreshSession: () => Promise<AuthSession | null>
  setSession: (session: AuthSession | null) => void
  setUser: (user: AuthUser) => void
  setPermissions: (permissions: readonly Permission[]) => void
  clearSession: () => void
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined)

async function fetchBrowserSession() {
  try {
    const [user, permissionResponse] = await Promise.all([
      apiFetch(AUTH_ENDPOINTS.user, { schema: authUserSchema }),
      apiFetch(AUTH_ENDPOINTS.permissions, { schema: permissionsSchema }),
    ])

    return authSessionSchema.parse({ user, permissions: permissionResponse.permissions })
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 419)) return null

    throw error
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshSession = useCallback(async () => {
    setIsLoading(true)

    try {
      const nextSession = await fetchBrowserSession()
      setSession(nextSession)
      return nextSession
    } catch {
      setSession(null)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let isActive = true

    void fetchBrowserSession()
      .then(nextSession => {
        if (isActive) {
          setSession(nextSession)
        }
      })
      .catch(() => {
        if (isActive) {
          setSession(null)
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false)
        }
      })

    return () => {
      isActive = false
    }
  }, [])

  const value = useMemo<SessionContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      permissions: session?.permissions ?? [],
      isAuthenticated: session !== null,
      isLoading,
      refreshSession,
      setSession,
      setUser: user => setSession(current => (current ? { ...current, user } : current)),
      setPermissions: permissions =>
        setSession(current => (current ? { ...current, permissions: [...permissions] } : current)),
      clearSession: () => setSession(null),
    }),
    [isLoading, refreshSession, session]
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const context = useContext(SessionContext)

  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider")
  }

  return context
}

export const useAuth = useSession
