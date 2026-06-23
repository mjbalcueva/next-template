/**
 * Auth actions — standalone functions that mutate the store with Immer.
 *
 * Pattern: `useStore.setState(s => { s.x = y })`
 * No `set`/`get` plumbing — import and call.
 */
import type { User } from "@/features/auth/api/auth.schema"

import { clearAuthCookie, setAuthCookie } from "./auth-cookie"
import { useAuthStore } from "./auth.store"

// ── Basic mutations ──────────────────────────────────────────────────────

export function setAuth(token: string, user: User) {
  useAuthStore.setState(s => {
    s.token = token
    s.user = user
  })
  setAuthCookie(token)
}

export function setToken(token: string | null) {
  useAuthStore.setState(s => {
    s.token = token
  })
  if (token) setAuthCookie(token)
  else clearAuthCookie()
}

export function setUser(user: User) {
  useAuthStore.setState(s => {
    s.user = user
  })
}

export function clearAuth() {
  useAuthStore.setState(s => {
    s.token = null
    s.user = null
  })
  clearAuthCookie()
}

export function setInitialized() {
  useAuthStore.setState(s => {
    s.isInitialized = true
  })
}
