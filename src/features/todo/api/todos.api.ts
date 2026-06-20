import { $fetch } from "@/packages/tanstack/lib/client"

import { type CreateTodoInput, type Todo, type ToggleTodoInput } from "./todos.schema"

// ─── Endpoint path constants ─────────────────────────────────────────

export const TODO_ENDPOINTS = {
  list: "@get/mock/todos",
  create: "@post/mock/todos",
  get: "@get/mock/todos/:id",
  toggle: "@patch/mock/todos/:id/toggle",
  remove: "@delete/mock/todos/:id",
}

// ─── Fetch wrappers ──────────────────────────────────────────────────

export async function listTodos(): Promise<Todo[]> {
  return $fetch(`/${TODO_ENDPOINTS.list}`)
}

export async function getTodo(id: string): Promise<Todo> {
  return $fetch(`/${TODO_ENDPOINTS.get}`, { params: { id } })
}

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  return $fetch(`/${TODO_ENDPOINTS.create}`, { body: input })
}

export async function toggleTodo(input: ToggleTodoInput): Promise<Todo> {
  return $fetch(`/${TODO_ENDPOINTS.toggle}`, {
    params: { id: input.id },
    body: { done: input.done },
  })
}

export async function removeTodo(id: string): Promise<{ id: string }> {
  return $fetch(`/${TODO_ENDPOINTS.remove}`, { params: { id } })
}
