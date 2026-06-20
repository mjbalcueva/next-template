import { z } from "zod"

export const permissionsSchema = z.object({
  permissions: z.string().array(),
})

export type PermissionsInput = z.infer<typeof permissionsSchema>
