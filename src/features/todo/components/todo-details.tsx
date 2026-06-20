"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { Delete02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { format } from "date-fns"

import { Badge } from "@/core/components/ui/badge"
import { Button } from "@/core/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card"
import { Checkbox } from "@/core/components/ui/checkbox"

import { Can } from "@/packages/access-control/components/can"

import type { Todo } from "../api/todos.schema"
import { useRemoveTodo, useToggleTodo } from "../lib/mutations"

interface TodoDetailsProps {
  todo: Todo
}

export function TodoDetails({ todo: initialTodo }: TodoDetailsProps) {
  const router = useRouter()
  const toggle = useToggleTodo()
  const remove = useRemoveTodo({ onSuccess: () => router.push("/") })

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-6 pt-8 pb-16">
      <Link href="/" className="text-muted-foreground hover:text-foreground w-fit text-sm">
        ← Back to todos
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-base leading-snug font-medium wrap-break-word">
              {initialTodo.text}
            </CardTitle>
            <Badge variant={initialTodo.done ? "secondary" : "default"} className="shrink-0">
              {initialTodo.done ? "Completed" : "Open"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-muted-foreground text-xs">
            Created {format(new Date(initialTodo.createdAt), "MMMM d, yyyy 'at' h:mm a")}
          </p>
          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2 text-sm select-none">
              <Checkbox
                checked={initialTodo.done}
                disabled={toggle.isPending}
                onCheckedChange={checked => toggle.mutate({ id: initialTodo.id, done: !!checked })}
              />
              Mark as {initialTodo.done ? "incomplete" : "complete"}
            </label>
            <Can permission="todos:delete">
              <Button
                variant="ghost"
                size="icon-sm"
                disabled={remove.isPending}
                onClick={() => remove.mutate(initialTodo.id)}
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
