import { NextResponse } from "next/server"

/**
 * GET /api/mock/sanctum/csrf-cookie
 *
 * Sanctum-style CSRF cookie endpoint.
 * Sets an XSRF-TOKEN cookie for SPA authentication.
 * In the mock, this is a no-op that simply returns 204.
 */
export function GET() {
  const response = new NextResponse(null, { status: 204 })
  response.cookies.set("XSRF-TOKEN", `mock_csrf_${Math.random().toString(36).slice(2)}`, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
  })
  return response
}
