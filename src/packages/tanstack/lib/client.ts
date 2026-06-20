/**
 * better-fetch client with TanStack Query integration.
 *
 * This is the central fetch layer — every feature's API client
 * builds on top of this `$fetch` instance.
 *
 * API schemas are defined in `api-schema.ts` — edit that file
 * when adding new features.
 */

import { createFetch } from "@better-fetch/fetch"

import { env } from "@/env"

import { apiSchema } from "./api-schema"

// ─── Auth token injection ────────────────────────────────────────────────

let getToken: (() => string | null) | null = null

export function setTokenGetter(fn: () => string | null) {
  getToken = fn
}

// ─── Fetch instance ──────────────────────────────────────────────────────

export const $fetch = createFetch({
  baseURL: env.NEXT_PUBLIC_API_URL,
  schema: apiSchema,
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
