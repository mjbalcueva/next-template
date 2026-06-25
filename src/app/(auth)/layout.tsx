import { RequestProviders } from "@/core/components/providers/request-providers"

import { getCurrentSession } from "@/packages/auth/server"

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession()

  return <RequestProviders initialSession={session}>{children}</RequestProviders>
}
