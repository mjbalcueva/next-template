import type { Route } from "next"
import Link from "next/link"

import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { buttonVariants } from "@/core/components/ui/button"
import { cn } from "@/core/lib/utils"

export function HomeCtaButton({ href, isLoggedIn }: { href: string; isLoggedIn: boolean }) {
  return (
    <Link
      href={href as Route}
      className={cn(buttonVariants({ size: "lg" }), "rounded-full px-6 text-sm tracking-wide")}
    >
      <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} data-icon="inline-start" />
      {isLoggedIn ? "Open dashboard" : "Login"}
    </Link>
  )
}
