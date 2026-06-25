"use client"

import { useMutation } from "@tanstack/react-query"

import { useSession } from "@/packages/auth/session-provider"
import type { RegisterInput } from "@/packages/auth/schemas"

import { register } from "../api/auth.api"

export function useRegister() {
  const { setSession } = useSession()

  return useMutation({
    mutationFn: (input: RegisterInput) => register(input),
    onSuccess: session => setSession(session),
  })
}
