"use client"

import { useState } from "react"
import type { Route } from "next"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { ArrowRight01Icon, Logout01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button, buttonVariants } from "@/core/components/ui/button"
import { cn } from "@/core/lib/utils"

import { useLogoutMutation } from "@/features/auth/lib/mutations"

type HomeCtaButtonProps = {
  href: string
  isLoggedIn: boolean
}

export function HomeCtaButton({ href, isLoggedIn }: HomeCtaButtonProps) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const logoutMutation = useLogoutMutation()

  if (isLoggedIn) {
    return (
      <Button
        size="lg"
        onClick={async () => {
          setIsPending(true)
          await logoutMutation.mutateAsync()
          router.push("/")
          setIsPending(false)
        }}
        disabled={isPending}
        className="rounded-full px-6 text-sm tracking-wide"
      >
        <HugeiconsIcon icon={Logout01Icon} strokeWidth={2} className="size-4" />
        {isPending ? "Logging out..." : "Logout"}
      </Button>
    )
  }

  return (
    <Link
      href={href as Route}
      className={cn(buttonVariants({ size: "lg" }), "rounded-full px-6 text-sm tracking-wide")}
    >
      <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-4" />
      Login
    </Link>
  )
}
