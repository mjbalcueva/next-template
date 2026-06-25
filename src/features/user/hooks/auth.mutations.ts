"use client"

import { useRouter } from "next/navigation"

import { useMutation } from "@tanstack/react-query"

import type { LoginInput, RegisterInput } from "@/packages/auth/lib/schemas"
import { useAuth } from "@/packages/auth/store/auth.actions"

import { getSession, login, logout, register } from "../api/auth.api"

export function useLogin() {
  const { setSession } = useAuth()
  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: session => setSession(session),
  })
}

export function useRegister() {
  const { setSession } = useAuth()
  return useMutation({
    mutationFn: (input: RegisterInput) => register(input),
    onSuccess: session => setSession(session),
  })
}

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

export function useFetchUser() {
  const { clearSession, setSession } = useAuth()
  return useMutation({
    mutationFn: getSession,
    onSuccess: session => setSession(session),
    onError: () => clearSession(),
  })
}
