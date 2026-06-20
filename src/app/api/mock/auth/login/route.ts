import { json, jsonError, store } from "../../store"

export async function POST(request: Request) {
  const body = (await request.json()) as { email: string; password: string }

  const user = store.users.find(u => u.email === body.email)
  if (!user) return jsonError("Invalid credentials", 401)

  const token = `mock_token_${user.id}`
  store.tokens[token] = user.id

  return json({ token, user })
}
