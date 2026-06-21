import { $fetch } from "@/packages/tanstack/lib/client"

import { type CreateTodoInput, type Todo, type ToggleTodoInput } from "./todos.schema"

// ─── Endpoint path constants ─────────────────────────────────────────

export const TODO_ENDPOINTS = {
  list: "mock/todos",
  create: "mock/todos",
  get: "mock/todos/:id",
  toggle: "mock/todos/:id/toggle",
  remove: "mock/todos/:id",
}

// ─── Fetch wrappers ──────────────────────────────────────────────────

export async function listTodos(): Promise<Todo[]> {
  return $fetch(`/${TODO_ENDPOINTS.list}`)
}

export async function getTodo(id: string): Promise<Todo> {
  return $fetch(`/${TODO_ENDPOINTS.get}`, { params: { id } })
}

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  return $fetch(`/${TODO_ENDPOINTS.create}`, { method: "POST", body: input })
}

export async function toggleTodo(input: ToggleTodoInput): Promise<Todo> {
  return $fetch(`/${TODO_ENDPOINTS.toggle}`, {
    method: "PATCH",
    params: { id: input.id },
    body: { done: input.done },
  })
}

export async function removeTodo(id: string): Promise<{ id: string }> {
  return $fetch(`/${TODO_ENDPOINTS.remove}`, { method: "DELETE", params: { id } })
}
