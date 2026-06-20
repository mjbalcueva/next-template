"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "@tanstack/react-form"

import { Button } from "@/core/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/core/components/ui/field"
import { Input } from "@/core/components/ui/input"
import { registerInputSchema } from "@/features/auth/api/auth.schema"
import { useRegisterMutation } from "@/features/auth/lib/mutations"

export function SignUpForm() {
  const router = useRouter()
  const [authError, setAuthError] = useState<string | null>(null)
  const registerMutation = useRegisterMutation()

  const form = useForm({
    defaultValues: { name: "", email: "", password: "", password_confirmation: "" },
    validators: { onSubmit: registerInputSchema },
    onSubmit: async ({ value }) => {
      setAuthError(null)
      try {
        await registerMutation.mutateAsync(value)
        router.push("/todos")
      } catch (err) {
        setAuthError(
          err instanceof Error ? err.message : "Failed to create account. Please try again."
        )
      }
    },
  })

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
      className="flex flex-col gap-4"
    >
      <form.Field name="name">
        {field => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Name</FieldLabel>
              <Input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      </form.Field>

      <form.Field name="email">
        {field => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input
                id={field.name}
                type="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      </form.Field>

      <form.Field name="password">
        {field => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Password</FieldLabel>
              <Input
                id={field.name}
                type="password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
                placeholder="At least 8 characters"
                autoComplete="new-password"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      </form.Field>

      <form.Field name="password_confirmation">
        {field => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
              <Input
                id={field.name}
                type="password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
                placeholder="Re-enter your password"
                autoComplete="new-password"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      </form.Field>

      {authError && <p className="text-destructive text-sm">{authError}</p>}

      <form.Subscribe selector={s => s.isSubmitting}>
        {isSubmitting => (
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Creating account…" : "Create account"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
