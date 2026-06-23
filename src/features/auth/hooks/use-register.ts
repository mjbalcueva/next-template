"use client"

import { useMutation } from "@tanstack/react-query"

import { setToken, updateUser } from "@/features/auth/store/auth.actions"

import { fetchUser, register } from "../api/auth.api"
import type { RegisterInput } from "../api/auth.schema"

export function useRegister() {
  return useMutation({
    mutationFn: async (input: RegisterInput) => {
      const { token } = await register(input)
      setToken(token)
      try {
        const user = await fetchUser()
        updateUser(user)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("[auth] Failed to fetch user after register:", err)
      }
      return { token }
    },
  })
}
