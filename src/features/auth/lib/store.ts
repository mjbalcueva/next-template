"use client"

/**
 * Zustand auth store — the single source of truth for auth state.
 *
 * Pattern: REST API → React Query (mutations) → Zustand
 *
 *   - `token` is persisted to localStorage via Zustand's `persist` middleware.
 *   - `user` is NOT persisted — re-fetched from /@get/mock/user on app startup.
 *   - Derived values (`isAuthenticated`, `session`) are computed via selectors,
 *     not stored redundantly.
 */
import { create } from "zustand"
import { persist } from "zustand/middleware"

import { setTokenGetter } from "@/packages/tanstack/lib/client"

import type { User } from "../api/auth.schema"

// ─── State shape ────────────────────────────────────────────────────────

export interface AuthState {
  token: string | null
  user: User | null

  setAuth: (token: string, user: User) => void
  setUser: (user: User) => void
  clearAuth: () => void
}

// ─── Store ──────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      token: null,
      user: null,

      setAuth: (token, user) => set({ token, user }),
      setUser: user => set({ user }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    {
      name: "auth-storage",
      /** Only persist the token — user is re-fetched on reload. */
      partialize: state => ({ token: state.token }),
    }
  )
)

// ─── Selectors ──────────────────────────────────────────────────────────

/** High-level selectors so consumers don't access raw state shape. */

export const selectToken = (state: AuthState) => state.token
export const selectUser = (state: AuthState) => state.user
export const selectIsAuthenticated = (state: AuthState) => state.token !== null
export const selectSession = (state: AuthState) => ({
  token: state.token,
  user: state.user,
  isAuthenticated: state.token !== null,
})

// ─── Wire up better-fetch token injection ───────────────────────────────
//
// better-fetch's onRequest hook calls this getter for every request.
// We read from the Zustand store outside of React (no hook needed).

setTokenGetter(() => {
  try {
    return useAuthStore.getState().token
  } catch {
    return null
  }
})
