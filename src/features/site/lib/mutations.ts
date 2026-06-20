/**
 * Site/settings React Query mutations — REST API → React Query.
 *
 * Every settings operation goes through a proper React Query mutation.
 * No direct `$fetch` calls in components.
 */

import { useMutation } from "@tanstack/react-query"

import { $fetch } from "@/packages/tanstack/lib/client"

import { SITE_ENDPOINTS } from "../api/site.api"

// ─── Profile ──────────────────────────────────────────────────────────

export function useUpdateProfileMutation() {
  return useMutation({
    mutationFn: (body: { name: string }) => $fetch(`/${SITE_ENDPOINTS.profile}`, { body }),
  })
}

// ─── Password ─────────────────────────────────────────────────────────

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (body: { currentPassword: string; newPassword: string }) =>
      $fetch(`/${SITE_ENDPOINTS.password}`, { body }),
  })
}

// ─── Account ──────────────────────────────────────────────────────────

export function useDeleteAccountMutation() {
  return useMutation({
    mutationFn: () => $fetch(`/${SITE_ENDPOINTS.account}`),
  })
}
