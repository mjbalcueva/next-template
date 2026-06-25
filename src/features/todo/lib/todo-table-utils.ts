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
