/**
 * Auth actions — standalone functions that mutate the store with Immer.
 *
 * Pattern: `useStore.setState(s => { s.x = y })`
 * No `set`/`get` plumbing — import and call.
 */
import type { User } from "@/features/auth/api/auth.schema"

import { clearAuthCookie, setAuthCookie } from "../lib/auth-cookie"

import { useAuthStore, type SessionData } from "./auth.store"

// ── Session mutations ───────────────────────────────────────────────────

/**
 * Set just the token — used during login before the user profile is fetched.
 * Follow with {@link updateUser} once the profile arrives.
 */
export function setToken(token: string) {
  useAuthStore.setState(s => {
    if (s.session) {
      s.session.token = token
    } else {
      // Temporary session — user will be filled in by updateUser() or setSession().
      s.session = { token } as SessionData
    }
  })
  setAuthCookie(token)
}

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
