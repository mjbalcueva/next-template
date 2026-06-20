import { AuthError, json, requireAuth } from "../store"

/**
 * GET /api/mock/permissions
 *
 * Returns ONLY the current user's resolved permissions.
 * The backend evaluates the user's role server-side — the
 * client never sees the full permission matrix.
 */
export function GET(request: Request) {
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

  try {
    const user = requireAuth(request)
    const permissions = rolePermissions[user.role] ?? []
    return json({ permissions })
  } catch (err) {
    if (err instanceof AuthError) {
      return Response.json({ error: err.message }, { status: err.status })
    }
    throw err
  }
}
