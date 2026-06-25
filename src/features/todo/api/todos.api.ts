import { apiFetch } from "@/packages/api/http"

import {
  removedTodoOutputSchema,
  todoListOutputSchema,
  todoOutputSchema,
  type CreateTodoInput,
  type Todo,
  type ToggleTodoInput,
} from "./todos.schema"

// ─── Endpoint path constants ─────────────────────────────────────────

export const TODO_ENDPOINTS = {
  list: "todos",
  create: "todos",
  get: "todos/:id",
  toggle: "todos/:id/toggle",
  remove: "todos/:id",
}

// ─── Fetch wrappers ──────────────────────────────────────────────────

export async function listTodos(): Promise<Todo[]> {
  return apiFetch(TODO_ENDPOINTS.list, { schema: todoListOutputSchema })
}

export async function getTodo(id: string): Promise<Todo> {
  return apiFetch(TODO_ENDPOINTS.get, { params: { id }, schema: todoOutputSchema })
}

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  return apiFetch(TODO_ENDPOINTS.create, { method: "POST", body: input, schema: todoOutputSchema })
}

export async function toggleTodo(input: ToggleTodoInput): Promise<Todo> {
  return apiFetch(TODO_ENDPOINTS.toggle, {
    method: "PATCH",
    params: { id: input.id },
    body: { done: input.done },
    schema: todoOutputSchema,
  })
}

export async function removeTodo(id: string): Promise<{ id: string }> {
  return apiFetch(TODO_ENDPOINTS.remove, {
    method: "DELETE",
    params: { id },
    schema: removedTodoOutputSchema,
  })
}
