import { AuthError, json, requireAuth, store } from "../store"

/**
 * GET /api/mock/user
 *
 * Sanctum-style: returns the authenticated user with token abilities.
 * Requires a valid Bearer token.
 */
export function GET(request: Request) {
  try {
    const user = requireAuth(request)
    const abilities = getAbilitiesForRequest(request)
    return json({ ...user, abilities })
  } catch (err) {
    if (err instanceof AuthError) {
      return Response.json({ error: err.message }, { status: err.status })
    }
    throw err
  }
}

function getAbilitiesForRequest(request: Request): string[] {
  const header = request.headers.get("authorization")
  const bearerToken = header?.replace("Bearer ", "")
  if (!bearerToken) return []
  const tokenId = bearerToken.split("|")[0]
  return store.tokens[tokenId]?.abilities ?? []
}
