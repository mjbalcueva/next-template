"use client"

import { useMutation } from "@tanstack/react-query"

import { setToken, updateUser } from "@/features/auth/store/auth.actions"

import { fetchUser, login } from "../api/auth.api"
import type { LoginInput } from "../api/auth.schema"

export function useLogin() {
  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const { token } = await login(input)
      // Set token first — fetchUser needs the Bearer header.
      setToken(token)
      try {
        const user = await fetchUser()
        updateUser(user)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("[auth] Failed to fetch user after login:", err)
      }
      return { token }
    },
  })
}
