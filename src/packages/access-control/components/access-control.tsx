"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

import { useIsAuthenticated, useIsInitialized, useUser } from "@/features/auth/hooks/use-session"

import { DEFAULT_AUTH_REDIRECT } from "@/proxy-routes"

// ─── Shared prop types ──────────────────────────────────────────────────

interface BlockProps {
  children: ReactNode
  fallback?: ReactNode
}

// ─── Protected ─────────────────────────────────────────────────────

/**
 * Render children only when the user is authenticated.
 *
 * Waits for `isInitialized` to avoid flashing protected content while
 * AuthProvider validates a stale token (which would then get cleared
 * and the proxy would redirect to sign-in).
 *
 * @example
 *   <Protected fallback={<SignInPrompt />}>
 *     <Dashboard />
 *   </Protected>
 */
export function Protected({ children, fallback = null }: BlockProps) {
  const isAuthenticated = useIsAuthenticated()
  const isInitialized = useIsInitialized()

  // Don't render anything until the initial auth check has completed.
  if (!isInitialized) return null

  return <>{isAuthenticated ? children : fallback}</>
}

// ─── PublicOnly ────────────────────────────────────────────────────────

/**
 * Render children only when NO user is authenticated.
 * Useful for landing pages, marketing content, or sign-in prompts.
 *
 * @example
 *   <PublicOnly fallback={<Dashboard />}>
 *     <LandingPage />
 *   </PublicOnly>
 */
export function PublicOnly({ children, fallback = null }: BlockProps) {
  const isAuthenticated = useIsAuthenticated()
  return <>{!isAuthenticated ? children : fallback}</>
}

// ─── RedirectIfAuthenticated ────────────────────────────────────────────

type RedirectIfAuthenticatedProps = {
  children: ReactNode
  /** Where to redirect authenticated users. Defaults to `"/"`. */
  to?: string
}

/**
 * Client-side redirect for auth pages (sign-in, sign-up, etc.).
 *
 * The proxy only runs on server requests — hitting the back button serves
 * the cached page without a server round-trip, so we must also guard on
 * the client.
 *
 * A single effect with no dependency array runs after every render,
 * catching both fresh mounts AND bfcache restores where deps haven't
 * changed.
 */
export function RedirectIfAuthenticated({
  children,
  to = DEFAULT_AUTH_REDIRECT,
}: RedirectIfAuthenticatedProps) {
  const isAuthenticated = useIsAuthenticated()
  const isInitialized = useIsInitialized()
  const router = useRouter()

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.replace(to)
    }
  })

  if (!isInitialized) return null

  // If already authenticated, render nothing (the effect above will redirect).
  if (isAuthenticated) return null

  return <>{children}</>
}

// ─── RoleGate ──────────────────────────────────────────────────────────

type RoleGateProps = BlockProps & {
  /** The role(s) required to see the content. Matches if user has ANY of these. */
  roles: readonly string[]
}

/**
 * Render children only when the current user has one of the specified roles.
 *
 * @example
 *   <RoleGate roles={["admin", "moderator"]} fallback={<AccessDenied />}>
 *     <AdminPanel />
 *   </RoleGate>
 */
export function RoleGate({ roles, children, fallback = null }: RoleGateProps) {
  const user = useUser()
  const allowed = user !== null && (roles as readonly string[]).includes(user.role)
  return <>{allowed ? children : fallback}</>
}
