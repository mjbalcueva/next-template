/**
 * better-fetch client WITH schema validation.
 *
 * Builds on top of `client-core.ts` by adding the merged API schema.
 * Feature `api.ts` files should import from `client-core.ts` to avoid
 * circular dependencies with `api-schema.ts`.
 */

import { env } from "@/env"
import { createFetch } from "@better-fetch/fetch"

import { apiSchema } from "./api-schema"
import { getTokenValue } from "./client-core"

// Re-export the core pieces so existing consumers don't need to change.
export { setTokenGetter } from "./client-core"

// ─── Fetch instance (with full schema validation) ────────────────────────

export const $fetch = createFetch({
  baseURL: env.NEXT_PUBLIC_API_URL,
  schema: apiSchema,
  throw: true,
  hooks: {
    onRequest: (ctx: { options: RequestInit }) => {
      const token = getTokenValue()
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
