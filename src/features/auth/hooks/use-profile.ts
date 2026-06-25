"use client"

import { useMutation } from "@tanstack/react-query"

import { useSession } from "@/packages/auth/session-provider"

import { changePassword, checkHealth, deleteAccount, updateProfile } from "../api/settings.api"

export function useUpdateProfile() {
  const { setUser, user: currentUser } = useSession()

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: user => setUser({ ...user, abilities: currentUser?.abilities ?? [] }),
  })
}

export function useChangePassword() {
  return useMutation({ mutationFn: changePassword })
}

export function useDeleteAccount() {
  return useMutation({ mutationFn: deleteAccount })
}

export function useCheckHealth() {
  return useMutation({ mutationFn: checkHealth })
}
