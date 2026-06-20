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

import { useAuthStore } from "./store"

// ─── Login ────────────────────────────────────────────────────────────

export function useLoginMutation() {
  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const { token } = await login(input)
      // Store token immediately so fetchUser can read it via the getter.
      useAuthStore.setState({ token })
      try {
        const user = await fetchUser()
        useAuthStore.setState({ user })
      } catch {
        // User fetch is best-effort — token is still valid.
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
      try {
        const user = await fetchUser()
        useAuthStore.setState({ user })
      } catch {
        // User fetch is best-effort — token is still valid.
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
