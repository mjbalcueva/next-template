import { json } from "../store"

export function GET() {
  const permissions = [
    "todos:create",
    "todos:read",
    "todos:update",
    "todos:delete",
    "settings:read",
    "settings:write",
    "admin:access",
  ] as const

  const roles = ["admin", "moderator", "member", "viewer"] as const

  const rolePermissions: Record<string, readonly string[]> = {
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

  return json({ permissions, roles, rolePermissions })
}
