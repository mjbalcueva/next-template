import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

import { TodoDetails } from "@/features/todo/components/detail/todo-details"
import { todoDetailQueryOptions } from "@/features/todo/lib/query-options"

export default async function TodoPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(todoDetailQueryOptions(id))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TodoDetails id={id} />
    </HydrationBoundary>
  )
}
