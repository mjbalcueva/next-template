"use client"

import { SiteHeader } from "@/core/components/site-header"

import { useAuthStore } from "@/features/auth/store/auth.store"

import { Protected } from "@/packages/access-control/components/access-control"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore(s => s.user)

  return (
    <Protected>
      {user && <SiteHeader user={{ name: user.name, email: user.email }} />}
      {children}
    </Protected>
  )
}
