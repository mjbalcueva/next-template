"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { Delete02Icon, InformationCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"

import { Badge } from "@/core/components/ui/badge"
import { Button } from "@/core/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card"
import { Checkbox } from "@/core/components/ui/checkbox"

import { Gate } from "@/packages/auth/components/gate"

import { useRemoveTodo, useToggleTodo } from "../../hooks/todos.mutations"
import { todoDetailQueryOptions } from "../../lib/query-options"

export function TodoDetails({ id }: { id: string }) {
  const router = useRouter()
  const { data: todo } = useQuery(todoDetailQueryOptions(id))
  const toggle = useToggleTodo()
  const remove = useRemoveTodo({ onSuccess: () => router.push("/todos") })

  if (!todo) return null

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-6 pt-8 pb-16">
      <Link href="/todos" className="text-muted-foreground hover:text-foreground w-fit text-sm">
        ← Back to todos
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-base leading-snug font-medium wrap-break-word">
              {todo.text}
            </CardTitle>
            <Badge variant={todo.done ? "secondary" : "default"} className="shrink-0">
              {todo.done ? "Completed" : "Open"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-muted-foreground text-xs">
            Created {format(new Date(todo.createdAt), "MMMM d, yyyy 'at' h:mm a")}
          </p>
          <div className="flex items-center justify-between">
            <Gate resource="todos" action="update">
              <label className="flex cursor-pointer items-center gap-2 text-sm select-none">
                <Checkbox
                  checked={todo.done}
                  disabled={toggle.isPending}
                  onCheckedChange={checked => toggle.mutate({ id: todo.id, done: !!checked })}
                />
                Mark as {todo.done ? "incomplete" : "complete"}
              </label>
            </Gate>
            <Gate resource="todos" action="delete">
              <Button
                variant="ghost"
                size="icon-sm"
                disabled={remove.isPending}
                onClick={() => remove.mutate(todo.id)}
                aria-label="Delete todo"
              >
                <HugeiconsIcon icon={Delete02Icon} size={16} />
              </Button>
            </Gate>
          </div>
        </CardContent>
      </Card>

      {/* ── Admin-only audit card ──────────────────────────────────── */}
      <Gate resource="admin" action="access">
        <Card className="border-dashed">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <HugeiconsIcon icon={InformationCircleIcon} size={16} />
              Admin audit
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground flex flex-col gap-2 text-xs">
            <div className="flex justify-between">
              <span>Todo ID</span>
              <code className="text-foreground font-mono">{todo.id}</code>
            </div>
            <div className="flex justify-between">
              <span>Created</span>
              <code className="text-foreground">{todo.createdAt}</code>
            </div>
          </CardContent>
        </Card>
      </Gate>
    </div>
  )
}
