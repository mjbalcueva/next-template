"use client"

import { useMutation } from "@tanstack/react-query"

import { login } from "@/packages/auth/api/auth-client"
import type { LoginInput } from "@/packages/auth/lib/schemas"
import { useAuth } from "@/packages/auth/store/auth.actions"

export function useLogin() {
  const { setSession } = useAuth()

  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: session => setSession(session),
  })
}
