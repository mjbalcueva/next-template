"use client"

/**
 * Zustand auth store — state + store + middleware.
 *
 * Uses a single `session` object — no intermediate "has token but no user" state.
 *
 * Middleware stack: persist → immer
 * Actions live in `auth.actions.ts` (standalone functions).
 */
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

import type { User } from "@/features/auth/api/auth.schema"

import { setClientTokenGetter } from "@/packages/tanstack/lib/auth-token"

import { clearAuthCookie, setAuthCookie } from "../lib/auth-cookie"

// ─── Session data ───────────────────────────────────────────────────────

export interface SessionData {
  token: string
  user: User
}

// ─── State shape ────────────────────────────────────────────────────────

export interface AuthState {
  session: SessionData | null
  /** `true` once AuthProvider has completed the initial auth check. */
  isInitialized: boolean
}

// ─── Initial state ──────────────────────────────────────────────────────

function createInitialState(): AuthState {
  return {
    session: null,
    isInitialized: false,
  }
}

// ─── Store ──────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  immer(
    persist(() => createInitialState(), {
      name: "auth-storage",
      /** Only persist the token — user is re-fetched on reload. */
      partialize: state => {
        // Persist only the token — user is re-fetched on reload.
        if (!state.session) return { session: null }
        return { session: { token: state.session.token } } as AuthState
      },
      /** On rehydrate, sync the restored token to a cookie. */
      onRehydrateStorage: () => state => {
        if (state?.session?.token) setAuthCookie(state.session.token)
        else clearAuthCookie()
      },
    })
  )
)

// ─── Wire up the fetch client's token getter ─────────────────────────────

setClientTokenGetter(() => {
  try {
    return useAuthStore.getState().session?.token ?? null
  } catch {
    return null
  }
})
