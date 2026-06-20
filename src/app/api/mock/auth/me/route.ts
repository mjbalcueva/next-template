import { AuthError, json, requireAuth, store } from "../../store"

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safeUser } = user
    return json({ ...safeUser, abilities })
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
