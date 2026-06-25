import { apiFetch } from "@/packages/api/http"
import {
  AUTH_ENDPOINTS,
  authSessionSchema,
  authUserSchema,
  permissionsSchema,
  type AuthSession,
  type AuthUser,
  type LoginInput,
  type RegisterInput,
} from "@/packages/auth/lib/schemas"

// ─── Browser-side auth API ─────────────────────────────────────────────
//
//  These functions are the client-side counterparts to the server-side
//  cached helpers in `packages/auth/server.ts`.  They perform the actual
//  HTTP calls (login, register, logout, fetch session) and are typically
//  called from TanStack Query mutations or the zustand store.

export async function login(input: LoginInput): Promise<AuthSession> {
  await apiFetch(AUTH_ENDPOINTS.login, {
    base: "auth",
    method: "POST",
    body: input,
  })
  return getSession()
}

export async function register(input: RegisterInput): Promise<AuthSession> {
  await apiFetch(AUTH_ENDPOINTS.register, {
    base: "auth",
    method: "POST",
    body: input,
  })
  return getSession()
}

export async function logout(): Promise<void> {
  await apiFetch(AUTH_ENDPOINTS.logout, { base: "auth", method: "POST" })
}

export async function fetchUser(): Promise<AuthUser> {
  return apiFetch(AUTH_ENDPOINTS.user, { schema: authUserSchema })
}

export async function getSession(): Promise<AuthSession> {
  const [user, permResult] = await Promise.all([
    fetchUser(),
    apiFetch(AUTH_ENDPOINTS.permissions, { schema: permissionsSchema }),
  ])
  return authSessionSchema.parse({
    user,
    permissions: permResult.permissions,
  })
}
