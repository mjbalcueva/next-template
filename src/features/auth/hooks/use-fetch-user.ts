"use client"

import { useMutation } from "@tanstack/react-query"

import { getSession } from "@/packages/auth/api/auth-client"
import { useAuth } from "@/packages/auth/store/auth.actions"

export function useFetchUser() {
  const { clearSession, setSession } = useAuth()

  return useMutation({
    mutationFn: getSession,
    onSuccess: session => setSession(session),
    onError: () => clearSession(),
  })
}
