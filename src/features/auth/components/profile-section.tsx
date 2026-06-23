"use client"

import { useState } from "react"

import { useForm } from "@tanstack/react-form"
import { z } from "zod"

import { Button } from "@/core/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/core/components/ui/field"
import { Input } from "@/core/components/ui/input"

import { useUpdateProfile } from "@/features/auth/hooks/use-profile"
import { useUser } from "@/features/auth/hooks/use-session"

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
})

export function ProfileSection() {
  const user = useUser()
  const [status, setStatus] = useState<string | null>(null)
  const updateProfile = useUpdateProfile()

  const form = useForm({
    defaultValues: { name: user?.name ?? "" },
    validators: { onSubmit: profileSchema },
    onSubmit: async ({ value }) => {
      setStatus(null)
      try {
        await updateProfile.mutateAsync(value)
        setStatus("Profile updated.")
      } catch (err) {
        setStatus(err instanceof Error ? err.message : "Failed to update profile.")
      }
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Update your display name</CardDescription>
      </CardHeader>
      <CardContent>
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
                    autoComplete="name"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>

          <div className="flex items-center justify-between">
            {status && (
              <p
                className={
                  status.includes("updated")
                    ? "text-sm text-green-600 dark:text-green-400"
                    : "text-destructive text-sm"
                }
              >
                {status}
              </p>
            )}
            <form.Subscribe selector={s => s.isSubmitting}>
              {isSubmitting => (
                <Button type="submit" disabled={isSubmitting} size="sm" className="ml-auto">
                  {isSubmitting ? "Saving…" : "Save changes"}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
