"use client"

import { useMutation } from "@tanstack/react-query"

import { useSession } from "@/packages/auth/session-provider"

import { fetchSession } from "../api/auth.api"

export function useFetchUser() {
  const { clearSession, setSession } = useSession()

  return useMutation({
    mutationFn: fetchSession,
    onSuccess: session => setSession(session),
    onError: () => clearSession(),
  })
}
