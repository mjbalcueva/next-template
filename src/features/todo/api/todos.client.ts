/**
 * Todo API client — feature-specific fetch wrappers.
 *
 * Every call goes through better-fetch ($fetch) to hit the mock API.
 * No direct store access — always use these API wrappers.
 */

import { $fetch } from "@/packages/tanstack/lib/client"

import type { CreateTodoInput, Todo, ToggleTodoInput } from "./todos.schema"

// ─── API calls ────────────────────────────────────────────────────────────
//
// better-fetch with `throw: true` returns the parsed output directly.

export async function listTodos(): Promise<Todo[]> {
  return $fetch("/@get/mock/todos")
}

export async function getTodo(id: string): Promise<Todo> {
  return $fetch("/@get/mock/todos/:id", { params: { id } })
}

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  return $fetch("/@post/mock/todos", { body: input })
}

export async function toggleTodo(input: ToggleTodoInput): Promise<Todo> {
  return $fetch("/@patch/mock/todos/:id/toggle", {
    params: { id: input.id },
    body: { done: input.done },
  })
}

export async function removeTodo(id: string): Promise<{ id: string }> {
  return $fetch("/@delete/mock/todos/:id", { params: { id } })
}
