/**
 * API schema — merged from all feature slices.
 *
 * This is the ONLY file that needs to change when adding a new feature.
 * `client.ts` imports `apiSchema` from here and never needs editing.
 */

import { createSchema } from "@better-fetch/fetch"
import { z } from "zod"

import { authApiSchema } from "@/features/auth/api/auth.api"
import { siteApiSchema } from "@/features/site/api/site.api"
import { todoApiSchema } from "@/features/todo/api/todos.api"

export const PERMISSIONS_ENDPOINT = "@get/mock/permissions" as const

export const apiSchema = createSchema({
  ...authApiSchema,
  ...todoApiSchema,
  ...siteApiSchema,
  [PERMISSIONS_ENDPOINT]: {
    output: z.object({
      permissions: z.string().array(),
    }),
  },
})
