"use client"

import { useMutation } from "@tanstack/react-query"

import { useSession } from "@/packages/auth/session-provider"

import { logout } from "../api/auth.api"

export function useLogout() {
  const { clearSession } = useSession()

  return useMutation({
    mutationFn: logout,
    onSettled: () => clearSession(),
  })
}
