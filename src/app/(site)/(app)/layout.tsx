"use client"

import { Protected } from "@/packages/access-control/components/access-control"
import { selectUser, useAuthStore } from "@/features/auth/lib/store"
import { SiteHeader } from "@/features/site/components/site-header"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore(selectUser)

  return (
    <Protected>
      {user && <SiteHeader user={{ name: user.name, email: user.email }} />}
      {children}
    </Protected>
  )
}
