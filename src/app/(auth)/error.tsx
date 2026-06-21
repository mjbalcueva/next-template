"use client"

import { Button } from "@/core/components/ui/button"

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="flex max-w-sm flex-col items-center gap-4 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="text-muted-foreground text-sm">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <Button variant="outline" onClick={reset}>
          Try again
        </Button>
      </div>
    </main>
  )
}
