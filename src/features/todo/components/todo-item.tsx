"use client"

import { useRouter } from "next/navigation"

import { Delete02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { formatDistanceToNow } from "date-fns"

import { Button } from "@/core/components/ui/button"
import { Checkbox } from "@/core/components/ui/checkbox"

import { Can } from "@/packages/access-control/components/can"

import type { Todo } from "../api/todos.schema"
import { useRemoveTodo, useToggleTodo } from "../lib/mutations"

export function TodoItem({ todo }: { todo: Todo }) {
  const router = useRouter()
  const toggle = useToggleTodo()
  const remove = useRemoveTodo()

  const openTodo = () => {
    router.push(`/todos/${todo.id}`)
  }

  return (
    <li
      className="border-border bg-card hover:bg-accent/40 flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors"
      onClick={openTodo}
      onKeyDown={event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          openTodo()
        }
      }}
      role="link"
      tabIndex={0}
    >
      <div className="mt-0.5" onClick={event => event.stopPropagation()}>
        <Checkbox
          checked={todo.done}
          disabled={toggle.isPending}
          onCheckedChange={checked => toggle.mutate({ id: todo.id, done: !!checked })}
          aria-label={`Mark "${todo.text}" as ${todo.done ? "incomplete" : "complete"}`}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className={todo.done ? "text-muted-foreground line-through" : "text-foreground"}>
          {todo.text}
        </span>
        <span className="text-muted-foreground text-xs">
          {formatDistanceToNow(new Date(todo.createdAt), { addSuffix: true })}
        </span>
      </div>
      <Can resource="todos" action="delete">
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={remove.isPending}
          onClick={event => {
            event.stopPropagation()
            remove.mutate(todo.id)
          }}
          aria-label={`Delete "${todo.text}"`}
        >
          <HugeiconsIcon icon={Delete02Icon} size={16} />
        </Button>
      </Can>
    </li>
  )
}
