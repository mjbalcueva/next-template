import type { AuthUser } from "@/packages/auth/schemas"

/**
 * Renders the welcome message with the user's name.
 */
export function UserWelcome({ user }: { user: AuthUser | null }) {
  if (!user) return null

  return (
    <p className="text-muted-foreground text-base md:text-lg">
      Welcome back, <span className="text-foreground font-semibold">{user.name}</span>
    </p>
  )
}
