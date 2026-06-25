import { AuthError, getAbilitiesForRequest, json, requireAuth, safeUser } from "../../store"

/**
 * GET /api/mock/auth/me
 *
 * Deprecated — use GET /api/mock/user for Sanctum conventions.
 * Kept for backward compatibility during migration.
 */
export function GET(request: Request) {
  try {
    const user = requireAuth(request)
    const abilities = getAbilitiesForRequest(request)
    return json({ ...safeUser(user), abilities })
  } catch (err) {
    if (err instanceof AuthError) {
      return Response.json({ error: err.message }, { status: err.status })
    }
    throw err
  }
}
