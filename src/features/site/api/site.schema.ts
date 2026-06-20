import { z } from "zod"

import { userSchema } from "@/features/auth/api/auth.schema"

// ─── API schema slice (merged into the central $fetch schema) ────────────

export const siteApiSchema = {
  "@patch/mock/settings/profile": {
    input: z.object({ name: z.string().min(1) }),
    output: userSchema,
  },
  "@patch/mock/settings/password": {
    input: z.object({ currentPassword: z.string(), newPassword: z.string().min(8) }),
    output: z.object({ ok: z.literal(true) }),
  },
  "@delete/mock/settings/account": {
    input: z.object({}).optional(),
    output: z.object({ ok: z.literal(true) }),
  },
  "@get/mock/health": {
    input: z.object({}).optional(),
    output: z.object({ ok: z.literal(true) }),
  },
} as const
