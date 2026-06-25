"use client"

import { useState } from "react"

import { useForm } from "@tanstack/react-form"
import { z } from "zod"

import { FormStatus, PasswordFormField, SubmitButton } from "@/core/components/forms/tanstack-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card"

import { useChangePassword } from "@/features/auth/hooks/use-profile"

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export function PasswordSection() {
  const [status, setStatus] = useState<string | null>(null)
  const changePassword = useChangePassword()

  const form = useForm({
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
    validators: { onSubmit: passwordSchema },
    onSubmit: async ({ value }) => {
      setStatus(null)
      try {
        await changePassword.mutateAsync({
          currentPassword: value.currentPassword,
          newPassword: value.newPassword,
        })
        form.reset()
        setStatus("Password changed successfully.")
      } catch (err) {
        setStatus(err instanceof Error ? err.message : "Failed to change password.")
      }
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>Change your account password</CardDescription>
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
          <form.Field name="currentPassword">
            {field => (
              <PasswordFormField
                field={field}
                label="Current password"
                autoComplete="current-password"
              />
            )}
          </form.Field>

          <form.Field name="newPassword">
            {field => (
              <PasswordFormField field={field} label="New password" autoComplete="new-password" />
            )}
          </form.Field>

          <form.Field name="confirmPassword">
            {field => (
              <PasswordFormField
                field={field}
                label="Confirm new password"
                autoComplete="new-password"
              />
            )}
          </form.Field>

          <div className="flex items-center justify-between">
            <FormStatus tone={status?.includes("successfully") ? "success" : "error"}>
              {status}
            </FormStatus>
            <form.Subscribe selector={s => s.isSubmitting}>
              {isSubmitting => (
                <SubmitButton
                  isSubmitting={isSubmitting}
                  idleLabel="Change password"
                  submittingLabel="Changing…"
                  size="sm"
                  className="ml-auto"
                />
              )}
            </form.Subscribe>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
