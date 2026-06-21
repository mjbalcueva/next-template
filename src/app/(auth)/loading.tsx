import { Skeleton } from "@/core/components/ui/skeleton"

export default function AuthLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="border-border bg-card rounded-xl border p-6">
          <div className="flex flex-col gap-2 pb-6">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
          <div className="flex flex-col gap-4">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </main>
  )
}
