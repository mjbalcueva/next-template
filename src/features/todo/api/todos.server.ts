/**
 * Server-only todo data access.
 *
 * These functions run on the server (in route pages or server components)
 * and read directly from the mock store.  When you connect a real backend,
 * replace the mock store calls with your database queries.
 */

import { store } from "@/app/api/mock/store"

import type { Todo } from "./todos.schema"

function stripUserId(todo: (typeof store.todos)[number]): Todo {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { userId: _, ...rest } = todo
  return rest
}

export function listTodos(): Todo[] {
  return store.todos.map(stripUserId)
}

export function getTodo(id: string): Todo | undefined {
  const todo = store.todos.find(t => t.id === id)
  return todo ? stripUserId(todo) : undefined
}
