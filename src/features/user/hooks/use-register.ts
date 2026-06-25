"use client"

import { useMutation } from "@tanstack/react-query"

import { register } from "../api/auth.api"
import type { RegisterInput } from "@/packages/auth/lib/schemas"
import { useAuth } from "@/packages/auth/store/auth.actions"

export function useRegister() {
  const { setSession } = useAuth()

  return useMutation({
    mutationFn: (input: RegisterInput) => register(input),
    onSuccess: session => setSession(session),
  })
}
