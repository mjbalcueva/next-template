/**
 * Route protection configuration for the proxy (`src/proxy.ts`).
 *
 * ## How it works
 *
 *   1. `PROXY_PROTECTED_PREFIXES` — paths that require an auth token.
 *   2. `PUBLIC_PREFIXES` — paths that bypass the proxy entirely (login, signup, etc.).
 *
 * The proxy performs a fast token-existence check — it does NOT decode tokens
 * or enforce permissions. Permission checks happen at the API level (backend)
 * and UI level (`<Can>` component).
 *
 * ## How to add a new protected route
 *
 *   1. Add the path prefix to `PROXY_PROTECTED_PREFIXES`.
 */

/** Paths that require an auth token to access. */
export const PROXY_PROTECTED_PREFIXES = ["/todos", "/settings"] as const

/** Paths that are always public (no proxy check). */
export const PUBLIC_PREFIXES = ["/auth/sign-in", "/auth/sign-up", "/session"] as const

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
