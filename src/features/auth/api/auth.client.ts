/**
 * Auth API client — wraps $fetch for login, register, logout, and session.
 *
 * Follows Laravel Sanctum conventions:
 *   - login/register return { token } only
 *   - User is fetched from /api/user
 */

import { $fetch } from "@/packages/tanstack/lib/client"

import type { AuthUser, LoginInput, RegisterInput, TokenResponse } from "./auth.schema"

export async function login(input: LoginInput): Promise<TokenResponse> {
  return $fetch("/@post/mock/auth/login", { body: input })
}

export async function register(input: RegisterInput): Promise<TokenResponse> {
  return $fetch("/@post/mock/auth/register", { body: input })
}

export async function logout(): Promise<void> {
  await $fetch("/@post/mock/auth/logout")
}

/** Fetch the authenticated user (Sanctum's GET /api/user). */
export async function fetchUser(): Promise<AuthUser> {
  return $fetch("/@get/mock/user")
}
