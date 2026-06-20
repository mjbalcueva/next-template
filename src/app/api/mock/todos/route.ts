import { AuthError, json, requireAuth, store, uid } from "../store"

function handleAuth(request: Request) {
  try {
    return requireAuth(request)
  } catch (err) {
    if (err instanceof AuthError) throw err
    throw err
  }
}

export function GET(request: Request) {
  try {
    const user = handleAuth(request)
    const userTodos = store.todos
      .filter(t => t.userId === user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return json(userTodos)
  } catch (err) {
    if (err instanceof AuthError)
      return Response.json({ error: err.message }, { status: err.status })
    throw err
  }
}

export async function POST(request: Request) {
  try {
    const user = handleAuth(request)
    const body = (await request.json()) as { text: string }
    const todo = {
      id: uid(),
      text: body.text,
      done: false,
      createdAt: new Date().toISOString(),
      userId: user.id,
    }
    store.todos.push(todo)
    return json(todo)
  } catch (err) {
    if (err instanceof AuthError)
      return Response.json({ error: err.message }, { status: err.status })
    throw err
  }
}
