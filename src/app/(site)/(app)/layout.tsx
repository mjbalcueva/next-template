"use client"

import { SiteHeader } from "@/core/components/site-header"

import { selectUser, useAuthStore } from "@/features/auth/lib/store"

import { Protected } from "@/packages/access-control/components/access-control"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore(selectUser)

  return (
    <Protected>
      {user && <SiteHeader user={{ name: user.name, email: user.email }} />}
      {children}
    </Protected>
  )
}
