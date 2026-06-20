import { z } from "zod"

// ─── Shared types ────────────────────────────────────────────────────────

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["admin", "moderator", "member", "viewer"]),
})

/** User + Sanctum token abilities (returned by GET /api/user). */
export const authUserSchema = userSchema.extend({
  abilities: z.string().array(),
})

export const tokenResponseSchema = z.object({
  token: z.string(),
})

// ─── Input schemas ───────────────────────────────────────────────────────

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
})

export const registerInputSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
  password_confirmation: z.string().min(1, "Please confirm your password"),
})

export type LoginInput = z.infer<typeof loginInputSchema>
export type RegisterInput = z.infer<typeof registerInputSchema>
export type User = z.infer<typeof userSchema>
export type AuthUser = z.infer<typeof authUserSchema>
export type TokenResponse = z.infer<typeof tokenResponseSchema>

// ─── API schema slice (merged into the central $fetch schema) ────────────

export const authApiSchema = {
  "@post/mock/auth/login": {
    input: loginInputSchema,
    output: tokenResponseSchema,
  },
  "@post/mock/auth/register": {
    input: registerInputSchema,
    output: tokenResponseSchema,
  },
  "@get/mock/user": {
    output: authUserSchema,
  },
  "@post/mock/auth/logout": {
    input: z.object({}).optional(),
    output: z.object({ success: z.literal(true) }),
  },
} as const
