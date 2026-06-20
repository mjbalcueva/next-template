import { z } from "zod"

/** Update profile name. */
export const updateProfileSchema = z.object({ name: z.string().min(1) })

/** Change password. */
export const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8),
})

/** Delete account confirmation. */
export const deleteAccountSchema = z.object({})
