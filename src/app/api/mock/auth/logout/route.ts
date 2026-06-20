import { json, store } from "../../store"

export function POST(request: Request) {
  const header = request.headers.get("authorization")
  const token = header?.replace("Bearer ", "")

  if (token) {
    delete store.tokens[token]
  }

  return json({ success: true })
}
