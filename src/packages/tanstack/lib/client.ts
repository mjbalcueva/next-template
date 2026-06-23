/**
 * Central $fetch instance — used by all API layers.
 *
 * Uses better-fetch with:
 *   - Built-in Bearer auth (replaces manual onRequest hook)
 *   - Logger plugin in development
 *   - Linear retry (1 attempt, 1s delay)
 *   - Global onError for dev diagnostics
 */
import { createFetch, type BetterFetchError } from "@better-fetch/fetch"
import { logger } from "@better-fetch/logger"

import { env } from "@/env"

// ─── Auth token injection ────────────────────────────────────────────────

let getToken: (() => string | null) | null = null

export function setTokenGetter(fn: () => string | null) {
  getToken = fn
}

// ─── Fetch instance ──────────────────────────────────────────────────────

export const $fetch = createFetch({
  baseURL: env.NEXT_PUBLIC_API_URL,
  throw: true,
  /** Built-in Bearer auth — replaces the manual onRequest hook. */
  auth: {
    type: "Bearer",
    token: () => getToken?.() ?? undefined,
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
      // eslint-disable-next-line no-console
      console.error(
        `[better-fetch] ${context.request.method} ${context.request.url} → ${err.status ?? "???"} ${err.statusText ?? ""}`
      )
    }
  },
  retry: {
    type: "linear" as const,
    attempts: 1,
    delay: 1000,
  },
})
