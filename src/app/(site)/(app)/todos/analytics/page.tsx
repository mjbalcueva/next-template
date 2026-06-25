import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

import { TodoAnalytics } from "@/features/todo/components/analytics/todo-analytics"
import { todoListQueryOptions } from "@/features/todo/lib/query-options"

export default async function TodoAnalyticsPage() {
  const queryClient = new QueryClient()

  try {
    await queryClient.prefetchQuery(todoListQueryOptions())
  } catch {
    // User may not be authenticated — client will handle empty state.
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TodoAnalytics />
    </HydrationBoundary>
  )
}
