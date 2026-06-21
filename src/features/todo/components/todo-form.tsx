"use client"

import { useState } from "react"
import { useForm } from "@tanstack/react-form"

import { Button } from "@/core/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/core/components/ui/field"
import { Input } from "@/core/components/ui/input"
import { Can } from "@/packages/access-control/components/can"

import { createTodoSchema } from "../api/todos.schema"
import { useCreateTodo } from "../lib/mutations"

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
          {field => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>New todo</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    placeholder="What needs to be done?"
                    disabled={create.isPending}
                    aria-invalid={isInvalid}
                  />
                  <Button type="submit" disabled={create.isPending}>
                    Add
                  </Button>
                </div>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>
        {error && <p className="text-destructive text-sm">{error}</p>}
      </form>
    </Can>
  )
}
