/**
 * Permission constants — the canonical list of permissions and roles.
 *
 * Runtime values come from the backend via `/api/mock/permissions`.
 * These const arrays exist for TypeScript union type derivation.
 *
 * @see fetch-permissions.ts for the dynamic mapping
 */

export const PERMISSIONS = [
  "todos:create",
  "todos:read",
  "todos:update",
  "todos:delete",
  "settings:read",
  "settings:write",
  "admin:access",
] as const

export type Permission = (typeof PERMISSIONS)[number]

// ─── Roles ───────────────────────────────────────────────────────────────

export const ROLES = ["admin", "moderator", "member", "viewer"] as const

export type Role = (typeof ROLES)[number]
