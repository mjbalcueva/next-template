"use client"

import type { ReactNode } from "react"

import { useResolvedPermissions } from "../lib/hooks"

// ─── ABAC request shape ─────────────────────────────────────────────

interface AbacRequest {
  resource: string
  action: string
}

// ─── Props ───────────────────────────────────────────────────────────

type BaseProps = {
  children: ReactNode
  fallback?: ReactNode
}

type Permission = string

/** Single `"resource:action"` string. */
type StringPermissionProps = BaseProps & {
  permission: Permission
  resource?: never
  action?: never
  abac?: never
  permissions?: never
  anyOf?: never
}

/** Split `resource` + `action` (equivalent to `"resource:action"`). */
type ResourceActionProps = BaseProps & {
  permission?: never
  resource: string
  action: string
  abac?: never
  permissions?: never
  anyOf?: never
}

/** Has ANY permission on a resource (e.g. `resource="todos"` matches `"todos:*"`). */
type ResourceOnlyProps = BaseProps & {
  permission?: never
  resource: string
  action?: never
  abac?: never
  permissions?: never
  anyOf?: never
}

/** Has a specific action on ANY resource (e.g. `action="delete"` matches `"*:delete"`). */
type ActionOnlyProps = BaseProps & {
  permission?: never
  resource?: never
  action: string
  abac?: never
  permissions?: never
  anyOf?: never
}

/** ABAC check (exact match or `"resource:manage"` wildcard). */
type AbacProps = BaseProps & {
  permission?: never
  resource?: never
  action?: never
  abac: AbacRequest
  permissions?: never
  anyOf?: never
}

/** ALL permissions required (AND). */
type AllOfProps = BaseProps & {
  permission?: never
  resource?: never
  action?: never
  abac?: never
  permissions: readonly Permission[]
  anyOf?: never
}

/** ANY permission (OR). */
type AnyOfProps = BaseProps & {
  permission?: never
  resource?: never
  action?: never
  abac?: never
  permissions?: never
  anyOf: readonly Permission[]
}

export type CanComponentProps =
  | StringPermissionProps
  | ResourceActionProps
  | ResourceOnlyProps
  | ActionOnlyProps
  | AbacProps
  | AllOfProps
  | AnyOfProps

// ─── Component ───────────────────────────────────────────────────────

/**
 * Declarative permission guard (JSX-based).
 *
 * Only calls ONE hook (`useResolvedPermissions`), then evaluates
 * all logic in pure JavaScript.  500 instances = 1 network request
 * thanks to React Query deduplication.
 *
 * @example String form
 *   <Can permission="todos:delete" fallback={<LockIcon />}>
 *     <DeleteButton />
 *   </Can>
 *
 * @example Split resource + action
 *   <Can resource="todos" action="delete">
 *     <DeleteButton />
 *   </Can>
 *
 * @example Any action on a resource
 *   <Can resource="todos">
 *     <TodoPanel />
 *   </Can>
 *
 * @example Specific action on any resource
 *   <Can action="delete">
 *     <DeleteAnything />
 *   </Can>
 *
 * @example ABAC check
 *   <Can abac={{ resource: "documents", action: "update" }}>
 *     <EditButton />
 *   </Can>
 *
 * @example All required (AND)
 *   <Can permissions={["todos:update", "todos:delete"]}>
 *     <AdminPanel />
 *   </Can>
 *
 * @example Any match (OR)
 *   <Can anyOf={["settings:write", "admin:access"]}>
 *     <SettingsLink />
 *   </Can>
 */
export function Can(props: CanComponentProps) {
  const { children, fallback = null } = props

  const perms = useResolvedPermissions()

  // Pure JS evaluation — zero extra hook overhead
  let allowed = false

  if ("permission" in props && props.permission) {
    allowed = perms.includes(props.permission)
  } else if ("resource" in props && "action" in props && props.resource && props.action) {
    allowed = perms.includes(`${props.resource}:${props.action}`)
  } else if ("resource" in props && props.resource && !("action" in props && props.action)) {
    allowed = perms.some(p => p.startsWith(`${props.resource}:`))
  } else if ("action" in props && props.action && !("resource" in props && props.resource)) {
    allowed = perms.some(p => p.endsWith(`:${props.action}`))
  } else if ("abac" in props && props.abac) {
    const required = `${props.abac.resource}:${props.abac.action}`
    const wildcard = `${props.abac.resource}:manage`
    allowed = perms.includes(required) || perms.includes(wildcard)
  } else if ("permissions" in props && props.permissions) {
    allowed = props.permissions.every(p => perms.includes(p))
  } else if ("anyOf" in props && props.anyOf) {
    allowed = props.anyOf.some(p => perms.includes(p))
  }

  return <>{allowed ? children : fallback}</>
}
