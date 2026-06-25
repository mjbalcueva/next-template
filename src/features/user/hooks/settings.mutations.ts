"use client"

import { useMutation } from "@tanstack/react-query"

import { useAuth } from "@/packages/auth/store/auth.actions"

import { changePassword, checkHealth, deleteAccount, updateProfile } from "../api/settings.api"

export function useUpdateProfile() {
  const { setUser, user: currentUser } = useAuth()
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
