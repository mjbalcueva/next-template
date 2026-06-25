"use client"

import type { ReactNode } from "react"

import {
  hasAbacPermission,
  hasActionPermission,
  hasAnyPermission,
  hasEveryPermission,
  hasPermission,
  hasResourcePermission,
} from "../permissions"
import type { Permission } from "../schemas"
import { useSession } from "../session-provider"

interface AbacRequest {
  resource: string
  action: string
}

type BaseProps = {
  children: ReactNode
  fallback?: ReactNode
}

type StringPermissionProps = BaseProps & {
  permission: Permission
  resource?: never
  action?: never
  abac?: never
  permissions?: never
  anyOf?: never
}

type ResourceActionProps = BaseProps & {
  permission?: never
  resource: string
  action: string
  abac?: never
  permissions?: never
  anyOf?: never
}

type ResourceOnlyProps = BaseProps & {
  permission?: never
  resource: string
  action?: never
  abac?: never
  permissions?: never
  anyOf?: never
}

type ActionOnlyProps = BaseProps & {
  permission?: never
  resource?: never
  action: string
  abac?: never
  permissions?: never
  anyOf?: never
}

type AbacProps = BaseProps & {
  permission?: never
  resource?: never
  action?: never
  abac: AbacRequest
  permissions?: never
  anyOf?: never
}

type AllOfProps = BaseProps & {
  permission?: never
  resource?: never
  action?: never
  abac?: never
  permissions: readonly Permission[]
  anyOf?: never
}

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

export function Can(props: CanComponentProps) {
  const { children, fallback = null } = props
  const { permissions } = useSession()

  let allowed = false

  if ("permission" in props && props.permission) {
    allowed = hasPermission(permissions, props.permission)
  } else if ("resource" in props && "action" in props && props.resource && props.action) {
    allowed = hasPermission(permissions, `${props.resource}:${props.action}`)
  } else if ("resource" in props && props.resource && !("action" in props && props.action)) {
    allowed = hasResourcePermission(permissions, props.resource)
  } else if ("action" in props && props.action && !("resource" in props && props.resource)) {
    allowed = hasActionPermission(permissions, props.action)
  } else if ("abac" in props && props.abac) {
    allowed = hasAbacPermission(permissions, props.abac.resource, props.abac.action)
  } else if ("permissions" in props && props.permissions) {
    allowed = hasEveryPermission(permissions, props.permissions)
  } else if ("anyOf" in props && props.anyOf) {
    allowed = hasAnyPermission(permissions, props.anyOf)
  }

  return <>{allowed ? children : fallback}</>
}
