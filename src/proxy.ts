import { NextResponse, type NextRequest } from "next/server"

import { isProtectedProxyPath } from "@/packages/permissions/lib/routes"

/**
 * Next.js Proxy (formerly middleware).
 *
 * Performs a fast token-existence check — does NOT validate the token
 * against any backend.  Actual auth validation happens in the API layer
 * and permission enforcement happens via `<Can>` components.
 *
 * To configure which routes are protected, edit:
 *   `src/core/config/proxy-routes.ts`
 */
export function proxy(request: NextRequest) {
  if (!isProtectedProxyPath(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  const authToken = request.cookies.get("auth_token")?.value

  if (!authToken) {
    const url = new URL("/auth/sign-in", request.url)
    url.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
}
