import { AuthError, json, jsonError, requireAuth, store } from "../../store"

function getUser(request: Request) {
  try {
    return requireAuth(request)
  } catch (err) {
    if (err instanceof AuthError) throw err
    throw err
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser(request)
    const { id } = await params
    const todo = store.todos.find(t => t.id === id && t.userId === user.id)
    if (!todo) return jsonError("Todo not found", 404)
    return json(todo)
  } catch (err) {
    if (err instanceof AuthError)
      return Response.json({ error: err.message }, { status: err.status })
    throw err
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser(request)
    const { id } = await params
    const idx = store.todos.findIndex(t => t.id === id && t.userId === user.id)
    if (idx === -1) return jsonError("Todo not found", 404)
    const [removed] = store.todos.splice(idx, 1)
    return json({ id: removed.id })
  } catch (err) {
    if (err instanceof AuthError)
      return Response.json({ error: err.message }, { status: err.status })
    throw err
  }
}
