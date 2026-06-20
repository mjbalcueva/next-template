import { z } from "zod"

import { $fetch } from "@/packages/tanstack/lib/client-core"

import {
  authUserSchema,
  loginInputSchema,
  registerInputSchema,
  tokenResponseSchema,
  type AuthUser,
  type LoginInput,
  type RegisterInput,
  type TokenResponse,
} from "./auth.schema"

// ─── Endpoint path constants ─────────────────────────────────────────

export const AUTH_ENDPOINTS = {
  login: "@post/mock/auth/login",
  register: "@post/mock/auth/register",
  me: "@get/mock/user",
  logout: "@post/mock/auth/logout",
} as const

// ─── API schema slice (merged into packages/tanstack/lib/api-schema.ts) ──

export const authApiSchema = {
  [AUTH_ENDPOINTS.login]: {
    input: loginInputSchema,
    output: tokenResponseSchema,
  },
  [AUTH_ENDPOINTS.register]: {
    input: registerInputSchema,
    output: tokenResponseSchema,
  },
  [AUTH_ENDPOINTS.me]: {
    output: authUserSchema,
  },
  [AUTH_ENDPOINTS.logout]: {
    input: z.object({}).optional(),
    output: z.object({ success: z.literal(true) }),
  },
} as const

// ─── Fetch wrappers ──────────────────────────────────────────────────

export async function login(input: LoginInput): Promise<TokenResponse> {
  return $fetch(`/${AUTH_ENDPOINTS.login}`, { body: input })
}

export async function register(input: RegisterInput): Promise<TokenResponse> {
  return $fetch(`/${AUTH_ENDPOINTS.register}`, { body: input })
}

export async function logout(): Promise<void> {
  await $fetch(`/${AUTH_ENDPOINTS.logout}`)
}

/** Fetch the authenticated user (Sanctum's GET /api/user). */
export async function fetchUser(): Promise<AuthUser> {
  return $fetch(`/${AUTH_ENDPOINTS.me}`)
}
