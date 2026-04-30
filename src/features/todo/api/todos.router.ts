import { desc, eq } from "drizzle-orm"

import { db } from "@/services/drizzle"
import { todos } from "@/services/drizzle/schema/todos"
import { pub } from "@/services/orpc/procedures"

import { createTodoSchema, removeTodoSchema, toggleTodoSchema } from "./todos.schema"

export const todosRouter = {
	list: pub.handler(() => db.select().from(todos).orderBy(desc(todos.createdAt))),

	create: pub.input(createTodoSchema).handler(async ({ input }) => {
		const [row] = await db.insert(todos).values(input).returning()
		return row
	}),

	toggle: pub.input(toggleTodoSchema).handler(async ({ input }) => {
		await db.update(todos).set({ done: input.done }).where(eq(todos.id, input.id))
	}),

	remove: pub.input(removeTodoSchema).handler(async ({ input }) => {
		await db.delete(todos).where(eq(todos.id, input.id))
	}),
}
