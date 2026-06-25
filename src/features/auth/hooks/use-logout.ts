"use client"

import { useRouter } from "next/navigation"

import { useMutation } from "@tanstack/react-query"

import { useSession } from "@/packages/auth/session-provider"

import { logout } from "../api/auth.api"

export function useLogout() {
  const { clearSession } = useSession()
  const router = useRouter()

  return useMutation({
    mutationFn: logout,
    onSettled: () => clearSession(),
    onSuccess: () => {
      router.push("/")
      router.refresh()
    },
  })
}
