/**
 * TanStack Query key factory — 2026 standard (object keys).
 *
 * Object-based keys enable:
 * - Named destructuring from {@link QueryFunctionContext}
 * - Order-independent fuzzy matching for cache invalidation
 * - Better type safety than positional tuples
 *
 * @example
 * const todoKeys = {
 *   all:     k("todos"),
 *   lists:   () => k("todos", { entity: "list" }),
 *   list:    (status?: string) => k("todos", { entity: "list", status }),
 *   details: () => k("todos", { entity: "detail" }),
 *   detail:  (id: string) => k("todos", { entity: "detail", id }),
 * }
 *
 * // Invalidation — fuzzy match all lists:
 * queryClient.invalidateQueries({ queryKey: k("todos", { entity: "list" }) })
 *
 * // Invalidation — everything todo-related:
 * queryClient.invalidateQueries({ queryKey: k("todos") })
 */
export function k<TScope extends string>(scope: TScope): readonly [{ scope: TScope }]
export function k<TScope extends string, TExtra extends Record<string, unknown>>(
  scope: TScope,
  extra: TExtra
): readonly [{ scope: TScope } & TExtra]
export function k(scope: string, extra?: Record<string, unknown>) {
  return [{ scope, ...extra }] as const
}
