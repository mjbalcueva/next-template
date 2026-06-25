import { SiteHeader } from "@/core/components/layout/site-header"

import { AuthGate } from "@/packages/auth/components/access-control"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <SiteHeader />
      {children}
    </AuthGate>
  )
}
