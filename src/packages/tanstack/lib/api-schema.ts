/**
 * API schema — merged from all feature slices.
 *
 * This is the ONLY file that needs to change when adding a new feature.
 * `client.ts` imports `apiSchema` from here and never needs editing.
 */

import { createSchema } from "@better-fetch/fetch"
import { z } from "zod"

import { authApiSchema } from "@/features/auth/api/auth.schema"
import { siteApiSchema } from "@/features/site/api/site.schema"
import { todoApiSchema } from "@/features/todo/api/todos.schema"

export const apiSchema = createSchema({
  ...authApiSchema,
  ...todoApiSchema,
  ...siteApiSchema,
  "@get/mock/permissions": {
    output: z.object({
      permissions: z.string().array(),
      roles: z.string().array(),
      rolePermissions: z.record(z.string(), z.string().array()),
    }),
  },
})
