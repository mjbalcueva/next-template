import { cookies } from "next/headers"

import { HomeCtaButton } from "@/features/home/home-cta-button"
import { NavigationLinks } from "@/features/home/navigation-links"

export default async function HomePage() {
  const cookieStore = await cookies()
  const isLoggedIn = cookieStore.has("auth_token")

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <p className="text-muted-foreground text-base md:text-lg">
        {isLoggedIn ? (
          <>
            Welcome back to <span className="text-foreground font-semibold">Next Template</span>
          </>
        ) : (
          <>
            Welcome to <span className="text-foreground font-semibold">Next Template</span>
          </>
        )}
      </p>

      <h1 className="text-4xl font-bold tracking-tight text-balance md:text-6xl">
        FRONTEND-FIRST TEMPLATE.
      </h1>

      <p className="text-muted-foreground max-w-2xl text-base leading-7 md:text-xl">
        A clean, fast, frontend-first starter built with Next.js, TanStack Query, better-fetch,
        Jotai, and shadcn/ui. Ships with RBAC permissions, mock API, and a feature-based
        architecture ready for any backend.
      </p>

      <NavigationLinks />

      <HomeCtaButton href={isLoggedIn ? "/todos" : "/auth/sign-in"} isLoggedIn={isLoggedIn} />
    </main>
  )
}
