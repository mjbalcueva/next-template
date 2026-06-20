/**
 * Auth API client — wraps $fetch for login, register, logout, and session.
 */

import { $fetch } from "@/packages/tanstack/lib/client"

import type { AuthResponse, LoginInput, RegisterInput, User } from "./auth.schema"

export async function login(input: LoginInput): Promise<AuthResponse> {
  return $fetch("/@post/mock/auth/login", { body: input })
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  return $fetch("/@post/mock/auth/register", { body: input })
}

export async function logout(): Promise<void> {
  await $fetch("/@post/mock/auth/logout")
}

export async function fetchUser(): Promise<User> {
  return $fetch("/@get/mock/auth/me")
}
