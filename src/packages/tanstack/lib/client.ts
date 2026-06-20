/**
 * Central $fetch instance — used by all API layers.
 *
 */
import { env } from "@/env"
import { createFetch } from "@better-fetch/fetch"

// ─── Auth token injection ────────────────────────────────────────────────

let getToken: (() => string | null) | null = null

export function setTokenGetter(fn: () => string | null) {
  getToken = fn
}

// ─── Fetch instance ──────────────────────────────────────────────────────

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
