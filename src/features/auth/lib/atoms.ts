/**
 * Jotai auth atoms — framework-agnostic auth state management.
 *
 * These atoms work with ANY backend that returns { token, user }
 * from login/register.  The token is persisted to localStorage
 * and automatically injected into API requests via better-fetch hooks.
 */

// ─── Wire up the token getter for better-fetch ────────────────────────
//
// better-fetch needs a way to get the current auth token for every request.
// We register a getter that reads from the Jotai atom store.

import { atom, getDefaultStore } from "jotai"
import { atomWithStorage } from "jotai/utils"

import { setTokenGetter } from "@/packages/tanstack/lib/client"

import { fetchUser, login, logout, register } from "../api/auth.client"
import type { LoginInput, RegisterInput, User } from "../api/auth.schema"

// ─── Primitive atoms ──────────────────────────────────────────────────

/** Persisted auth token (survives page reloads). */
export const authTokenAtom = atomWithStorage<string | null>("auth_token", null)

/** Current user info (not persisted — re-fetched from /api/user on reload). */
export const userAtom = atom<User | null>(null)

// ─── Derived atoms ────────────────────────────────────────────────────

/** Is the user currently authenticated? */
export const isAuthenticatedAtom = atom(get => get(authTokenAtom) !== null)

/** Full session snapshot (useful for debug pages). */
export const sessionAtom = atom(get => ({
  token: get(authTokenAtom),
  user: get(userAtom),
  isAuthenticated: get(isAuthenticatedAtom),
}))

// ─── Actions (write atoms) ────────────────────────────────────────────

/**
 * Log in with email + password.
 *
 * Sanctum-style: stores the token, then fetches the user from /api/user.
 */
export const loginAction = atom(null, async (_get, set, input: LoginInput) => {
  const data = await login(input)
  set(authTokenAtom, data.token)
  try {
    const user = await fetchUser()
    set(userAtom, user)
  } catch {
    // User fetch failed — token might still be valid, try on next page load
  }
})

/**
 * Register a new account.
 *
 * Sanctum-style: stores the token, then fetches the user from /api/user.
 */
export const registerAction = atom(null, async (_get, set, input: RegisterInput) => {
  const data = await register(input)
  set(authTokenAtom, data.token)
  try {
    const user = await fetchUser()
    set(userAtom, user)
  } catch {
    // User fetch failed — token might still be valid, try on next page load
  }
})

/** Log out — clears server-side token, then local state. */
export const logoutAction = atom(null, async (_get, set) => {
  try {
    await logout()
  } catch {
    // Best-effort — clear local state regardless
  }
  set(authTokenAtom, null)
  set(userAtom, null)
})

/** Fetch the current user from /api/user (used on app startup). */
export const fetchUserAction = atom(null, async (get, set) => {
  const token = get(authTokenAtom)
  if (!token) return

  try {
    const data = await fetchUser()
    set(userAtom, data)
  } catch {
    // Token might be expired — clear it
    set(authTokenAtom, null)
    set(userAtom, null)
  }
})

setTokenGetter(() => {
  try {
    return getDefaultStore().get(authTokenAtom)
  } catch {
    return null
  }
})
