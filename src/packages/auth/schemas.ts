import { z } from "zod"

export const roleSchema = z.enum(["admin", "moderator", "member", "viewer"])

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: roleSchema,
})

export const authUserSchema = userSchema.extend({
  abilities: z.string().array().default([]),
})

export const permissionSchema = z.string()

export const permissionsSchema = z.object({
  permissions: permissionSchema.array(),
})

export const authSessionSchema = z.object({
  user: authUserSchema,
  permissions: permissionSchema.array(),
})

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
})

export const registerInputSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
  password_confirmation: z.string().min(1, "Please confirm your password"),
})

export type User = z.infer<typeof userSchema>
export type AuthUser = z.infer<typeof authUserSchema>
export type AuthSession = z.infer<typeof authSessionSchema>
export type Permission = z.infer<typeof permissionSchema>
export type LoginInput = z.infer<typeof loginInputSchema>
export type RegisterInput = z.infer<typeof registerInputSchema>

export interface AuthConfig {
  appUrl: string
  apiUrl: string
  authUrl: string
  csrfUrl: string
}
