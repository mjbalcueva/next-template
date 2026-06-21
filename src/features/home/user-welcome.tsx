"use client"

import { selectUser, useAuthStore } from "@/features/auth/lib/store"

/**
 * Client component that renders the welcome message with the user's name.
 * Reads from the Zustand auth store (populated after login).
 */
export function UserWelcome() {
  const user = useAuthStore(selectUser)

  if (!user) return null

  return (
    <p className="text-muted-foreground text-base md:text-lg">
      Welcome back, <span className="text-foreground font-semibold">{user.name}</span>
    </p>
  )
}
