"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { Protected } from "@/packages/access-control/components/access-control"
import { useFetchUserMutation } from "@/features/auth/lib/mutations"
import { selectIsAuthenticated, selectUser, useAuthStore } from "@/features/auth/lib/store"
import { SiteHeader } from "@/features/site/components/site-header"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const user = useAuthStore(selectUser)
  const fetchUserMutation = useFetchUserMutation()

  // Fetch user profile on mount if token exists but user not loaded
  useEffect(() => {
    if (isAuthenticated && !user) {
      fetchUserMutation.mutate()
    }
  }, [isAuthenticated, user, fetchUserMutation])

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/sign-in")
    }
  }, [isAuthenticated, router])

  return (
    <Protected>
      {user && <SiteHeader user={{ name: user.name, email: user.email }} />}
      {children}
    </Protected>
  )
}
