import { redirect } from "next/navigation"

import { RequestProviders } from "@/core/components/providers/request-providers"
import { SiteHeader } from "@/core/components/layout/site-header"

import { SIGN_IN_PATH } from "@/packages/auth/config"
import { getCurrentSession } from "@/packages/auth/server"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession()

  if (!session) {
    redirect(SIGN_IN_PATH)
  }

  return (
    <RequestProviders initialSession={session}>
      <SiteHeader user={{ name: session.user.name, email: session.user.email }} />
      {children}
    </RequestProviders>
  )
}
