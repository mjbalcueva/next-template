"use client"

import { useMutation } from "@tanstack/react-query"

import type { RegisterInput } from "@/packages/auth/schemas"
import { useSession } from "@/packages/auth/session-provider"

import { register } from "../api/auth.api"

export function useRegister() {
  const { setSession } = useSession()

  return useMutation({
    mutationFn: (input: RegisterInput) => register(input),
    onSuccess: session => setSession(session),
  })
}
