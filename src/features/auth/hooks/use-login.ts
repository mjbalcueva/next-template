"use client"

import { useMutation } from "@tanstack/react-query"

import { useSession } from "@/packages/auth/session-provider"
import type { LoginInput } from "@/packages/auth/schemas"

import { login } from "../api/auth.api"

export function useLogin() {
  const { setSession } = useSession()

  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: session => setSession(session),
  })
}
