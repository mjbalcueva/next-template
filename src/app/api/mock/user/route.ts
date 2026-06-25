import { AuthError, getAbilitiesForRequest, json, requireAuth, safeUser } from "../store"

/**
 * GET /api/mock/user
 *
 * Sanctum-style: returns the authenticated user with abilities.
 * Requires a valid session cookie.
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
