import { createSession, jsonError, jsonWithSession, store } from "../../store"

/**
 * POST /api/mock/auth/login
 *
 * Sanctum SPA-style: sets an HttpOnly session cookie.
 * User is fetched separately via GET /api/mock/user.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as { email: string; password: string }

  const user = store.users.find(u => u.email === body.email)
  if (!user) return jsonError("Invalid credentials", 401)

  if (user.password !== body.password) return jsonError("Invalid credentials", 401)

  const sessionId = createSession(user.id, ["*"])

  return jsonWithSession({ ok: true }, sessionId)
}
