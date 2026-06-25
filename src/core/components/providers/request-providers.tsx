"use client"

import { NuqsAdapter } from "nuqs/adapters/next/app"

import { DevTools } from "@/core/components/dev-tools"
import { TooltipProvider } from "@/core/components/ui/tooltip"

import { SessionProvider } from "@/packages/auth/session-provider"
import type { AuthSession } from "@/packages/auth/schemas"
import { ReactQueryProvider } from "@/packages/tanstack/providers/provider"

export function RequestProviders({
  children,
  initialSession,
}: {
  children: React.ReactNode
  initialSession: AuthSession | null
}) {
  return (
    <NuqsAdapter>
      <ReactQueryProvider>
        <SessionProvider initialSession={initialSession}>
          <TooltipProvider>
            {children}
            <DevTools />
          </TooltipProvider>
        </SessionProvider>
      </ReactQueryProvider>
    </NuqsAdapter>
  )
}
