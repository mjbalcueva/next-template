"use client"

import { Suspense, useState } from "react"
import { type Route } from "next"
import { useRouter, useSearchParams } from "next/navigation"

import { useForm } from "@tanstack/react-form"

import {
  FormStatus,
  PasswordFormField,
  SubmitButton,
  TextFormField,
} from "@/core/components/forms/tanstack-form"

import { useLogin } from "@/features/auth/hooks/use-login"

import { DEFAULT_AUTH_REDIRECT, loginInputSchema } from "@/packages/auth/lib/schemas"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [authError, setAuthError] = useState<string | null>(null)
  const login = useLogin()

  const redirectUrl = searchParams.get("redirect") ?? DEFAULT_AUTH_REDIRECT

  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: { onSubmit: loginInputSchema },
    onSubmit: async ({ value }) => {
      setAuthError(null)
      try {
        await login.mutateAsync(value)
        router.push(redirectUrl as Route)
      } catch (err) {
        setAuthError(err instanceof Error ? err.message : "Failed to log in. Please try again.")
      }
    },
  })

  return (
    <Suspense>
      <form
        onSubmit={e => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
        className="flex flex-col gap-4"
      >
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
              placeholder="••••••••"
              autoComplete="current-password"
            />
          )}
        </form.Field>

        <FormStatus>{authError}</FormStatus>

        <form.Subscribe selector={s => s.isSubmitting}>
          {isSubmitting => (
            <SubmitButton
              isSubmitting={isSubmitting}
              idleLabel="Log in"
              submittingLabel="Logging in…"
              className="w-full"
            />
          )}
        </form.Subscribe>
      </form>
    </Suspense>
  )
}
