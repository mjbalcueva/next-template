"use client"

import { useEffect, useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import { usePermissionsMappingQuery } from "@/packages/access-control/lib/fetch-permissions"
import { usePermissionsStore } from "@/packages/access-control/lib/store"

function PermissionsLoader({ children }: { children: React.ReactNode }) {
  const { data: mapping } = usePermissionsMappingQuery()
  const setMapping = usePermissionsStore(s => s.setMapping)

  useEffect(() => {
    if (mapping) {
      setMapping(mapping)
    }
  }, [mapping, setMapping])

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
