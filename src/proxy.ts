import { NextResponse, type NextRequest } from "next/server"

import { isAuthPagePath, isProtectedProxyPath } from "@/proxy-routes"

/**
 * Next.js Proxy (formerly middleware).
 *
 * Guards:
 *   1. Protected routes → require auth token (redirect to sign-in if missing).
 *   2. Auth pages (sign-in/sign-up) → redirect to `/todos` if already authenticated.
 *
 * Does NOT decode tokens or enforce permissions. Permission checks happen
 * at the API level and via `<Can>` components.
 *
 * To configure which routes are protected, edit:
 *   `src/proxy-routes.ts`
 */
export function proxy(request: NextRequest) {
  const authToken = request.cookies.get("auth_token")?.value
  const { pathname } = request.nextUrl

  // ── Auth pages: redirect to home if already logged in ────────────────
  if (isAuthPagePath(pathname)) {
    if (authToken) {
      return NextResponse.redirect(new URL("/", request.url))
    }
    return NextResponse.next()
  }

  // ── Protected routes: redirect to sign-in if not authenticated ────────
  if (isProtectedProxyPath(pathname)) {
    if (!authToken) {
      const url = new URL("/auth/sign-in", request.url)
      url.searchParams.set("redirect", pathname)
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
}
