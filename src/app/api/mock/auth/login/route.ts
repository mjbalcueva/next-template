import { createToken, json, jsonError, store } from "../../store"

/**
 * POST /api/mock/auth/login
 *
 * Sanctum-style: returns { token } only (no user object).
 * User is fetched separately via GET /api/mock/user.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as { email: string; password: string }

  const user = store.users.find(u => u.email === body.email)
  if (!user) return jsonError("Invalid credentials", 401)

  const { plainTextToken } = createToken(user.id, ["*"])

  return json({ token: plainTextToken })
}
