"use client"

import type { ReactNode } from "react"

import {
  hasAbacPermission,
  hasActionPermission,
  hasAnyPermission,
  hasEveryPermission,
  hasPermission,
  hasResourcePermission,
  hasRole,
} from "../lib/permissions"
import type { Permission } from "../lib/schemas"
import { useAuthStore } from "../store/auth.store"

// ─── Types ─────────────────────────────────────────────────────────────

type GateProps = {
  children: ReactNode
  fallback?: ReactNode

  /** Require the user to be authenticated. */
  auth?: boolean

  /** Require one of these roles. */
  roles?: readonly string[]

  /** Require this exact permission string (e.g. "todos:create"). */
  permission?: Permission

  /** Require any permission matching this resource prefix. */
  resource?: string

  /** Require any permission matching this action suffix. */
  action?: string

  /** Require ALL of these permissions. */
  every?: readonly Permission[]

  /** Require ANY of these permissions. */
  anyOf?: readonly Permission[]
}

// ─── Component ─────────────────────────────────────────────────────────

export function Gate({ children, fallback = null, ...props }: GateProps) {
  const user = useAuthStore(s => s.user)
  const permissions = useAuthStore(s => s.permissions)

  // Auth gate — derived: user exists = authenticated
  if (props.auth && !user) return fallback

  // Role gate
  if (props.roles && !hasRole(user, props.roles)) return fallback

  // Single permission
  if (props.permission && !hasPermission(permissions, props.permission)) return fallback

  // Resource + action (ABAC-style — checks resource:action OR resource:manage)
  if (
    props.resource &&
    props.action &&
    !hasAbacPermission(permissions, props.resource, props.action)
  )
    return fallback

  // Resource-only
  if (props.resource && !props.action && !hasResourcePermission(permissions, props.resource))
    return fallback

  // Action-only
  if (props.action && !props.resource && !hasActionPermission(permissions, props.action))
    return fallback

  // All-of
  if (props.every && !hasEveryPermission(permissions, props.every)) return fallback

  // Any-of
  if (props.anyOf && !hasAnyPermission(permissions, props.anyOf)) return fallback

  return <>{children}</>
}
