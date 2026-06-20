"use client"

import { useEffect, useState } from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useSetAtom } from "jotai"

import {
  fetchPermissionsMapping,
  permissionsMappingAtom,
} from "@/packages/access-control/lib/fetch-permissions"

function PermissionsLoader({ children }: { children: React.ReactNode }) {
  const setMapping = useSetAtom(permissionsMappingAtom)

  useEffect(() => {
    fetchPermissionsMapping()
      .then(setMapping)
      .catch(() => {
        // Permissions endpoint unavailable — RBAC will be empty
      })
  }, [setMapping])

  return <>{children}</>
}

export function TanStackProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <PermissionsLoader>{children}</PermissionsLoader>
      {/* eslint-disable-next-line no-restricted-properties */}
      {typeof process !== "undefined" && process.env.NODE_ENV !== "production" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
