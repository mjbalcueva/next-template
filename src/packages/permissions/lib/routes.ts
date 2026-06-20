/**
 * Route protection configuration for the proxy (`src/proxy.ts`).
 *
 * ## How it works
 *
 *   1. `PROXY_PROTECTED_PREFIXES` — paths that require an auth token.
 *   2. `PUBLIC_PREFIXES` — paths that bypass the proxy entirely (login, signup, etc.).
 *   3. `ROUTE_PERMISSIONS` — maps route prefixes to required permissions.
 *      This is for **documentation and reference** only — the proxy itself
 *      does NOT decode tokens or enforce permissions.  Permission checks
 *      happen at the API level (backend) and UI level (`<Can>` component).
 *
 * ## How to add a new protected route
 *
 *   1. Add the path prefix to `PROXY_PROTECTED_PREFIXES`.
 *   2. Optionally add required permissions to `ROUTE_PERMISSIONS`.
 *   3. Use `<Can permission="...">` in page components for UI-level gating.
 */

import type { Permission } from "./constants"

/** Paths that require an auth token to access. */
export const PROXY_PROTECTED_PREFIXES = ["/todos", "/settings"] as const

/** Paths that are always public (no proxy check). */
export const PUBLIC_PREFIXES = ["/auth/sign-in", "/auth/sign-up", "/session"] as const

/**
 * Permission requirements for each route prefix.
 *
 * The proxy does NOT enforce these — it only checks for token existence.
 * Actual permission enforcement happens:
 *   - On the backend (API authorization)
 *   - In components via `<Can permission="...">`
 *
 * This map serves as documentation and can be used by future middleware.
 */
export const ROUTE_PERMISSIONS: Record<string, readonly Permission[]> = {
  "/todos": ["todos:read"],
  "/settings": ["settings:read"],
  "/admin": ["admin:access"],
}

/**
 * Returns `true` if the given pathname requires authentication.
 */
export function isProtectedProxyPath(pathname: string): boolean {
  // Public paths always bypass
  const publicPrefixes: readonly string[] = PUBLIC_PREFIXES
  if (publicPrefixes.some(p => pathname === p || pathname.startsWith(`${p}/`))) {
    return false
  }

  // Check protected prefixes
  const prefixes: readonly string[] = PROXY_PROTECTED_PREFIXES
  return prefixes.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`))
}
