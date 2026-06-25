import { HomeCtaButton } from "@/features/home/home-cta-button"
import { NavigationLinks } from "@/features/home/navigation-links"

import { getCurrentSession } from "@/packages/auth/lib/server"

export default async function HomePage() {
  const session = await getCurrentSession()
  const isLoggedIn = (session?.user ?? null) !== null

  return (
    <main className="flex w-full flex-col items-center gap-12 pt-24 text-center">
      <div className="flex flex-col items-center gap-3">
        <p className="text-muted-foreground text-base md:text-lg">
          {isLoggedIn ? (
            <>
              Hello <span className="text-foreground font-semibold">{session?.user?.name}</span>
            </>
          ) : (
            <>
              Welcome <span className="text-foreground font-semibold">Everyone!</span>
            </>
          )}
        </p>
        <h1 className="text-6xl font-bold tracking-tight text-black md:text-7xl dark:text-zinc-50">
          NEXT TEMPLATE.
        </h1>
        <p className="text-muted-foreground max-w-2xl text-base leading-7 md:text-xl">
          A clean, server-first starter built with Next.js, TanStack Query, and shadcn/ui. Ships
          with RBAC permissions, a removable mock API, and feature-based architecture ready for your
          backend.
        </p>
      </div>

      <NavigationLinks />

      <HomeCtaButton href={isLoggedIn ? "/todos" : "/auth/login"} isLoggedIn={isLoggedIn} />
    </main>
  )
}
