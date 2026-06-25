import { create } from "zustand"
import { immer } from "zustand/middleware/immer"

import { apiFetch } from "@/packages/api/http"

import {
  AUTH_ENDPOINTS,
  authSessionSchema,
  authUserSchema,
  permissionsSchema,
  type AuthSession,
  type AuthUser,
  type Permission,
} from "../lib/schemas"

// ─── Types ─────────────────────────────────────────────────────────────

type AuthState = {
  user: AuthUser | null
  permissions: Permission[]

  refreshSession: () => Promise<AuthSession | null>
  setSession: (session: AuthSession | null) => void
  setUser: (user: AuthUser) => void
  setPermissions: (permissions: readonly Permission[]) => void
  clearSession: () => void
}

// ─── Initial state ─────────────────────────────────────────────────────

function createInitialState(): AuthState {
  return {
    user: null,
    permissions: [],

    async refreshSession() {
      try {
        const [user, permResult] = await Promise.all([
          apiFetch(AUTH_ENDPOINTS.user, { schema: authUserSchema }),
          apiFetch(AUTH_ENDPOINTS.permissions, {
            schema: permissionsSchema,
          }),
        ])
        const session = authSessionSchema.parse({
          user,
          permissions: permResult.permissions,
        })
        useAuthStore.setState({
          user: session.user,
          permissions: session.permissions,
        })
        return session
      } catch {
        useAuthStore.setState({ user: null, permissions: [] })
        return null
      }
    },

    setSession(session) {
      useAuthStore.setState({
        user: session?.user ?? null,
        permissions: session?.permissions ?? [],
      })
    },

    setUser(user) {
      useAuthStore.setState({ user })
    },

    setPermissions(permissions) {
      useAuthStore.setState({ permissions: [...permissions] })
    },

    clearSession() {
      useAuthStore.setState({ user: null, permissions: [] })
    },
  }
}

// ─── Store ─────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(immer(() => createInitialState()))
