"use client"

import { useCallback, useState } from "react"

import { useQuery } from "@tanstack/react-query"

import { Alert, AlertDescription, AlertTitle } from "@/core/components/ui/alert"

import type { Todo } from "../api/todos.schema"
import { todoListQueryOptions } from "../lib/query-options"
import { computeTodoStats } from "../lib/todo-table-utils"

import { todoColumns } from "./columns"
import { DataTable } from "./data-table"
import { TodoCharts } from "./todo-charts"
import { TodoStatsCards } from "./todo-stats-cards"

export function TodoAnalytics() {
  const { data: todos, error, isError, isLoading } = useQuery(todoListQueryOptions())

  const [filtered, setFiltered] = useState<Todo[] | null>(null)
  const visibleTodos = filtered ?? todos ?? []

  const stats = computeTodoStats(visibleTodos)

  const handleFilteredChange = useCallback((rows: Todo[]) => {
    setFiltered(rows)
  }, [])

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 pt-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Todo Analytics</h1>
          <p className="text-muted-foreground text-sm">
            Track your productivity with real-time insights
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <TodoStatsCards stats={stats} isLoading={isLoading} />

      {isError ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to load analytics</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : "Please refresh and try again."}
          </AlertDescription>
        </Alert>
      ) : (
        <TodoCharts todos={visibleTodos} isLoading={isLoading} />
      )}

      {/* Data Table with integrated toolbar & filters */}
      <DataTable
        columns={todoColumns}
        data={todos ?? []}
        isLoading={isLoading}
        onFilteredChange={handleFilteredChange}
      />
    </div>
  )
}
