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

// ─── API schema slice (merged into the central $fetch schema) ────────────

const todoOutputSchema = z.object({
  id: z.string(),
  text: z.string(),
  done: z.boolean(),
  createdAt: z.string(),
})

export const todoApiSchema = {
  "@get/mock/todos": {
    output: todoOutputSchema.array(),
  },
  "@post/mock/todos": {
    input: createTodoSchema,
    output: todoOutputSchema,
  },
  "@get/mock/todos/:id": {
    output: todoOutputSchema,
  },
  "@patch/mock/todos/:id/toggle": {
    input: toggleTodoSchema.omit({ id: true }),
    output: todoOutputSchema,
  },
  "@delete/mock/todos/:id": {
    output: z.object({ id: z.string() }),
  },
} as const
