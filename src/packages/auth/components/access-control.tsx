"use client"

import type { ReactNode } from "react"

import { DEFAULT_AUTH_REDIRECT } from "../config"
import { hasRole } from "../permissions"
import { useSession } from "../session-provider"

interface BlockProps {
  children: ReactNode
  fallback?: ReactNode
}

export function Protected({ children, fallback = null }: BlockProps) {
  const { isAuthenticated } = useSession()
  return <>{isAuthenticated ? children : fallback}</>
}

export function PublicOnly({ children, fallback = null }: BlockProps) {
  const { isAuthenticated } = useSession()
  return <>{!isAuthenticated ? children : fallback}</>
}

export function RedirectIfAuthenticated({ children }: BlockProps & { to?: string }) {
  return <PublicOnly>{children}</PublicOnly>
}

export function RoleGate({
  roles,
  children,
  fallback = null,
}: BlockProps & {
  roles: readonly string[]
}) {
  const { user } = useSession()
  return <>{hasRole(user, roles) ? children : fallback}</>
}

export { DEFAULT_AUTH_REDIRECT }
