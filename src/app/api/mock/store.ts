/**
 * In-memory mock store shared across API route handlers.
 *
 * Delete the entire `src/app/api/` folder when you connect
 * to a real backend (set NEXT_PUBLIC_API_URL to your API).
 */

interface MockTodo {
  id: string
  text: string
  done: boolean
  createdAt: string
  userId: string
}

interface MockUser {
  id: string
  name: string
  email: string
  role: "admin" | "moderator" | "member" | "viewer"
}

export const store = {
  users: [
    { id: "u1", name: "Admin User", email: "admin@template.dev", role: "admin" as const },
    { id: "u2", name: "Jane Member", email: "jane@template.dev", role: "member" as const },
    { id: "u3", name: "Bob Viewer", email: "bob@template.dev", role: "viewer" as const },
  ] as MockUser[],

  todos: [
    {
      id: "t1",
      text: "Set up the permission matrix",
      done: false,
      createdAt: "2026-06-17T10:00:00.000Z",
      userId: "u1",
    },
    {
      id: "t2",
      text: "Wire up TanStack Query",
      done: true,
      createdAt: "2026-06-18T14:30:00.000Z",
      userId: "u1",
    },
    {
      id: "t3",
      text: "Add RBAC Can component",
      done: false,
      createdAt: "2026-06-19T09:15:00.000Z",
      userId: "u2",
    },
    {
      id: "t4",
      text: "Test the proxy redirect",
      done: false,
      createdAt: "2026-06-20T08:00:00.000Z",
      userId: "u1",
    },
  ] as MockTodo[],

  tokens: {} as Record<string, string>, // token → userId
}

export function uid() {
  return `mock_${Math.random().toString(36).slice(2, 10)}`
}

export function json(data: unknown, status = 200) {
  return Response.json(data, { status })
}

export function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status })
}

export function requireAuth(request: Request): MockUser {
  const header = request.headers.get("authorization")
  const token = header?.replace("Bearer ", "")
  if (!token) throw new AuthError("Unauthorized", 401)

  const userId = store.tokens[token]
  if (!userId) throw new AuthError("Invalid token", 401)

  const user = store.users.find(u => u.id === userId)
  if (!user) throw new AuthError("User not found", 401)

  return user
}

export class AuthError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}
