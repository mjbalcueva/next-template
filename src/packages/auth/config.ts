import { env } from "@/env"

export const AUTH_ENDPOINTS = {
  csrf: env.NEXT_PUBLIC_SANCTUM_CSRF_URL,
  login: "auth/login",
  register: "auth/register",
  logout: "auth/logout",
  user: "user",
  permissions: "permissions",
} as const

export const DEFAULT_AUTH_REDIRECT = "/" as const
export const LOGIN_PATH = "/auth/login" as const
