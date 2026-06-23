/**
 * Auth actions — standalone functions that mutate the store with Immer.
 *
 * Pattern: `useStore.setState(s => { s.x = y })`
 * No `set`/`get` plumbing — import and call.
 */
import type { User } from "@/features/auth/api/auth.schema"

import { clearAuthCookie, setAuthCookie } from "../lib/auth-cookie"

import { useAuthStore } from "./auth.store"

// ── Session mutations ───────────────────────────────────────────────────

export function setSession(token: string, user: User) {
  useAuthStore.setState(s => {
    s.session = { token, user }
  })
  setAuthCookie(token)
}

export function updateUser(user: User) {
  useAuthStore.setState(s => {
    if (s.session) s.session.user = user
  })
}

export function setInitialized() {
  useAuthStore.setState(s => {
    s.isInitialized = true
  })
}

export function clearSession() {
  useAuthStore.setState(s => {
    s.session = null
  })
  clearAuthCookie()
}
