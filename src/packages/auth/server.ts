import { cache } from "react"
import { redirect } from "next/navigation"

import { ApiError } from "@/packages/api/errors"
import { apiFetch } from "@/packages/api/fetch"

import { AUTH_ENDPOINTS, LOGIN_PATH } from "./config"
import {
  authSessionSchema,
  authUserSchema,
  permissionsSchema,
  type AuthSession,
  type Permission,
} from "./schemas"

export const getCurrentUser = cache(async () => {
  try {
    return await apiFetch(AUTH_ENDPOINTS.user, {
      schema: authUserSchema,
    })
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 419)) {
      return null
    }

    throw error
  }
})

export const getCurrentPermissions = cache(async (): Promise<readonly Permission[]> => {
  try {
    const result = await apiFetch(AUTH_ENDPOINTS.permissions, {
      schema: permissionsSchema,
    })
    return result.permissions
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 419)) {
      return []
    }

    throw error
  }
})

export const getCurrentSession = cache(async (): Promise<AuthSession | null> => {
  const [user, permissions] = await Promise.all([getCurrentUser(), getCurrentPermissions()])

  if (!user) {
    return null
  }

  return authSessionSchema.parse({ user, permissions })
})

export async function requireUser(redirectTo = LOGIN_PATH, type?: "push" | "replace") {
  const user = await getCurrentUser()

  if (!user) {
    redirect(redirectTo, type)
  }

  return user
}

export async function can(permission: Permission) {
  const permissions = await getCurrentPermissions()
  return permissions.includes(permission)
}

export async function requirePermission(permission: Permission, redirectTo = LOGIN_PATH) {
  if (!(await can(permission))) {
    redirect(redirectTo)
  }
}
