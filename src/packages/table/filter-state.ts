export type ActiveFilterBadge = {
  clear: () => void
  key: string
  label: string
}

export type FilterBadgeDefinition<TFilters extends Record<string, unknown>> = {
  emptyValue: TFilters[keyof TFilters]
  key: keyof TFilters
  label: (value: NonNullable<TFilters[keyof TFilters]>) => string
}

export function createActiveFilterBadges<TFilters extends Record<string, unknown>>({
  definitions,
  filters,
  setFilter,
}: {
  definitions: FilterBadgeDefinition<TFilters>[]
  filters: TFilters
  setFilter: <TKey extends keyof TFilters>(key: TKey, value: TFilters[TKey]) => void
}) {
  return definitions.flatMap<ActiveFilterBadge>(definition => {
    const value = filters[definition.key]
    if (value === definition.emptyValue) {
      return []
    }

    return {
      key: String(definition.key),
      label: definition.label(value as NonNullable<TFilters[keyof TFilters]>),
      clear: () => setFilter(definition.key, definition.emptyValue),
    }
  })
}

export function getColumnFilterKey<TFilters extends Record<string, unknown>>(
  filters: TFilters,
  columnId: string
) {
  const key = `col_${columnId}` as keyof TFilters
  return key in filters ? key : null
}
