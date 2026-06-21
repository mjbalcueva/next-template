import { $fetch } from "@/packages/tanstack/lib/client"

import {
  type AuthUser,
  type LoginInput,
  type RegisterInput,
  type TokenResponse,
} from "./auth.schema"

// ─── Endpoint path constants ─────────────────────────────────────────

export const AUTH_ENDPOINTS = {
  login: "mock/auth/login",
  register: "mock/auth/register",
  me: "mock/user",
  logout: "mock/auth/logout",
}

// ─── Fetch wrappers ──────────────────────────────────────────────────

export async function login(input: LoginInput): Promise<TokenResponse> {
  return $fetch(`/${AUTH_ENDPOINTS.login}`, { method: "POST", body: input })
}

export async function register(input: RegisterInput): Promise<TokenResponse> {
  return $fetch(`/${AUTH_ENDPOINTS.register}`, { method: "POST", body: input })
}

export async function logout(): Promise<void> {
  await $fetch(`/${AUTH_ENDPOINTS.logout}`, { method: "POST" })
}

/** Fetch the authenticated user (Sanctum's GET /api/user). */
export async function fetchUser(): Promise<AuthUser> {
  return $fetch(`/${AUTH_ENDPOINTS.me}`)
}
