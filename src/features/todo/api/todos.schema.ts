import { z } from "zod"

export const createTodoSchema = z.object({
  text: z.string().min(1).max(200),
})

export const toggleTodoSchema = z.object({
  id: z.uuid(),
  done: z.boolean(),
})

export const removeTodoSchema = z.object({
  id: z.uuid(),
})

export const todoIdSchema = z.object({
  id: z.uuid(),
})

export type CreateTodoInput = z.infer<typeof createTodoSchema>
export type ToggleTodoInput = z.infer<typeof toggleTodoSchema>
export type RemoveTodoInput = z.infer<typeof removeTodoSchema>
export type TodoIdInput = z.infer<typeof todoIdSchema>

// ─── Shared Todo type (safe for both client and server) ────────────────

export interface Todo {
  id: string
  text: string
  done: boolean
  createdAt: string
}

// ─── Output schema (used by the API schema slice) ──────────────────────

export const todoOutputSchema = z.object({
  id: z.string(),
  text: z.string(),
  done: z.boolean(),
  createdAt: z.string(),
})
