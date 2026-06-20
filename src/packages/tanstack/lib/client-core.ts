/**
 * Core $fetch instance — WITHOUT the API schema.
 *
 * This file is safe to import from feature `api.ts` files
 * because it does NOT import `api-schema.ts` (avoiding circular deps).
 *
 * For the full typed $fetch, import from `./client.ts`.
 */

import { env } from "@/env"
import { createFetch } from "@better-fetch/fetch"

// ─── Auth token injection ────────────────────────────────────────────────

let getToken: (() => string | null) | null = null

export function setTokenGetter(fn: () => string | null) {
  getToken = fn
}

/** Shared token getter — used by both client-core and client. */
export function getTokenValue(): string | null {
  return getToken?.() ?? null
}

// ─── Fetch instance (no schema — add it in client.ts) ────────────────────

export const $fetch = createFetch({
  baseURL: env.NEXT_PUBLIC_API_URL,
  throw: true,
  hooks: {
    onRequest: (ctx: { options: RequestInit }) => {
      const token = getToken?.()
      if (token) {
        const headers = ctx.options.headers as Headers
        headers.set("Authorization", `Bearer ${token}`)
      }
    },
  },
  retry: {
    type: "linear" as const,
    attempts: 1,
    delay: 1000,
  },
})
