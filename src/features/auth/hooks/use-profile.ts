"use client"

import { useMutation } from "@tanstack/react-query"

import { updateUser } from "@/features/auth/store/auth.actions"

import { changePassword, checkHealth, deleteAccount, updateProfile } from "../api/settings.api"

export function useUpdateProfile() {
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: user => updateUser(user),
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
