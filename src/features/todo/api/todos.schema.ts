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

export type CreateTodoInput = z.infer<typeof createTodoSchema>
export type ToggleTodoInput = z.infer<typeof toggleTodoSchema>
export type RemoveTodoInput = z.infer<typeof removeTodoSchema>
