import type { Todo } from "../api/todos.schema"

export interface TodoStats {
  total: number
  done: number
  open: number
  completionRate: number
}

export function computeTodoStats(todos: Todo[]): TodoStats {
  const total = todos.length
  const done = todos.filter(t => t.done).length
  const open = total - done
  return {
    total,
    done,
    open,
    completionRate: total > 0 ? Math.round((done / total) * 100) : 0,
  }
}

/** Group todos by creation date (YYYY-MM-DD) for time-series charts. */
export function groupTodosByDate(todos: Todo[]): { date: string; count: number; done: number }[] {
  const map = new Map<string, { count: number; done: number }>()
  for (const t of todos) {
    const date = t.createdAt.slice(0, 10)
    const entry = map.get(date) ?? { count: 0, done: 0 }
    entry.count++
    if (t.done) entry.done++
    map.set(date, entry)
  }
  return Array.from(map.entries())
    .map(([date, v]) => ({ date, ...v }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function buildStatusBreakdown(todos: Todo[]) {
  const stats = computeTodoStats(todos)
  return [
    { name: "done", value: stats.done, fill: "var(--chart-1)" },
    { name: "open", value: stats.open, fill: "var(--chart-2)" },
  ]
}

export function buildTodoTrend(todos: Todo[]) {
  return groupTodosByDate(todos).map(group => ({
    date: group.date,
    done: group.done,
    open: group.count - group.done,
    total: group.count,
    completionRate: group.count > 0 ? Math.round((group.done / group.count) * 100) : 0,
  }))
}

export function buildTodoVolumeByStatus(todos: Todo[]) {
  const stats = computeTodoStats(todos)
  return [
    { status: "Open", count: stats.open, fill: "var(--chart-2)" },
    { status: "Completed", count: stats.done, fill: "var(--chart-1)" },
  ]
}
