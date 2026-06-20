"use client"

import type { ReactNode } from "react"

import type { Permission } from "../lib/constants"
import {
  useCan,
  useCanAbac,
  useCanAction,
  useCanAll,
  useCanAny,
  useCanResource,
  type AbacRequest,
} from "../lib/store"

// ─── Props ────────────────────────────────────────────────────────────────

type BaseProps = {
  children: ReactNode
  fallback?: ReactNode
}

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

/** ABAC check with optional attributes (exact match or `"resource:manage"` wildcard). */
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

// ─── Component ────────────────────────────────────────────────────────────

/**
 * Declarative permission guard (JSX-based).
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

  // Call ALL hooks unconditionally (Rules of Hooks), then pick the right one.
  const stringResult = useCan("permission" in props ? props.permission : undefined)
  const splitResult = useCan(
    "resource" in props && "action" in props && props.resource && props.action
      ? { resource: props.resource, action: props.action }
      : undefined
  )
  const resourceResult = useCanResource(
    "resource" in props && props.resource && !("action" in props && props.action)
      ? props.resource
      : ""
  )
  const actionResult = useCanAction(
    "action" in props && props.action && !("resource" in props && props.resource)
      ? props.action
      : ""
  )
  const abacResult = useCanAbac(
    "abac" in props && props.abac ? props.abac : { resource: "", action: "" }
  )
  const allResult = useCanAll("permissions" in props ? props.permissions : undefined)
  const anyResult = useCanAny("anyOf" in props ? props.anyOf : undefined)

  let allowed: boolean

  if ("permission" in props && props.permission) {
    allowed = stringResult
  } else if ("resource" in props && "action" in props && props.resource && props.action) {
    allowed = splitResult
  } else if ("resource" in props && props.resource && !("action" in props && props.action)) {
    allowed = resourceResult
  } else if ("action" in props && props.action && !("resource" in props && props.resource)) {
    allowed = actionResult
  } else if ("abac" in props && props.abac) {
    allowed = abacResult
  } else if ("permissions" in props && props.permissions) {
    allowed = allResult
  } else if ("anyOf" in props && props.anyOf) {
    allowed = anyResult
  } else {
    allowed = false
  }

  return <>{allowed ? children : fallback}</>
}
