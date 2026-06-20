import { $fetch } from "@/packages/tanstack/lib/client"

import {
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
}

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
