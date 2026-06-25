"use client"

import { useMutation } from "@tanstack/react-query"

import { useAuth } from "@/packages/auth/store/auth.actions"

import { getSession } from "../api/auth.api"

export function useFetchUser() {
  const { clearSession, setSession } = useAuth()

  return useMutation({
    mutationFn: getSession,
    onSuccess: session => setSession(session),
    onError: () => clearSession(),
  })
}
