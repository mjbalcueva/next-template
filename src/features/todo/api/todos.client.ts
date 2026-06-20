/**
 * Todo API client — feature-specific fetch wrappers.
 */

import type { z } from "zod"

import { $fetch } from "@/packages/tanstack/lib/client"

import type { createTodoSchema, toggleTodoSchema } from "./todos.schema"

// ─── Types ────────────────────────────────────────────────────────────────

export interface Todo {
  id: string
  text: string
  done: boolean
  createdAt: string
}

// ─── API calls ────────────────────────────────────────────────────────────
//
// better-fetch with `throw: true` returns the parsed output directly.

export async function listTodos(): Promise<Todo[]> {
  return $fetch("/@get/mock/todos")
}

export async function getTodo(id: string): Promise<Todo> {
  return $fetch("/@get/mock/todos/:id", { params: { id } })
}

export async function createTodo(input: z.infer<typeof createTodoSchema>): Promise<Todo> {
  return $fetch("/@post/mock/todos", { body: input })
}

export async function toggleTodo(input: z.infer<typeof toggleTodoSchema>): Promise<Todo> {
  return $fetch("/@patch/mock/todos/:id/toggle", {
    params: { id: input.id },
    body: { done: input.done },
  })
}

export async function removeTodo(id: string): Promise<{ id: string }> {
  return $fetch("/@delete/mock/todos/:id", { params: { id } })
}
