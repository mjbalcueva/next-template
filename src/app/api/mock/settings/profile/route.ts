import { AuthError, json, requireAuth } from "../../store"

export async function PATCH(request: Request) {
  try {
    const user = requireAuth(request)
    const body = (await request.json()) as { name: string }
    user.name = body.name
    return json(user)
  } catch (err) {
    if (err instanceof AuthError)
      return Response.json({ error: err.message }, { status: err.status })
    throw err
  }
}
