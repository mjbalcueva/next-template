/**
 * Route protection configuration for the proxy (`src/proxy.ts`).
 *
 * ## How it works
 *
 *   1. `PROXY_PROTECTED_PREFIXES` — paths that require a Sanctum session cookie.
 *   2. `PUBLIC_PREFIXES` — paths that bypass the proxy entirely (login, signup, etc.).
 *
 * The proxy performs a fast optimistic cookie-existence check. Full session
 * validation happens in server layouts via the Laravel API.
 *
 * ## How to add a new protected route
 *
 *   1. Add the path prefix to `PROXY_PROTECTED_PREFIXES`.
 */

/** Paths that require an auth token to access. */
export const PROXY_PROTECTED_PREFIXES = ["/todos", "/settings"] as const

/** Paths that are always public (no proxy check). */
export const PUBLIC_PREFIXES = ["/auth/sign-in", "/auth/sign-up", "/session"] as const

/** Auth pages — redirect authenticated users away from these. */
export const AUTH_PAGE_PREFIXES = ["/auth/sign-in", "/auth/sign-up"] as const

/**
 * Where to redirect authenticated users when they land on an auth page
 * (sign-in, sign-up, etc.). Change this once to update every redirect
 * across the proxy, `<RedirectIfAuthenticated>`, and any future guards.
 */
export const DEFAULT_AUTH_REDIRECT = "/" as const

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

/**
 * Returns `true` if the given pathname is an auth page (sign-in, sign-up).
 * Authenticated users should be redirected away from these.
 */
export function isAuthPagePath(pathname: string): boolean {
  const prefixes: readonly string[] = AUTH_PAGE_PREFIXES
  return prefixes.some(p => pathname === p || pathname.startsWith(`${p}/`))
}
