import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

import { TodoList } from "@/features/todo/components/todo-list"
import { todoListQueryOptions } from "@/features/todo/lib/query-options"

export default async function TodosPage() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(todoListQueryOptions())

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TodoList />
    </HydrationBoundary>
  )
}
