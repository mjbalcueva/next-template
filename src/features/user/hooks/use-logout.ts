"use client"

import { useRouter } from "next/navigation"

import { useMutation } from "@tanstack/react-query"

import { useAuth } from "@/packages/auth/store/auth.actions"

import { logout } from "../api/auth.api"

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
