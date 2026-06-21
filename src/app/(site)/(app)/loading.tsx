import { Skeleton } from "@/core/components/ui/skeleton"

export default function AppLoading() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-6 pt-8 pb-16">
      <div className="flex items-baseline justify-between">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-16" />
        </div>
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    </main>
  )
}
