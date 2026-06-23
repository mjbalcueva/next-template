/**
 * Auth token resolution — single source for both client and server.
 *
 *   - **Server** — reads the `auth_token` cookie dynamically via `next/headers`.
 *   - **Client** — reads from Zustand (injected via `setClientTokenGetter`).
 *
 * The token is sent as `Authorization: Bearer <token>` on every API request.
 * This works with Laravel (Sanctum / Passport), NestJS, Express, Django, etc.
 *
 * Cookie sync: when Zustand's token changes, a subscriber in `store.ts`
 * also sets `document.cookie = "auth_token=<value>"` so the Next.js proxy
 * can read it server-side for route protection.
 */

// ─── Client-side injection (Zustand → here) ────────────────────────────

let getClientToken: (() => string | null) | null = null

/** Wire up the client-side token reader. Called once from `store.ts`. */
export function setClientTokenGetter(fn: () => string | null) {
  getClientToken = fn
}

// ─── Unified resolver ──────────────────────────────────────────────────

/**
 * Returns the current Bearer token, or `undefined` if not authenticated.
 *
 * On the **server**, this reads the `auth_token` cookie (set by the Zustand
 * subscriber on the client).  The dynamic `next/headers` import is
 * tree-shaken from the client bundle.
 *
 * On the **client**, this calls the getter injected by Zustand's store.
 */
export async function getAuthToken(): Promise<string | undefined> {
  if (typeof window === "undefined") {
    // Server-side — read from the cookie the client persists.
    try {
      const { cookies } = await import("next/headers")
      const store = await cookies()
      return store.get("auth_token")?.value
    } catch {
      // Not in a request context (build, test, etc.) — no auth.
      return undefined
    }
  }

  // Client-side — read from Zustand.
  return getClientToken?.() ?? undefined
}
