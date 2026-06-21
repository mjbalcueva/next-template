"use client"

import { Button } from "@/core/components/ui/button"

export default function HomeError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="text-muted-foreground max-w-sm text-sm">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <Button variant="outline" onClick={reset}>
        Try again
      </Button>
    </main>
  )
}
