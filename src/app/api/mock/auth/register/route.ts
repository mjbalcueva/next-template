import { json, jsonError, store, uid } from "../../store"

export async function POST(request: Request) {
  const body = (await request.json()) as { name: string; email: string; password: string }

  const existing = store.users.find(u => u.email === body.email)
  if (existing) return jsonError("Email already registered", 409)

  const user = { id: uid(), name: body.name, email: body.email, role: "member" as const }
  store.users.push(user)

  const token = `mock_token_${user.id}`
  store.tokens[token] = user.id

  return json({ token, user })
}
