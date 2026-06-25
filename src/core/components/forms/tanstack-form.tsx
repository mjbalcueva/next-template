"use client"

import type { ComponentProps, ReactNode } from "react"

import type { AnyFieldApi } from "@tanstack/react-form"

import { Button } from "@/core/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/core/components/ui/field"
import { Input } from "@/core/components/ui/input"
import { cn } from "@/core/lib/utils"

type FieldIssue = { message?: string }

function getFieldErrors(field: AnyFieldApi) {
  return field.state.meta.errors as FieldIssue[]
}

function isInvalidField(field: AnyFieldApi) {
  return field.state.meta.isTouched && !field.state.meta.isValid
}

type TextFormFieldProps = Omit<
  ComponentProps<typeof Input>,
  "id" | "name" | "onBlur" | "onChange" | "value"
> & {
  action?: ReactNode
  field: AnyFieldApi
  fieldClassName?: string
  label: string
}

export function TextFormField({
  action,
  className,
  field,
  fieldClassName,
  label,
  type = "text",
  ...props
}: TextFormFieldProps) {
  const isInvalid = isInvalidField(field)
  const input = (
    <Input
      id={field.name}
      name={field.name}
      type={type}
      value={String(field.state.value ?? "")}
      onBlur={field.handleBlur}
      onChange={event => field.handleChange(event.target.value)}
      aria-invalid={isInvalid}
      className={className}
      {...props}
    />
  )

  return (
    <Field data-invalid={isInvalid} className={fieldClassName}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      {action ? <div className="flex gap-2">{input}{action}</div> : input}
      {isInvalid && <FieldError errors={getFieldErrors(field)} />}
    </Field>
  )
}

export function PasswordFormField(props: Omit<TextFormFieldProps, "type">) {
  return <TextFormField {...props} type="password" />
}

export function FormStatus({
  children,
  tone = "error",
}: {
  children?: ReactNode
  tone?: "error" | "success"
}) {
  if (!children) {
    return null
  }

  return (
    <p
      className={cn(
        "text-sm",
        tone === "success" ? "text-green-600 dark:text-green-400" : "text-destructive"
      )}
    >
      {children}
    </p>
  )
}

export function SubmitButton({
  idleLabel,
  isSubmitting,
  submittingLabel,
  ...props
}: ComponentProps<typeof Button> & {
  idleLabel: string
  isSubmitting: boolean
  submittingLabel: string
}) {
  return (
    <Button type="submit" disabled={isSubmitting || props.disabled} {...props}>
      {isSubmitting ? submittingLabel : idleLabel}
    </Button>
  )
}
