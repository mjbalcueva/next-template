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
export const SIGN_IN_PATH = "/auth/sign-in" as const
export const AUTH_SESSION_COOKIE_NAMES = ["mock_session", "laravel_session"] as const

export function hasSessionCookie(getCookie: (name: string) => { value?: string } | undefined) {
  return AUTH_SESSION_COOKIE_NAMES.some(name => Boolean(getCookie(name)?.value))
}
