"use client"

import { useMutation } from "@tanstack/react-query"

import type { LoginInput } from "@/packages/auth/lib/schemas"
import { useAuth } from "@/packages/auth/store/auth.actions"

import { login } from "../api/auth.api"

export function useLogin() {
  const { setSession } = useAuth()

  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: session => setSession(session),
  })
}
