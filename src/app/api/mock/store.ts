/**
 * In-memory mock store shared across API route handlers.
 *
 * Delete the entire `src/app/api/` folder when you connect
 * to a real backend (set NEXT_PUBLIC_API_URL to your API).
 *
 * Auth follows Laravel Sanctum conventions:
 *   - Tokens are "{id}|{plaintext}" sent as Bearer.
 *   - The store holds {userId, abilities, tokenHash} keyed by token id.
 *   - Login/Register return { token } only; user is fetched from /api/user.
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

interface TokenEntry {
  userId: string
  /** Permission abilities granted to this token (Sanctum "abilities"). */
  abilities: string[]
  /** The plaintext token stored as-is (in real Sanctum this is SHA-256 hashed). */
  tokenHash: string
}

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
      text: "Test the proxy redirect",
      done: false,
      createdAt: "2026-06-20T08:00:00.000Z",
      userId: "u1",
    },
  ] as MockTodo[],

  /** Sanctum-style token store: tokenId → TokenEntry */
  tokens: {} as Record<string, TokenEntry>,

  /** Auto-incrementing token id (like a DB sequence). */
  _nextTokenId: 1,
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

// ─── Sanctum token helpers ─────────────────────────────────────────────

/**
 * Create a new Sanctum-style personal access token.
 *
 * Returns the FULL token string to give to the client (e.g. "3|abc123…").
 * The store holds the token id → { userId, abilities, tokenHash }.
 *
 * In real Sanctum the hash is SHA-256(plaintext); here we store it as-is
 * for simplicity.
 */
export function createToken(
  userId: string,
  abilities: string[] = ["*"]
): { plainTextToken: string } {
  const tokenId = String(store._nextTokenId++)
  const plaintext = uid() + uid()
  store.tokens[tokenId] = {
    userId,
    abilities,
    tokenHash: plaintext,
  }
  return { plainTextToken: `${tokenId}|${plaintext}` }
}

/**
 * Revoke (delete) a Sanctum token by its FULL Bearer string.
 */
export function revokeToken(bearerToken: string): void {
  const tokenId = bearerToken.split("|")[0]
  delete store.tokens[tokenId]
}

/**
 * Authenticate a request via Sanctum Bearer token.
 *
 * Parses the "{id}|{plaintext}" format, looks up the token id,
 * and verifies the plaintext matches the stored hash.
 *
 * Returns the authenticated user (never null — throws AuthError on failure).
 */
export function requireAuth(request: Request): MockUser {
  const header = request.headers.get("authorization")
  const bearerToken = header?.replace("Bearer ", "")
  if (!bearerToken) throw new AuthError("Unauthorized", 401)

  const [tokenId, plaintext] = bearerToken.split("|")
  if (!tokenId || !plaintext) throw new AuthError("Malformed token", 401)

  const entry = store.tokens[tokenId]
  if (!entry) throw new AuthError("Invalid token", 401)

  // In real Sanctum: hash(plaintext) === entry.tokenHash
  if (plaintext !== entry.tokenHash) throw new AuthError("Invalid token", 401)

  const user = store.users.find(u => u.id === entry.userId)
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
