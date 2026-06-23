/**
 * Auth cookie helpers — single source of truth.
 *
 * The Next.js proxy (`src/proxy.ts`) checks for `auth_token`.
 * Zustand owns the token; we sync it to a cookie so the proxy
 * can read it on server-side navigations.
 */
const AUTH_COOKIE = "auth_token"
const COOKIE_PATH = "/"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

function setAuthCookie(token: string) {
  if (typeof document === "undefined") return
  document.cookie = [
    `${AUTH_COOKIE}=${encodeURIComponent(token)}`,
    `path=${COOKIE_PATH}`,
    `max-age=${COOKIE_MAX_AGE}`,
    "samesite=lax",
  ].join("; ")
}

function clearAuthCookie() {
  if (typeof document === "undefined") return
  document.cookie = `${AUTH_COOKIE}=; path=${COOKIE_PATH}; max-age=0`
}

export { AUTH_COOKIE, setAuthCookie, clearAuthCookie }
