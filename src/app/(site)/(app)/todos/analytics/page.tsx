import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

import { TodoAnalytics } from "@/features/todo/components/todo-analytics"
import { todoListQueryOptions } from "@/features/todo/lib/query-options"

export default async function TodoAnalyticsPage() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(todoListQueryOptions())

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TodoAnalytics />
    </HydrationBoundary>
  )
}
