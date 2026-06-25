import { jsonWithoutSession, revokeCurrentSession } from "../../store"

/**
 * POST /api/mock/auth/logout
 *
 * Sanctum SPA-style: revokes the current session cookie.
 */
export function POST(request: Request) {
  revokeCurrentSession(request)

  return jsonWithoutSession({ ok: true })
}
