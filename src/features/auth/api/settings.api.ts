import { $fetch } from "@/packages/tanstack/lib/client"

// ─── Endpoint path constants ─────────────────────────────────────────

export const SETTINGS_ENDPOINTS = {
  profile: "@patch/mock/settings/profile",
  password: "@patch/mock/settings/password",
  account: "@delete/mock/settings/account",
  health: "@get/mock/health",
}

// ─── Fetch wrappers ──────────────────────────────────────────────────

export async function updateProfile(body: { name: string }) {
  return $fetch(`/${SETTINGS_ENDPOINTS.profile}`, { body })
}

export async function changePassword(body: { currentPassword: string; newPassword: string }) {
  return $fetch(`/${SETTINGS_ENDPOINTS.password}`, { body })
}

export async function deleteAccount() {
  return $fetch(`/${SETTINGS_ENDPOINTS.account}`)
}

export async function checkHealth() {
  return $fetch(`/${SETTINGS_ENDPOINTS.health}`)
}
