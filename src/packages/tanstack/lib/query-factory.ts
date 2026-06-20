/**
 * TanStack Query key factory helpers.
 *
 * Following Tanner Linsley's recommended pattern:
 *   - Use key factories to avoid string duplication
 *   - Use `queryOptions()` for reusable query definitions
 *   - Separate query configs from mutation hooks
 */

/**
 * Creates a typed query key factory for a feature domain.
 */
export function createQueryKeys<
  const TBase extends string,
  const TSubKeys extends readonly string[],
>(base: TBase, subKeys: TSubKeys) {
  type Factory = {
    all: readonly [TBase]
  } & {
    [K in TSubKeys[number]]: (...args: string[]) => readonly [TBase, K, ...string[]]
  }

  const factory = {
    all: [base],
  } as Factory

  for (const key of subKeys) {
    ;(factory as Record<string, unknown>)[key] = (...args: string[]) => [base, key, ...args]
  }

  return factory
}
