import { json, revokeToken } from "../../store"

/**
 * POST /api/mock/auth/logout
 *
 * Sanctum-style: revokes the current Bearer token.
 */
export function POST(request: Request) {
  const header = request.headers.get("authorization")
  const bearerToken = header?.replace("Bearer ", "")

  if (bearerToken) {
    revokeToken(bearerToken)
  }

  return json({ success: true })
}
