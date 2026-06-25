"use client"

import {
  CheckListIcon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  Target03Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Card, CardDescription, CardHeader, CardTitle } from "@/core/components/ui/card"
import { Skeleton } from "@/core/components/ui/skeleton"

import type { TodoStats } from "../../lib/todo-table-utils"

interface TodoStatsCardsProps {
  stats: TodoStats | null
  isLoading: boolean
}

export function TodoStatsCards({ stats, isLoading }: TodoStatsCardsProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} size="sm">
            <CardHeader>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-12" />
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: "Total Todos",
      value: stats.total,
      icon: CheckListIcon,
      description: "All todos",
    },
    {
      title: "Open",
      value: stats.open,
      icon: Clock01Icon,
      description: "Awaiting completion",
    },
    {
      title: "Completed",
      value: stats.done,
      icon: CheckmarkCircle01Icon,
      description: "Finished",
    },
    {
      title: "Completion Rate",
      value: `${stats.completionRate}%`,
      icon: Target03Icon,
      description: `${stats.done} of ${stats.total}`,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(card => (
        <Card key={card.title} size="sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardDescription>{card.title}</CardDescription>
              <HugeiconsIcon icon={card.icon} className="text-muted-foreground" size={20} />
            </div>
            <div className="flex items-baseline gap-2">
              <CardTitle className="text-2xl font-bold tabular-nums">{card.value}</CardTitle>
              <span className="text-muted-foreground text-xs">{card.description}</span>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
