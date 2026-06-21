/**
 * Auth React Query mutations — REST API → React Query → Zustand.
 *
 * Every mutation calls the API via better-fetch, then updates
 * the Zustand auth store on success.  Components only ever
 * interact with the API through these hooks.
 */

import { useMutation } from "@tanstack/react-query"

import { fetchUser, login, logout, register } from "../api/auth.api"
import type { LoginInput, RegisterInput } from "../api/auth.schema"
import { changePassword, checkHealth, deleteAccount, updateProfile } from "../api/settings.api"

import { useAuthStore } from "./store"

// ─── Cookie sync (inlined so it's guaranteed to run synchronously) ────

const AUTH_COOKIE = "auth_token"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

function setAuthCookie(token: string) {
  if (typeof document === "undefined") return
  document.cookie = `${AUTH_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`
}

// ─── Login ────────────────────────────────────────────────────────────

export function useLoginMutation() {
  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const { token } = await login(input)
      // Store token + cookie immediately so fetchUser and the proxy can read them.
      useAuthStore.setState({ token })
      setAuthCookie(token)
      try {
        const user = await fetchUser()
        useAuthStore.setState({ user })
      } catch (err) {
        // User fetch is best-effort — token is still valid.
        // eslint-disable-next-line no-console
        console.error("[auth] Failed to fetch user after login:", err)
      }
      return { token }
    },
  })
}

// ─── Register ─────────────────────────────────────────────────────────

export function useRegisterMutation() {
  return useMutation({
    mutationFn: async (input: RegisterInput) => {
      const { token } = await register(input)
      useAuthStore.setState({ token })
      setAuthCookie(token)
      try {
        const user = await fetchUser()
        useAuthStore.setState({ user })
      } catch (err) {
        // User fetch is best-effort — token is still valid.
        // eslint-disable-next-line no-console
        console.error("[auth] Failed to fetch user after register:", err)
      }
      return { token }
    },
  })
}

// ─── Logout ───────────────────────────────────────────────────────────

export function useLogoutMutation() {
  const clearAuth = useAuthStore(s => s.clearAuth)
  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      // Best-effort — clear local state regardless of server response.
      clearAuth()
    },
  })
}

// ─── Fetch current user (used on app startup) ─────────────────────────

export function useFetchUserMutation() {
  const setUser = useAuthStore(s => s.setUser)
  const clearAuth = useAuthStore(s => s.clearAuth)

  return useMutation({
    mutationFn: fetchUser,
    onSuccess: user => setUser(user),
    onError: () => {
      // Token might be expired — clear it.
      clearAuth()
    },
  })
}

// ─── Profile ──────────────────────────────────────────────────────────

export function useUpdateProfileMutation() {
  const setUser = useAuthStore(s => s.setUser)
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: user => {
      // Sync the updated name to the Zustand store so all consumers see it instantly.
      setUser(user)
    },
  })
}

// ─── Password ─────────────────────────────────────────────────────────

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: changePassword,
  })
}

// ─── Account ──────────────────────────────────────────────────────────

export function useDeleteAccountMutation() {
  return useMutation({
    mutationFn: deleteAccount,
  })
}

// ─── Health ──────────────────────────────────────────────────────────

export function useCheckHealthMutation() {
  return useMutation({
    mutationFn: checkHealth,
  })
}
