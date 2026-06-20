"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAtomValue, useSetAtom } from "jotai"

import { fetchUserAction, isAuthenticatedAtom, userAtom } from "@/features/auth/atoms"
import { SiteHeader } from "@/features/site/components/site-header"

import { Authenticated } from "@/packages/permissions/components/blocks"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)
  const user = useAtomValue(userAtom)
  const fetchUser = useSetAtom(fetchUserAction)

  // Fetch user profile on mount if authenticated
  useEffect(() => {
    if (isAuthenticated && !user) {
      void fetchUser()
    }
  }, [isAuthenticated, user, fetchUser])

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/sign-in")
    }
  }, [isAuthenticated, router])

  return (
    <Authenticated>
      {user && <SiteHeader user={{ name: user.name, email: user.email }} />}
      {children}
    </Authenticated>
  )
}
