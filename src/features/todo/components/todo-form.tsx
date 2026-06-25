"use client"

import { useState } from "react"

import { useForm } from "@tanstack/react-form"

import {
  FormStatus,
  SubmitButton,
  TextFormField,
} from "@/core/components/forms/tanstack-form"

import { Can } from "@/packages/auth/components/can"

import { createTodoSchema } from "../api/todos.schema"
import { useCreateTodo } from "../hooks/use-todo-mutations"

export function TodoForm() {
  const [error, setError] = useState<string | null>(null)
  const create = useCreateTodo()

  const form = useForm({
    defaultValues: { text: "" },
    validators: {
      onSubmit: createTodoSchema,
    },
    onSubmit: async ({ value }) => {
      setError(null)
      try {
        await create.mutateAsync(value)
        form.reset()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create todo.")
      }
    },
  })

  return (
    <Can resource="todos" action="create">
      <form
        onSubmit={e => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
        className="flex flex-col gap-2"
      >
        <form.Field name="text">
          {field => (
            <TextFormField
              field={field}
              label="New todo"
              placeholder="What needs to be done?"
              disabled={create.isPending}
              action={
                <SubmitButton
                  isSubmitting={create.isPending}
                  idleLabel="Add"
                  submittingLabel="Adding…"
                />
              }
            />
          )}
        </form.Field>
        <FormStatus>{error}</FormStatus>
      </form>
    </Can>
  )
}
