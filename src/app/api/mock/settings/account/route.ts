import { AuthError, json, requireAuth, store } from "../../store"

export function DELETE(request: Request) {
  try {
    const user = requireAuth(request)
    store.users = store.users.filter(u => u.id !== user.id)
    return json({ ok: true })
  } catch (err) {
    if (err instanceof AuthError)
      return Response.json({ error: err.message }, { status: err.status })
    throw err
  }
}
