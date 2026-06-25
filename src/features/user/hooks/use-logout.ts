"use client"

import { useRouter } from "next/navigation"

import { useMutation } from "@tanstack/react-query"

import { logout } from "../api/auth.api"
import { useAuth } from "@/packages/auth/store/auth.actions"

export function useLogout() {
  const { clearSession } = useAuth()
  const router = useRouter()

  return useMutation({
    mutationFn: logout,
    onMutate: () => {
      clearSession()
    },
    onSuccess: () => {
      router.push("/")
      router.refresh()
    },
    onError: () => {
      router.refresh()
    },
  })
}
