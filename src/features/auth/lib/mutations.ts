/**
 * Auth React Query mutations — REST API → React Query → Zustand.
 *
 * Every mutation calls the API via better-fetch, then updates
 * the Zustand auth store on success.  Components only ever
 * interact with the API through these hooks.
 *
 * Cookie sync is handled internally by the store's actions
 * (`auth.actions.ts`) — no manual cookie manipulation here.
 */

import { useMutation } from "@tanstack/react-query"

import { clearSession, setSession, updateUser } from "@/features/auth/store/auth.actions"

import { fetchUser, login, logout, register } from "../api/auth.api"
import type { LoginInput, RegisterInput } from "../api/auth.schema"
import { changePassword, checkHealth, deleteAccount, updateProfile } from "../api/settings.api"

// ─── Login ────────────────────────────────────────────────────────────

export function useLoginMutation() {
  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const { token } = await login(input)
      try {
        const user = await fetchUser()
        setSession(token, user)
      } catch (err) {
        // Token is valid but user fetch failed — still store the session.
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
      try {
        const user = await fetchUser()
        setSession(token, user)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("[auth] Failed to fetch user after register:", err)
      }
      return { token }
    },
  })
}

// ─── Logout ───────────────────────────────────────────────────────────

export function useLogoutMutation() {
  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      // Best-effort — clear local state regardless of server response.
      clearSession()
    },
  })
}

// ─── Fetch current user (used on app startup) ─────────────────────────

export function useFetchUserMutation() {
  return useMutation({
    mutationFn: fetchUser,
    onSuccess: user => updateUser(user),
    onError: () => {
      // Token might be expired — clear it.
      clearSession()
    },
  })
}

// ─── Profile ──────────────────────────────────────────────────────────

export function useUpdateProfileMutation() {
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: user => {
      // Sync the updated name to the Zustand store so all consumers see it instantly.
      updateUser(user)
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
