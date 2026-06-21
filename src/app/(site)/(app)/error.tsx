"use client"

import { Button } from "@/core/components/ui/button"

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
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
