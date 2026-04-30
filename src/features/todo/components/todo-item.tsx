"use client"

import { Delete02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/core/components/ui/button"
import { Checkbox } from "@/core/components/ui/checkbox"
import type { todos } from "@/services/drizzle/schema/todos"

import { useRemoveTodo, useToggleTodo } from "../lib/queries"

type Todo = typeof todos.$inferSelect

export function TodoItem({ todo }: { todo: Todo }) {
	const toggle = useToggleTodo()
	const remove = useRemoveTodo()

	return (
		<li className="border-border bg-card flex items-center gap-3 rounded-xl border px-3 py-2 text-sm">
			<Checkbox
				checked={todo.done}
				disabled={toggle.isPending}
				onCheckedChange={checked => toggle.mutate({ id: todo.id, done: !!checked })}
				aria-label={`Mark "${todo.text}" as ${todo.done ? "incomplete" : "complete"}`}
			/>
			<span className={todo.done ? "text-muted-foreground flex-1 line-through" : "flex-1"}>
				{todo.text}
			</span>
			<Button
				variant="ghost"
				size="icon-sm"
				disabled={remove.isPending}
				onClick={() => remove.mutate({ id: todo.id })}
				aria-label={`Delete "${todo.text}"`}
			>
				<HugeiconsIcon icon={Delete02Icon} size={16} />
			</Button>
		</li>
	)
}
