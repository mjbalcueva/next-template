import { z } from "zod"

import { apiFetch } from "@/packages/api/http"
import { userSchema, type User } from "@/packages/auth/lib/schemas"

// ─── Endpoint path constants ─────────────────────────────────────────

export const SETTINGS_ENDPOINTS = {
  profile: "settings/profile",
  password: "settings/password",
  account: "settings/account",
  health: "health",
}

// ─── Fetch wrappers ──────────────────────────────────────────────────

export async function updateProfile(body: { name: string }): Promise<User> {
  return apiFetch(SETTINGS_ENDPOINTS.profile, { method: "PATCH", body, schema: userSchema })
}

export async function changePassword(body: {
  currentPassword: string
  newPassword: string
}): Promise<{ ok: boolean }> {
  return apiFetch(SETTINGS_ENDPOINTS.password, {
    method: "PATCH",
    body,
    schema: z.object({ ok: z.boolean() }),
  })
}

export async function deleteAccount(): Promise<{ ok: boolean }> {
  return apiFetch(SETTINGS_ENDPOINTS.account, {
    method: "DELETE",
    schema: z.object({ ok: z.boolean() }),
  })
}

export async function checkHealth() {
  return apiFetch(SETTINGS_ENDPOINTS.health)
}
