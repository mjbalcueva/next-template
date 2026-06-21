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

// ─── Cookie helpers (synced with the proxy's `auth_token` check) ──────
//
// The proxy (`src/proxy.ts`) checks for a cookie named `auth_token`.
// Since the token lives in Zustand/localStorage, we sync it to a cookie
// so the proxy can read it on server-side navigations.

const AUTH_COOKIE = "auth_token"
const COOKIE_PATH = "/"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

function setAuthCookie(token: string) {
  if (typeof document === "undefined") return
  document.cookie = `${AUTH_COOKIE}=${encodeURIComponent(token)}; path=${COOKIE_PATH}; max-age=${COOKIE_MAX_AGE}; samesite=lax`
}

function clearAuthCookie() {
  if (typeof document === "undefined") return
  document.cookie = `${AUTH_COOKIE}=; path=${COOKIE_PATH}; max-age=0`
}

// ─── State shape ────────────────────────────────────────────────────────

export interface AuthState {
  token: string | null
  user: User | null
  /** True once the initial auth check (AuthProvider) has completed. */
  isInitialized: boolean

  setAuth: (token: string, user: User) => void
  setUser: (user: User) => void
  clearAuth: () => void
  setInitialized: () => void
}

// ─── Store ──────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      token: null,
      user: null,
      isInitialized: false,

      setAuth: (token, user) => {
        setAuthCookie(token)
        set({ token, user })
      },
      setUser: user => set({ user }),
      clearAuth: () => {
        clearAuthCookie()
        set({ token: null, user: null })
      },
      setInitialized: () => set({ isInitialized: true }),
    }),
    {
      name: "auth-storage",
      /** Only persist the token — user is re-fetched on reload. */
      partialize: state => ({ token: state.token }),
      /** On rehydrate, sync the restored token to a cookie. */
      onRehydrateStorage: () => state => {
        if (state?.token) {
          setAuthCookie(state.token)
        } else {
          clearAuthCookie()
        }
      },
    }
  )
)

// ─── Selectors ──────────────────────────────────────────────────────────

/** High-level selectors so consumers don't access raw state shape. */

export const selectToken = (state: AuthState) => state.token
export const selectUser = (state: AuthState) => state.user
export const selectIsAuthenticated = (state: AuthState) => state.token !== null
export const selectIsInitialized = (state: AuthState) => state.isInitialized
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

// ─── Sync token to cookie on every store change ─────────────────────────
//
// Mutations use `useAuthStore.setState({ token })` which bypasses the
// `setAuth` action, so we subscribe to all token changes here instead.

useAuthStore.subscribe((state, prevState) => {
  if (state.token !== prevState.token) {
    if (state.token) {
      setAuthCookie(state.token)
    } else {
      clearAuthCookie()
    }
  }
})
