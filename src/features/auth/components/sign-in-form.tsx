"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "@tanstack/react-form"

import { Button } from "@/core/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/core/components/ui/field"
import { Input } from "@/core/components/ui/input"
import { loginInputSchema } from "@/features/auth/api/auth.schema"
import { useLoginMutation } from "@/features/auth/lib/mutations"

export function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [authError, setAuthError] = useState<string | null>(null)
  const loginMutation = useLoginMutation()

  const redirectUrl = searchParams.get("redirect") ?? "/todos"

  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: { onSubmit: loginInputSchema },
    onSubmit: async ({ value }) => {
      setAuthError(null)
      try {
        await loginMutation.mutateAsync(value)
        router.push(redirectUrl)
      } catch (err) {
        setAuthError(err instanceof Error ? err.message : "Failed to sign in. Please try again.")
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
                  placeholder="••••••••"
                  autoComplete="current-password"
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
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </Suspense>
  )
}
