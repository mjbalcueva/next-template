"use client"

import { SiteHeader } from "@/core/components/layout/site-header"

import { useUser } from "@/features/auth/hooks/use-session"

import { Protected } from "@/packages/access-control/components/access-control"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const user = useUser()

  return (
    <Protected>
      {user && <SiteHeader user={{ name: user.name, email: user.email }} />}
      {children}
    </Protected>
  )
}
