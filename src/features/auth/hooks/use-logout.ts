"use client"

import { useMutation } from "@tanstack/react-query"

import { clearSession } from "@/features/auth/store/auth.actions"

import { logout } from "../api/auth.api"

export function useLogout() {
  return useMutation({
    mutationFn: logout,
    onSettled: () => clearSession(),
  })
}
