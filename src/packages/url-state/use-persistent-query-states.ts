"use client"

import { useCallback, useEffect, useRef } from "react"

import {
  useQueryStates,
  type UseQueryStatesKeysMap,
  type UseQueryStatesOptions,
  type Values,
} from "nuqs"

type PersistentQueryStatesOptions<TParsers extends UseQueryStatesKeysMap> = {
  options?: Partial<UseQueryStatesOptions<TParsers>>
  parsers: TParsers
  persist?: boolean
  storageKey?: string
}

function hasUrlSearchParams() {
  return typeof window !== "undefined" && window.location.search.length > 0
}

function readStoredValues<TParsers extends UseQueryStatesKeysMap>(storageKey: string) {
  if (typeof window === "undefined") {
    return {}
  }

  try {
    const raw = localStorage.getItem(storageKey)
    return raw ? (JSON.parse(raw) as Partial<Values<TParsers>>) : {}
  } catch {
    return {}
  }
}

function writeStoredValues(storageKey: string, values: unknown) {
  if (typeof window === "undefined") {
    return
  }

  try {
    localStorage.setItem(storageKey, JSON.stringify(values))
  } catch {
    /* Storage can be unavailable or full. URL state remains canonical. */
  }
}

export function usePersistentQueryStates<TParsers extends UseQueryStatesKeysMap>({
  options,
  parsers,
  persist = false,
  storageKey,
}: PersistentQueryStatesOptions<TParsers>) {
  const [values, setValues] = useQueryStates(parsers, options)
  const hydrated = useRef(false)

  useEffect(() => {
    if (hydrated.current || !persist || !storageKey || hasUrlSearchParams()) {
      hydrated.current = true
      return
    }

    hydrated.current = true
    const stored = readStoredValues<TParsers>(storageKey)
    if (Object.keys(stored).length > 0) {
      void setValues(stored)
    }
  }, [persist, setValues, storageKey])

  useEffect(() => {
    if (persist && storageKey) {
      writeStoredValues(storageKey, values)
    }
  }, [persist, storageKey, values])

  const clearStoredValues = useCallback(() => {
    if (typeof window !== "undefined" && storageKey) {
      localStorage.removeItem(storageKey)
    }
  }, [storageKey])

  return [values, setValues, { clearStoredValues }] as const
}
