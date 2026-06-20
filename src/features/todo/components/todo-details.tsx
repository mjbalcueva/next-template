"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Delete02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"

import { Badge } from "@/core/components/ui/badge"
import { Button } from "@/core/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card"
import { Checkbox } from "@/core/components/ui/checkbox"
import { Skeleton } from "@/core/components/ui/skeleton"

import { Can } from "@/packages/permissions/components/Can"

import { useRemoveTodo, useToggleTodo } from "../lib/mutations"
import { todoDetailQueryOptions } from "../lib/query-options"

export function TodoDetails({ id }: { id: string }) {
  const router = useRouter()
  const todo = useQuery(todoDetailQueryOptions(id))
  const toggle = useToggleTodo()
  const remove = useRemoveTodo({ onSuccess: () => router.push("/") })

  if (todo.isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-6 pt-8 pb-16">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    )
  }

  if (!todo.data) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-6 pt-8 pb-16">
        <Link href="/" className="text-muted-foreground hover:text-foreground text-sm">
          ← Back to todos
        </Link>
        <p className="text-muted-foreground text-sm">Todo not found.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-6 pt-8 pb-16">
      <Link href="/" className="text-muted-foreground hover:text-foreground w-fit text-sm">
        ← Back to todos
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-base leading-snug font-medium wrap-break-word">
              {todo.data.text}
            </CardTitle>
            <Badge variant={todo.data.done ? "secondary" : "default"} className="shrink-0">
              {todo.data.done ? "Completed" : "Open"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-muted-foreground text-xs">
            Created {format(new Date(todo.data.createdAt), "MMMM d, yyyy 'at' h:mm a")}
          </p>
          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2 text-sm select-none">
              <Checkbox
                checked={todo.data.done}
                disabled={toggle.isPending}
                onCheckedChange={checked => toggle.mutate({ id: todo.data!.id, done: !!checked })}
              />
              Mark as {todo.data.done ? "incomplete" : "complete"}
            </label>
            <Can permission="todos:delete">
              <Button
                variant="ghost"
                size="icon-sm"
                disabled={remove.isPending}
                onClick={() => remove.mutate(todo.data!.id)}
                aria-label="Delete todo"
              >
                <HugeiconsIcon icon={Delete02Icon} size={16} />
              </Button>
            </Can>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
