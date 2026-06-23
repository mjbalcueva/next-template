import { useMutation, useQueryClient } from "@tanstack/react-query"

import { createTodo, removeTodo, toggleTodo } from "../api/todos.api"

import { todoKeys } from "./query-options"

function useInvalidateTodoList() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
}

export function useCreateTodo(opts?: { onSuccess?: () => void }) {
  const invalidate = useInvalidateTodoList()
  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      void invalidate()
      opts?.onSuccess?.()
    },
  })
}

export function useToggleTodo() {
  const invalidate = useInvalidateTodoList()
  return useMutation({
    mutationFn: toggleTodo,
    onSuccess: () => void invalidate(),
  })
}

export function useRemoveTodo(opts?: { onSuccess?: () => void }) {
  const invalidate = useInvalidateTodoList()
  return useMutation({
    mutationFn: (id: string) => removeTodo(id),
    onSuccess: () => {
      void invalidate()
      opts?.onSuccess?.()
    },
  })
}
