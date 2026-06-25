"use client"

import type { Route } from "next"
import Link from "next/link"

import { ArrowRight01Icon, Logout01FreeIcons } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button, buttonVariants } from "@/core/components/ui/button"
import { cn } from "@/core/lib/utils"

import { useLogout } from "@/features/user/hooks/use-logout"

import { useAuth } from "@/packages/auth/store/auth.actions"

export function HomeCtaButton({ href, isLoggedIn }: { href: string; isLoggedIn: boolean }) {
  const { isAuthenticated } = useAuth()
  const { mutateAsync, isPending } = useLogout()

  if (isLoggedIn && isAuthenticated) {
    return (
      <Button size="lg" onClick={() => mutateAsync()} disabled={isPending}>
        <HugeiconsIcon icon={Logout01FreeIcons} strokeWidth={2} className="size-4" />
        {isPending ? "Logging out..." : "Logout"}
      </Button>
    )
  }
  return (
    <Link
      href={href as Route}
      className={cn(buttonVariants({ size: "lg" }), "rounded-full px-6 text-sm tracking-wide")}
    >
      <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} data-icon="inline-start" />
      Login
    </Link>
  )
}
