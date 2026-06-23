"use client"

/**
 * Zustand auth store — state + store + middleware.
 *
 * Middleware stack: persist → immer
 * Actions live in `auth.actions.ts` (standalone functions).
 */
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

import type { User } from "@/features/auth/api/auth.schema"

import { setClientTokenGetter } from "@/packages/tanstack/lib/auth-token"

import { clearAuthCookie, setAuthCookie } from "./auth-cookie"

// ─── State shape ────────────────────────────────────────────────────────

export interface AuthState {
  token: string | null
  user: User | null
  /** `true` once AuthProvider has completed the initial auth check. */
  isInitialized: boolean
}

// ─── Initial state ──────────────────────────────────────────────────────

function createInitialState(): AuthState {
  return {
    token: null,
    user: null,
    isInitialized: false,
  }
}

// ─── Store ──────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  immer(
    persist(() => createInitialState(), {
      name: "auth-storage",
      /** Only persist the token — user is re-fetched on reload. */
      partialize: state => ({ token: state.token }),
      /** On rehydrate, sync the restored token to a cookie. */
      onRehydrateStorage: () => state => {
        if (state?.token) setAuthCookie(state.token)
        else clearAuthCookie()
      },
    })
  )
)

// ─── Wire up the fetch client's token getter ─────────────────────────────

setClientTokenGetter(() => {
  try {
    return useAuthStore.getState().token
  } catch {
    return null
  }
})
