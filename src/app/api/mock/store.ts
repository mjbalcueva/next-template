import { NextResponse } from "next/server"

/**
 * In-memory mock store shared across API route handlers.
 *
 * Delete the entire `src/app/api/mock/` folder when you connect
 * to a real backend and point the auth/API env values at Laravel.
 *
 * Auth follows Laravel Sanctum conventions:
 *   - Login/Register set an HttpOnly first-party session cookie.
 *   - `/sanctum/csrf-cookie` sets a readable `XSRF-TOKEN` cookie.
 *   - Protected routes read the session cookie, not a bearer token.
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
  password: string
  role: "admin" | "moderator" | "member" | "viewer"
}

interface SessionEntry {
  userId: string
  abilities: string[]
}

export const MOCK_SESSION_COOKIE = "mock_session"

export const store = {
  users: [
    {
      id: "u1",
      name: "Admin User",
      email: "admin@template.dev",
      password: "asdfasdf",
      role: "admin" as const,
    },
    {
      id: "u2",
      name: "Jane Member",
      email: "jane@template.dev",
      password: "asdfasdf",
      role: "member" as const,
    },
    {
      id: "u3",
      name: "Bob Viewer",
      email: "bob@template.dev",
      password: "asdfasdf",
      role: "viewer" as const,
    },
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
      text: "Test the protected layout redirect",
      done: false,
      createdAt: "2026-06-20T08:00:00.000Z",
      userId: "u1",
    },
  ] as MockTodo[],

  sessions: {} as Record<string, SessionEntry>,
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

export function jsonWithSession(data: unknown, sessionId: string, status = 200) {
  const response = NextResponse.json(data, { status })
  response.cookies.set(MOCK_SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  })
  return response
}

export function jsonWithoutSession(data: unknown, status = 200) {
  const response = NextResponse.json(data, { status })
  response.cookies.set(MOCK_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
  return response
}

export function createSession(userId: string, abilities: string[] = ["*"]) {
  const sessionId = uid() + uid()
  store.sessions[sessionId] = { userId, abilities }
  return sessionId
}

function readCookie(request: Request, name: string) {
  const header = request.headers.get("cookie")
  if (!header) return null

  const value = header
    .split(";")
    .map(part => part.trim())
    .find(part => part.startsWith(`${name}=`))

  if (!value) return null

  try {
    return decodeURIComponent(value.slice(name.length + 1))
  } catch {
    return value.slice(name.length + 1)
  }
}

export function getSessionEntry(request: Request) {
  const sessionId = readCookie(request, MOCK_SESSION_COOKIE)
  return sessionId ? store.sessions[sessionId] : undefined
}

export function revokeCurrentSession(request: Request) {
  const sessionId = readCookie(request, MOCK_SESSION_COOKIE)
  if (sessionId) {
    delete store.sessions[sessionId]
  }
}

export function requireAuth(request: Request): MockUser {
  const entry = getSessionEntry(request)
  if (!entry) throw new AuthError("Unauthorized", 401)

  const user = store.users.find(u => u.id === entry.userId)
  if (!user) throw new AuthError("User not found", 401)

  return user
}

export function getAbilitiesForRequest(request: Request) {
  return getSessionEntry(request)?.abilities ?? []
}

export function safeUser(user: MockUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

export class AuthError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}
