"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { orpc } from "@/services/orpc/client"

import type { CreateTodoInput, RemoveTodoInput, ToggleTodoInput } from "../api/todos.schema"

export function useTodos() {
	return useQuery(orpc.todos.list.queryOptions())
}

export function useInvalidateTodos() {
	const queryClient = useQueryClient()
	return () => queryClient.invalidateQueries({ queryKey: orpc.todos.key() })
}

export function useCreateTodo(opts?: { onSuccess?: () => void }) {
	const invalidate = useInvalidateTodos()
	return useMutation(
		orpc.todos.create.mutationOptions({
			onSuccess: () => {
				void invalidate()
				opts?.onSuccess?.()
			},
		})
	)
}

export function useToggleTodo() {
	const invalidate = useInvalidateTodos()
	return useMutation(orpc.todos.toggle.mutationOptions({ onSuccess: invalidate }))
}

export function useRemoveTodo() {
	const invalidate = useInvalidateTodos()
	return useMutation(orpc.todos.remove.mutationOptions({ onSuccess: invalidate }))
}

// Re-export input types for convenience
export type { CreateTodoInput, RemoveTodoInput, ToggleTodoInput }
