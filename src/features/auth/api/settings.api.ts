import { $fetch } from "@/packages/tanstack/lib/client"

import type { User } from "./auth.schema"

// ─── Endpoint path constants ─────────────────────────────────────────

export const SETTINGS_ENDPOINTS = {
  profile: "mock/settings/profile",
  password: "mock/settings/password",
  account: "mock/settings/account",
  health: "mock/health",
}

// ─── Fetch wrappers ──────────────────────────────────────────────────

export async function updateProfile(body: { name: string }): Promise<User> {
  return $fetch(`/${SETTINGS_ENDPOINTS.profile}`, { method: "PATCH", body })
}

export async function changePassword(body: {
  currentPassword: string
  newPassword: string
}): Promise<{ ok: boolean }> {
  return $fetch(`/${SETTINGS_ENDPOINTS.password}`, { method: "PATCH", body })
}

export async function deleteAccount(): Promise<{ ok: boolean }> {
  return $fetch(`/${SETTINGS_ENDPOINTS.account}`, { method: "DELETE" })
}

export async function checkHealth() {
  return $fetch(`/${SETTINGS_ENDPOINTS.health}`)
}
