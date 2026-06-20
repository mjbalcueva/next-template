import { z } from "zod"

import { userSchema } from "@/features/auth/api/auth.schema"

import { changePasswordSchema, deleteAccountSchema, updateProfileSchema } from "./site.schema"

// ─── Endpoint path constants ─────────────────────────────────────────

export const SITE_ENDPOINTS = {
  profile: "@patch/mock/settings/profile",
  password: "@patch/mock/settings/password",
  account: "@delete/mock/settings/account",
  health: "@get/mock/health",
} as const

// ─── API schema slice (merged into packages/tanstack/lib/api-schema.ts) ──

export const siteApiSchema = {
  [SITE_ENDPOINTS.profile]: {
    input: updateProfileSchema,
    output: userSchema,
  },
  [SITE_ENDPOINTS.password]: {
    input: changePasswordSchema,
    output: z.object({ ok: z.literal(true) }),
  },
  [SITE_ENDPOINTS.account]: {
    input: deleteAccountSchema.optional(),
    output: z.object({ ok: z.literal(true) }),
  },
  [SITE_ENDPOINTS.health]: {
    input: z.object({}).optional(),
    output: z.object({ ok: z.literal(true) }),
  },
} as const
