"use client"

import type { ReactNode } from "react"
import { useAtomValue } from "jotai"

import { canAllAtom, canAnyAtom, canAtom } from "../lib/atoms"
import type { Permission } from "../lib/constants"

// ─── Props ────────────────────────────────────────────────────────────────

type CanProps = {
  children: ReactNode
  fallback?: ReactNode
}

type SinglePermissionProps = CanProps & {
  permission: Permission
  permissions?: never
  anyOf?: never
}

type AllOfProps = CanProps & {
  permission?: never
  permissions: readonly Permission[]
  anyOf?: never
}

type AnyOfProps = CanProps & {
  permission?: never
  permissions?: never
  anyOf: readonly Permission[]
}

export type CanComponentProps = SinglePermissionProps | AllOfProps | AnyOfProps

// ─── Component ────────────────────────────────────────────────────────────

/**
 * Declarative permission guard (JSX-based).
 *
 * @example Single permission
 *   <Can permission="todos:delete" fallback={<LockIcon />}>
 *     <DeleteButton />
 *   </Can>
 *
 * @example All permissions required (AND)
 *   <Can permissions={["todos:update", "todos:delete"]}>
 *     <AdminPanel />
 *   </Can>
 *
 * @example Any permission (OR)
 *   <Can anyOf={["settings:write", "admin:access"]}>
 *     <SettingsLink />
 *   </Can>
 */
export function Can({
  permission,
  permissions,
  anyOf,
  children,
  fallback = null,
}: CanComponentProps) {
  const singleResult = useAtomValue(canAtom(permission ?? ("todos:read" as Permission)))
  const allResult = useAtomValue(canAllAtom(permissions ?? ([] as readonly Permission[])))
  const anyResult = useAtomValue(canAnyAtom(anyOf ?? ([] as readonly Permission[])))

  const allowed = permission ? singleResult : permissions ? allResult : anyOf ? anyResult : false

  return <>{allowed ? children : fallback}</>
}
