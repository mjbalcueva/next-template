"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { useForm } from "@tanstack/react-form"

import {
  FormStatus,
  PasswordFormField,
  SubmitButton,
  TextFormField,
} from "@/core/components/forms/tanstack-form"

import { useRegister } from "@/features/user/hooks/use-register"

import { registerInputSchema } from "@/packages/auth/lib/schemas"

export function RegisterForm() {
  const router = useRouter()
  const [authError, setAuthError] = useState<string | null>(null)
  const register = useRegister()

  const form = useForm({
    defaultValues: { name: "", email: "", password: "", password_confirmation: "" },
    validators: { onSubmit: registerInputSchema },
    onSubmit: async ({ value }) => {
      setAuthError(null)
      try {
        await register.mutateAsync(value)
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
        {field => (
          <TextFormField field={field} label="Name" placeholder="Your name" autoComplete="name" />
        )}
      </form.Field>

      <form.Field name="email">
        {field => (
          <TextFormField
            field={field}
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
          />
        )}
      </form.Field>

      <form.Field name="password">
        {field => (
          <PasswordFormField
            field={field}
            label="Password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
          />
        )}
      </form.Field>

      <form.Field name="password_confirmation">
        {field => (
          <PasswordFormField
            field={field}
            label="Confirm Password"
            placeholder="Re-enter your password"
            autoComplete="new-password"
          />
        )}
      </form.Field>

      <FormStatus>{authError}</FormStatus>

      <form.Subscribe selector={s => s.isSubmitting}>
        {isSubmitting => (
          <SubmitButton
            isSubmitting={isSubmitting}
            idleLabel="Create account"
            submittingLabel="Creating account…"
            className="w-full"
          />
        )}
      </form.Subscribe>
    </form>
  )
}
