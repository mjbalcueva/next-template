/**
 * Central $fetch instance — used by all API layers.
 *
 * Auth tokens are resolved by {@link getAuthToken} (see `auth-token.ts`):
 *   - **Server** — reads from the `auth_token` cookie
 *   - **Client** — reads from Zustand
 */
import { createFetch, type BetterFetchError } from "@better-fetch/fetch"
import { logger } from "@better-fetch/logger"

import { env } from "@/env"

import { getAuthToken } from "./auth-token"

// ─── Fetch instance ──────────────────────────────────────────────────────

export const $fetch = createFetch({
  baseURL: env.NEXT_PUBLIC_API_URL,
  throw: true,
  auth: {
    type: "Bearer",
    token: getAuthToken,
  },
  /** Logger plugin: verbose in dev, silent in production. */
  plugins: [
    logger({
      // process.env.NODE_ENV is replaced at build time — safe on both client & server.
      // eslint-disable-next-line no-restricted-properties
      enabled: process.env.NODE_ENV === "development",
    }),
  ],
  /** Global error handler — logs to console in dev. */
  onError(context) {
    // eslint-disable-next-line no-restricted-properties
    if (process.env.NODE_ENV === "development") {
      const err = context.error as BetterFetchError
      // 401/403 are expected when unauthenticated — log as warning, not error.
      if (err.status === 401 || err.status === 403) {
        // eslint-disable-next-line no-console
        console.warn(
          `[better-fetch] ${context.request.method} ${context.request.url} → ${err.status} (auth required)`
        )
      } else {
        // eslint-disable-next-line no-console
        console.error(
          `[better-fetch] ${context.request.method} ${context.request.url} → ${err.status ?? "???"} ${err.statusText ?? ""}`
        )
      }
    }
  },
  retry: {
    type: "linear" as const,
    attempts: 1,
    delay: 1000,
    /** Don't retry auth errors — they won't succeed without a valid token. */
    statusCodes: [408, 409, 425, 429, 500, 502, 503, 504],
  },
})
