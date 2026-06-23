"use client"

import { useQuery } from "@tanstack/react-query"

import { todoDetailQueryOptions, todoListQueryOptions } from "../lib/query-options"

export function useTodos() {
  return useQuery(todoListQueryOptions())
}

export function useTodo(id: string) {
  return useQuery(todoDetailQueryOptions(id))
}
