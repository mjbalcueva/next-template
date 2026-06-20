"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSetAtom } from "jotai"

import { Button } from "@/core/components/ui/button"

import { logoutAction } from "@/features/auth/atoms"

type SiteHeaderProps = {
  user: {
    name: string
    email: string
  }
}

export function SiteHeader({ user: _user }: SiteHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const logout = useSetAtom(logoutAction)

  const handleSignOut = async () => {
    await logout()
    router.push("/auth/sign-in")
  }

  return (
    <header className="bg-background/80 sticky top-0 z-10 border-b backdrop-blur-sm">
      <div className="mx-auto flex max-w-md items-center justify-between px-6 py-3">
        <Link href="/todos" className="text-sm font-semibold tracking-tight">
          Next Template
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/settings"
            className={
              pathname === "/settings"
                ? "text-foreground text-sm"
                : "text-muted-foreground hover:text-foreground text-sm"
            }
          >
            Settings
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-foreground"
          >
            Sign out
          </Button>
        </div>
      </div>
    </header>
  )
}
