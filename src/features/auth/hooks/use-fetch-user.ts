"use client"

import { useMutation } from "@tanstack/react-query"

import { clearSession, updateUser } from "@/features/auth/store/auth.actions"

import { fetchUser } from "../api/auth.api"

export function useFetchUser() {
  return useMutation({
    mutationFn: fetchUser,
    onSuccess: user => updateUser(user),
    onError: () => clearSession(),
  })
}
