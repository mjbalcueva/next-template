"use client"

import type { ReactNode } from "react"

import { useAuthStore } from "@/features/auth/store/auth.store"

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
  const isAuthenticated = useAuthStore(s => s.token !== null)
  const isInitialized = useAuthStore(s => s.isInitialized)

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
  const isAuthenticated = useAuthStore(s => s.token !== null)
  return <>{!isAuthenticated ? children : fallback}</>
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
  const user = useAuthStore(s => s.user)
  const allowed = user !== null && (roles as readonly string[]).includes(user.role)
  return <>{allowed ? children : fallback}</>
}
