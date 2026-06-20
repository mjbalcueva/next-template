import { AuthError, json, jsonError, requireAuth, store } from "../../../store"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = requireAuth(request)
    const { id } = await params
    const body = (await request.json()) as { done: boolean }
    const idx = store.todos.findIndex(t => t.id === id && t.userId === user.id)
    if (idx === -1) return jsonError("Todo not found", 404)
    store.todos[idx] = { ...store.todos[idx], done: body.done }
    return json(store.todos[idx])
  } catch (err) {
    if (err instanceof AuthError)
      return Response.json({ error: err.message }, { status: err.status })
    throw err
  }
}
