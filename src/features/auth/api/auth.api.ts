import { apiFetch } from "@/packages/api/fetch"
import { AUTH_ENDPOINTS } from "@/packages/auth/config"
import {
  authSessionSchema,
  authUserSchema,
  permissionsSchema,
  type AuthSession,
  type AuthUser,
  type LoginInput,
  type RegisterInput,
} from "@/packages/auth/schemas"

export async function login(input: LoginInput): Promise<AuthSession> {
  await apiFetch(AUTH_ENDPOINTS.login, { base: "auth", method: "POST", body: input })
  return fetchSession()
}

export async function register(input: RegisterInput): Promise<AuthSession> {
  await apiFetch(AUTH_ENDPOINTS.register, { base: "auth", method: "POST", body: input })
  return fetchSession()
}

export async function logout(): Promise<void> {
  await apiFetch(AUTH_ENDPOINTS.logout, { base: "auth", method: "POST" })
}

export async function fetchUser(): Promise<AuthUser> {
  return apiFetch(AUTH_ENDPOINTS.user, { schema: authUserSchema })
}

export async function fetchSession(): Promise<AuthSession> {
  const [user, permissionResponse] = await Promise.all([
    fetchUser(),
    apiFetch(AUTH_ENDPOINTS.permissions, { schema: permissionsSchema }),
  ])

  return authSessionSchema.parse({ user, permissions: permissionResponse.permissions })
}
