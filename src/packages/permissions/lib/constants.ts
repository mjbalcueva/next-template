/**
 * The permission matrix — single source of truth for what each role can do.
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

// ─── The matrix ──────────────────────────────────────────────────────────
//
//               │ todos:create │ todos:read │ todos:update │ todos:delete │ settings:read │ settings:write │ admin:access
// ──────────────┼──────────────┼────────────┼──────────────┼──────────────┼───────────────┼────────────────┼─────────────
// admin         │      ✅      │     ✅     │      ✅      │      ✅      │      ✅       │       ✅       │     ✅
// moderator     │      ✅      │     ✅     │      ✅      │      ✅      │      ✅       │       ❌       │     ❌
// member        │      ✅      │     ✅     │      ✅      │      ✅      │      ❌       │       ❌       │     ❌
// viewer        │      ❌      │     ✅     │      ❌      │      ❌      │      ❌       │       ❌       │     ❌

export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  admin: [
    "todos:create",
    "todos:read",
    "todos:update",
    "todos:delete",
    "settings:read",
    "settings:write",
    "admin:access",
  ],
  moderator: ["todos:create", "todos:read", "todos:update", "todos:delete", "settings:read"],
  member: ["todos:create", "todos:read", "todos:update", "todos:delete"],
  viewer: ["todos:read"],
}
