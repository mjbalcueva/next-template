import { authorized, pub } from "@/services/orpc/procedures"
import { todosRouter } from "@/features/todo/api/todos.router"

export const router = {
	health: pub.handler(() => ({ ok: true as const })),
	me: authorized.handler(({ context }) => context.user),

	todos: todosRouter,
}

export type Router = typeof router
