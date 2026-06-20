import { AuthError, json, requireAuth } from "../../store"

export function PATCH(request: Request) {
  try {
    requireAuth(request)
    return json({ ok: true })
  } catch (err) {
    if (err instanceof AuthError)
      return Response.json({ error: err.message }, { status: err.status })
    throw err
  }
}
