import { $fetch } from "@/packages/tanstack/lib/client"

import { type PermissionsInput } from "./permissions.schema"

// ─── Endpoint path constants ─────────────────────────────────────────

export const PERMISSIONS_ENDPOINT = "mock/permissions"

// ─── Fetch wrappers ──────────────────────────────────────────────────

export async function fetchMyPermissions(): Promise<PermissionsInput> {
  return $fetch(`/${PERMISSIONS_ENDPOINT}`)
}
