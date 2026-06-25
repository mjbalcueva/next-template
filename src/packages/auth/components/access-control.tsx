"use client"

import { useEffect, type ReactNode } from "react"
import type { Route } from "next"
import { usePathname, useRouter } from "next/navigation"

import { DEFAULT_AUTH_REDIRECT, LOGIN_PATH } from "../config"
import { hasRole } from "../permissions"
import { useSession } from "../session-provider"

interface BlockProps {
  children: ReactNode
  fallback?: ReactNode
}

export function Protected({ children, fallback = null }: BlockProps) {
  const { isAuthenticated, isLoading } = useSession()
  return <>{!isLoading && isAuthenticated ? children : fallback}</>
}

export function PublicOnly({ children, fallback = null }: BlockProps) {
  const { isAuthenticated, isLoading } = useSession()
  return <>{!isLoading && !isAuthenticated ? children : fallback}</>
}

export function AuthGate({
  children,
  fallback = null,
  redirectTo = LOGIN_PATH,
}: BlockProps & { redirectTo?: string }) {
  const { isAuthenticated, isLoading } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (isLoading || isAuthenticated) {
      return
    }

    const url = new URL(redirectTo, window.location.origin)
    url.searchParams.set("redirect", pathname)
    router.replace(`${url.pathname}${url.search}` as Route)
  }, [isAuthenticated, isLoading, pathname, redirectTo, router])

  return <>{!isLoading && isAuthenticated ? children : fallback}</>
}

export function RedirectIfAuthenticated({
  children,
  fallback = null,
  to = DEFAULT_AUTH_REDIRECT,
}: BlockProps & { to?: string }) {
  const { isAuthenticated, isLoading } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(to as Route)
    }
  }, [isAuthenticated, isLoading, router, to])

  return <>{!isLoading && !isAuthenticated ? children : fallback}</>
}

export function RoleGate({
  roles,
  children,
  fallback = null,
}: BlockProps & {
  roles: readonly string[]
}) {
  const { isLoading, user } = useSession()
  return <>{!isLoading && hasRole(user, roles) ? children : fallback}</>
}
