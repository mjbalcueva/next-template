/**
 * Site/settings React Query mutations — REST API → React Query.
 *
 * Every settings operation goes through a proper React Query mutation.
 * No direct `$fetch` calls in components.
 */

import { useMutation } from "@tanstack/react-query"

import { $fetch } from "@/packages/tanstack/lib/client"

// ─── Profile ──────────────────────────────────────────────────────────

export function useUpdateProfileMutation() {
  return useMutation({
    mutationFn: (body: { name: string }) => $fetch("/@patch/mock/settings/profile", { body }),
  })
}

// ─── Password ─────────────────────────────────────────────────────────

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (body: { currentPassword: string; newPassword: string }) =>
      $fetch("/@patch/mock/settings/password", { body }),
  })
}

// ─── Account ──────────────────────────────────────────────────────────

export function useDeleteAccountMutation() {
  return useMutation({
    mutationFn: () => $fetch("/@delete/mock/settings/account"),
  })
}
