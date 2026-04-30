import { NextResponse, type NextRequest } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

/**
 * Next.js Proxy (formerly middleware). Performs a fast cookie-only
 * session check — does NOT validate the session against the DB. Use
 * `auth.api.getSession` in Server Components / Route Handlers / oRPC
 * procedures for a real auth check.
 */
export function proxy(request: NextRequest) {
	const sessionCookie = getSessionCookie(request)

	if (!sessionCookie) {
		const url = new URL("/sign-in", request.url)
		url.searchParams.set("redirect", request.nextUrl.pathname)
		return NextResponse.redirect(url)
	}

	return NextResponse.next()
}

export const config = {
	matcher: ["/dashboard/:path*"],
}
