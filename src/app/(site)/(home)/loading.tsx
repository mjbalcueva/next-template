import { Skeleton } from "@/core/components/ui/skeleton"

export default function HomeLoading() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <Skeleton className="h-5 w-64" />
      <Skeleton className="h-16 w-3/4 md:h-20" />
      <Skeleton className="h-10 w-full max-w-xl" />
      <div className="flex gap-2">
        <Skeleton className="h-10 w-28 rounded-full" />
        <Skeleton className="h-10 w-28 rounded-full" />
      </div>
      <Skeleton className="h-12 w-32 rounded-full" />
    </main>
  )
}
