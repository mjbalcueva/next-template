"use client"

import { useMemo } from "react"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/core/components/ui/chart"
import { Skeleton } from "@/core/components/ui/skeleton"

import type { Todo } from "../api/todos.schema"
import { computeTodoStats, groupTodosByDate } from "../lib/todo-table-utils"

interface TodoChartsProps {
  todos: Todo[]
  isLoading: boolean
}

const chartConfig = {
  open: { label: "Open", color: "var(--chart-2)" },
  done: { label: "Done", color: "var(--chart-1)" },
} satisfies ChartConfig

export function TodoCharts({ todos, isLoading }: TodoChartsProps) {
  const stats = useMemo(() => computeTodoStats(todos), [todos])
  const dateGroups = useMemo(() => groupTodosByDate(todos), [todos])

  const pieData = useMemo(
    () => [
      { name: "done", value: stats.done, fill: "var(--chart-1)" },
      { name: "open", value: stats.open, fill: "var(--chart-2)" },
    ],
    [stats]
  )

  const barData = useMemo(
    () =>
      dateGroups.map(g => ({
        date: g.date,
        Total: g.count,
        Done: g.done,
        Open: g.count - g.done,
      })),
    [dateGroups]
  )

  if (isLoading) {
    return (
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="aspect-square w-full rounded-full" />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {/* ── Donut: Open vs Done ── */}
      <Card className="lg:col-span-2" size="sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Status Breakdown</CardTitle>
          <CardDescription>Open vs. completed todos</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} initialDimension={{ width: 300, height: 250 }}>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  strokeWidth={2}
                >
                  {pieData.map(entry => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="mt-2 flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="bg-chart-1 h-3 w-3 rounded-sm" />
              <span className="text-muted-foreground">Done ({stats.done})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-chart-2 h-3 w-3 rounded-sm" />
              <span className="text-muted-foreground">Open ({stats.open})</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Bar: Todos over time ── */}
      <Card className="lg:col-span-3" size="sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Todos Over Time</CardTitle>
          <CardDescription>Created per day (stacked by status)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} initialDimension={{ width: 500, height: 280 }}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} barGap={0} barCategoryGap="20%">
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={d => {
                    const [, m, day] = d.split("-")
                    return `${m}/${day}`
                  }}
                />
                <YAxis tickLine={false} axisLine={false} allowDecimals={false} width={28} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px" }}
                  labelFormatter={d => `Date: ${d}`}
                />
                <Bar dataKey="Done" stackId="a" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Open" stackId="a" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
