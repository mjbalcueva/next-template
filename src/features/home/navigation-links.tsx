"use client"

import Link from "next/link"

import { buttonVariants } from "@/core/components/ui/button"
import { Separator } from "@/core/components/ui/separator"
import { cn } from "@/core/lib/utils"

const LINKS = [
  { href: "/todos" as const, label: "Dashboard" },
  { href: "/todos" as const, label: "Todos" },
  { href: "/session" as const, label: "Session" },
] as const

export function NavigationLinks() {
  return (
    <nav aria-label="Quick links" className="flex flex-wrap items-center justify-center gap-1">
      {LINKS.map((link, index) => (
        <div key={`${link.label}-${index}`} className="flex items-center gap-1">
          {index > 0 ? (
            <Separator orientation="vertical" className="mx-1 hidden h-5 sm:block" />
          ) : null}
          <Link
            href={link.href}
            className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "rounded-full")}
          >
            {link.label}
          </Link>
        </div>
      ))}
    </nav>
  )
}
