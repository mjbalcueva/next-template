import { HomeCtaButton } from "@/features/home/home-cta-button"
import { NavigationLinks } from "@/features/home/navigation-links"
import { UserWelcome } from "@/features/home/user-welcome"

import { getCurrentSession } from "@/packages/auth/server"

export default async function HomePage() {
  const session = await getCurrentSession()
  const isLoggedIn = session !== null

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      {isLoggedIn ? (
        <UserWelcome user={session.user} />
      ) : (
        <p className="text-muted-foreground text-base md:text-lg">
          Welcome to <span className="text-foreground font-semibold">Next Template</span>
        </p>
      )}

      <h1 className="text-4xl font-bold tracking-tight text-balance md:text-6xl">
        FRONTEND-FIRST TEMPLATE.
      </h1>

      <p className="text-muted-foreground max-w-2xl text-base leading-7 md:text-xl">
        A clean, server-first starter built with Next.js, TanStack Query, Laravel Sanctum cookie
        auth, and shadcn/ui. Ships with RBAC permissions, a removable mock API, and feature-based
        architecture ready for your backend.
      </p>

      <NavigationLinks />

      <HomeCtaButton href={isLoggedIn ? "/todos" : "/auth/sign-in"} isLoggedIn={isLoggedIn} />
    </main>
  )
}
