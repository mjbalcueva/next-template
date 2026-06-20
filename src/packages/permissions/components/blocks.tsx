"use client"

import type { ReactNode } from "react"
import { useAtomValue } from "jotai"

import { isAuthenticatedAtom, userAtom } from "@/features/auth/atoms"

import type { Role } from "../lib/constants"

// ─── Shared prop types ──────────────────────────────────────────────────

interface BlockProps {
  children: ReactNode
  fallback?: ReactNode
}

// ─── Authenticated ─────────────────────────────────────────────────────

/**
 * Render children only when the user is authenticated.
 *
 * @example
 *   <Authenticated fallback={<SignInPrompt />}>
 *     <Dashboard />
 *   </Authenticated>
 */
export function Authenticated({ children, fallback = null }: BlockProps) {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)
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
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)
  return <>{!isAuthenticated ? children : fallback}</>
}

// ─── RoleGate ──────────────────────────────────────────────────────────

type RoleGateProps = BlockProps & {
  /** The role(s) required to see the content. Matches if user has ANY of these. */
  roles: readonly Role[]
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
  const user = useAtomValue(userAtom)
  const allowed = user !== null && (roles as readonly string[]).includes(user.role)
  return <>{allowed ? children : fallback}</>
}
