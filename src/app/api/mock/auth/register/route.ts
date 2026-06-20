import { createToken, json, jsonError, store, uid } from "../../store"

/**
 * POST /api/mock/auth/register
 *
 * Sanctum-style:
 *   - Requires password_confirmation.
 *   - Returns { token } only (no user object).
 *   - New users default to "member" role.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as {
    name: string
    email: string
    password: string
    password_confirmation: string
  }

  if (body.password !== body.password_confirmation) {
    return jsonError("The password confirmation does not match.", 422)
  }

  const existing = store.users.find(u => u.email === body.email)
  if (existing) return jsonError("Email already registered", 409)

  const user = { id: uid(), name: body.name, email: body.email, role: "member" as const }
  store.users.push(user)

  const { plainTextToken } = createToken(user.id, ["*"])

  return json({ token: plainTextToken }, 201)
}
