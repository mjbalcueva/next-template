"use client"

import { useMemo } from "react"

import {
  Area,
  AreaChart,
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/core/components/ui/chart"

import { ChartEmptyState, ChartPanel, ChartSkeleton } from "@/packages/analytics/chart-panel"

import type { Todo } from "../api/todos.schema"
import {
  buildStatusBreakdown,
  buildTodoTrend,
  buildTodoVolumeByStatus,
  computeTodoStats,
} from "../lib/todo-table-utils"

interface TodoChartsProps {
  todos: Todo[]
  isLoading: boolean
}

const chartConfig = {
  open: { label: "Open", color: "var(--chart-2)" },
  done: { label: "Done", color: "var(--chart-1)" },
  total: { label: "Total", color: "var(--chart-3)" },
  completionRate: { label: "Completion rate", color: "var(--chart-4)" },
  count: { label: "Count", color: "var(--chart-5)" },
} satisfies ChartConfig

export function TodoCharts({ todos, isLoading }: TodoChartsProps) {
  const stats = useMemo(() => computeTodoStats(todos), [todos])
  const pieData = useMemo(() => buildStatusBreakdown(todos), [todos])
  const trendData = useMemo(() => buildTodoTrend(todos), [todos])
  const statusVolumeData = useMemo(() => buildTodoVolumeByStatus(todos), [todos])
  const hasData = todos.length > 0

  if (isLoading) {
    return (
      <div className="grid gap-4 lg:grid-cols-6">
        <ChartSkeleton className="lg:col-span-2" shape="circle" />
        <ChartSkeleton className="lg:col-span-4" />
        <ChartSkeleton className="lg:col-span-3" />
        <ChartSkeleton className="lg:col-span-3" />
      </div>
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-6">
      <ChartPanel
        className="lg:col-span-2"
        title="Status Breakdown"
        description="Open vs. completed todos"
      >
        {hasData ? (
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
        ) : (
          <ChartEmptyState title="No status data" />
        )}
        {hasData && (
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
        )}
      </ChartPanel>

      <ChartPanel
        className="lg:col-span-4"
        title="Todos Over Time"
        description="Created per day, stacked by status"
      >
        {hasData ? (
          <ChartContainer config={chartConfig} initialDimension={{ width: 500, height: 280 }}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={trendData} barGap={0} barCategoryGap="20%">
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
                <Bar dataKey="done" stackId="a" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="open" stackId="a" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <ChartEmptyState title="No time-series data" />
        )}
      </ChartPanel>

      <ChartPanel
        className="lg:col-span-3"
        title="Completion Trend"
        description="Daily completion rate"
      >
        {hasData ? (
          <ChartContainer config={chartConfig} initialDimension={{ width: 500, height: 260 }}>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="completionRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-4)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--chart-4)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
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
                <YAxis tickLine={false} axisLine={false} domain={[0, 100]} width={34} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="completionRate"
                  stroke="var(--chart-4)"
                  fill="url(#completionRate)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <ChartEmptyState title="No trend data" />
        )}
      </ChartPanel>

      <ChartPanel
        className="lg:col-span-3"
        title="Status Volume"
        description="Categorical count by status"
      >
        {hasData ? (
          <ChartContainer config={chartConfig} initialDimension={{ width: 500, height: 260 }}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={statusVolumeData} layout="vertical" margin={{ left: 16 }}>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" tickLine={false} axisLine={false} allowDecimals={false} />
                <YAxis
                  dataKey="status"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {statusVolumeData.map(entry => (
                    <Cell key={entry.status} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <ChartEmptyState title="No category data" />
        )}
      </ChartPanel>
    </div>
  )
}
