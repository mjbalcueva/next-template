"use client"

import { useState } from "react"

import { useForm } from "@tanstack/react-form"
import { z } from "zod"

import { FormStatus, SubmitButton, TextFormField } from "@/core/components/forms/tanstack-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card"

import { useUpdateProfile } from "@/features/user/hooks/settings.mutations"

import { useUser } from "@/packages/auth/store/auth.actions"

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
            {field => <TextFormField field={field} label="Name" autoComplete="name" />}
          </form.Field>

          <div className="flex items-center justify-between">
            <FormStatus tone={status?.includes("updated") ? "success" : "error"}>
              {status}
            </FormStatus>
            <form.Subscribe selector={s => s.isSubmitting}>
              {isSubmitting => (
                <SubmitButton
                  isSubmitting={isSubmitting}
                  idleLabel="Save changes"
                  submittingLabel="Saving…"
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
