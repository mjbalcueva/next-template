import { AuthError, json, requireAuth } from "../../store"

export function GET(request: Request) {
  try {
    const user = requireAuth(request)
    return json(user)
  } catch (err) {
    if (err instanceof AuthError) {
      return Response.json({ error: err.message }, { status: err.status })
    }
    throw err
  }
}
