"use client"

import { useCallback, useEffect, useRef } from "react"

/**
 * Returns [inputRef, handleChange] for an uncontrolled `<Input>`.
 * Typing updates the DOM immediately; the debounced value commits to `onCommit`.
 * When `value` changes externally (clear-all, etc.), the input's DOM value syncs via effect.
 *
 * @example
 * const [ref, onChange] = useDebouncedInput(search, setSearch, 300)
 * <Input ref={ref} defaultValue={search} onChange={onChange} />
 */
export function useDebouncedInput(
  value: string,
  onCommit: (v: string) => void,
  delay = 300
): [React.RefObject<HTMLInputElement | null>, () => void] {
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onCommitRef = useRef(onCommit)

  useEffect(() => {
    onCommitRef.current = onCommit
  })

  // Sync DOM when external value changes
  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== value) {
      inputRef.current.value = value
    }
  }, [value])

  const handleChange = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      if (inputRef.current) {
        onCommitRef.current(inputRef.current.value)
      }
    }, delay)
  }, [delay])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return [inputRef, handleChange]
}
