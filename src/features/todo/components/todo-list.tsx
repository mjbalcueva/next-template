"use client"

import { useQuery } from "@tanstack/react-query"
import { parseAsString, useQueryState } from "nuqs"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/core/components/ui/empty"
import { Input } from "@/core/components/ui/input"

import type { Todo } from "../api/todos.schema"
import { todoListQueryOptions } from "../lib/query-options"

import { TodoForm } from "./todo-form"
import { TodoItem } from "./todo-item"

interface TodoListProps {
  /** Initial data fetched server-side via SSR. */
  initialTodos: Todo[]
}

export function TodoList({ initialTodos }: TodoListProps) {
  const todos = useQuery({
    ...todoListQueryOptions(),
    initialData: initialTodos,
  })
  const [query, setQuery] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({ history: "replace", shallow: false })
  )

  const normalizedQuery = query.trim().toLowerCase()
  const filteredTodos =
    todos.data?.filter(todo => todo.text.toLowerCase().includes(normalizedQuery)) ?? []

  const pendingCount = todos.data?.filter(t => !t.done).length ?? 0
  const totalCount = todos.data?.length ?? 0

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-6 pt-8 pb-16">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold">My todos</h1>
        {totalCount > 0 && (
          <span className="text-muted-foreground text-sm tabular-nums">
            {pendingCount} of {totalCount} remaining
          </span>
        )}
      </div>

      <TodoForm />

      <div className="flex flex-col gap-2">
        <Input
          id="todo-search"
          value={query}
          onChange={e => void setQuery(e.target.value || null)}
          placeholder="Search todos…"
          aria-label="Search todos"
        />
      </div>

      {todos.data?.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
                <path d="M9 12h6M9 16h4" />
              </svg>
            </EmptyMedia>
            <EmptyTitle>No todos yet</EmptyTitle>
            <EmptyDescription>Add your first todo above to get started.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : filteredTodos.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyTitle>No results</EmptyTitle>
            <EmptyDescription>No todos match &ldquo;{query}&rdquo;.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul className="flex flex-col gap-2">
          {filteredTodos.map(todo => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      )}
    </main>
  )
}
