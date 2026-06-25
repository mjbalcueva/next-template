import { SiteHeader } from "@/core/components/layout/site-header"

import { requireUser } from "@/packages/auth/lib/server"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await requireUser()

  return (
    <>
      <SiteHeader />
      {children}
    </>
  )
}
