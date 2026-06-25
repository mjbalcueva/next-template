import { type z, type ZodType } from "zod"

import { env } from "@/env"

// ─── API Error types ───────────────────────────────────────────────────

export type ApiValidationErrors = Record<string, string[]>

export class ApiError extends Error {
  status: number
  data: unknown
  validationErrors?: ApiValidationErrors

  constructor({
    message,
    status,
    data,
    validationErrors,
  }: {
    message: string
    status: number
    data?: unknown
    validationErrors?: ApiValidationErrors
  }) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
    this.validationErrors = validationErrors
  }
}

export function getApiErrorMessage(error: unknown, fallback = "Something went wrong.") {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return fallback
}

// ─── CSRF helpers ──────────────────────────────────────────────────────

function decodeCookieValue(value: string) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export function readXsrfToken() {
  if (typeof document === "undefined") return null

  const token = document.cookie
    .split(";")
    .map(part => part.trim())
    .find(part => part.startsWith("XSRF-TOKEN="))

  if (!token) return null
  return decodeCookieValue(token.slice("XSRF-TOKEN=".length))
}

export async function ensureCsrfCookie() {
  if (typeof window === "undefined") return

  await fetch(env.NEXT_PUBLIC_SANCTUM_CSRF_URL, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  })
}

// ─── Fetch internals ───────────────────────────────────────────────────

type ApiBase = "api" | "auth"

type ApiFetchOptions<TSchema extends ZodType | undefined> = Omit<
  RequestInit,
  "body" | "credentials" | "headers"
> & {
  base?: ApiBase
  body?: unknown
  headers?: HeadersInit
  params?: Record<string, string | number | boolean | null | undefined>
  query?: Record<string, string | number | boolean | null | undefined>
  schema?: TSchema
  csrf?: boolean
}

function getBaseUrl(base: ApiBase) {
  return base === "auth" ? env.NEXT_PUBLIC_AUTH_URL : env.NEXT_PUBLIC_API_URL
}

function isAbsoluteUrl(value: string) {
  return /^https?:\/\//i.test(value)
}

function trimSlashes(value: string) {
  return value.replace(/^\/+|\/+$/g, "")
}

function buildApiUrl(
  path: string,
  base: ApiBase,
  params?: ApiFetchOptions<ZodType | undefined>["params"],
  query?: ApiFetchOptions<ZodType | undefined>["query"]
) {
  const replacedPath = Object.entries(params ?? {}).reduce((currentPath, [key, value]) => {
    if (value === null || value === undefined) return currentPath
    return currentPath.replace(`:${key}`, encodeURIComponent(String(value)))
  }, path)

  const url = new URL(
    isAbsoluteUrl(replacedPath)
      ? replacedPath
      : `${getBaseUrl(base).replace(/\/$/, "")}/${trimSlashes(replacedPath)}`
  )

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== null && value !== undefined && value !== "")
      url.searchParams.set(key, String(value))
  }

  return url
}

function isMutatingMethod(method: string) {
  return !["GET", "HEAD", "OPTIONS"].includes(method.toUpperCase())
}

function isJsonLike(value: unknown) {
  return (
    value !== null &&
    typeof value === "object" &&
    !(value instanceof FormData) &&
    !(value instanceof Blob) &&
    !(value instanceof ArrayBuffer)
  )
}

async function getServerRequestHeaders(): Promise<Record<string, string>> {
  if (typeof window !== "undefined") return {}

  try {
    const { cookies, headers } = await import("next/headers")
    const cookieHeader = (await cookies()).toString()
    const incomingHeaders = await headers()
    const origin = incomingHeaders.get("origin") ?? env.NEXT_PUBLIC_APP_URL

    return {
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
      origin,
      referer: origin,
    }
  } catch {
    return {
      origin: env.NEXT_PUBLIC_APP_URL,
      referer: env.NEXT_PUBLIC_APP_URL,
    }
  }
}

function getErrorMessage(data: unknown, status: number) {
  if (data && typeof data === "object") {
    const record = data as { message?: unknown; error?: unknown }
    if (typeof record.message === "string") return record.message
    if (typeof record.error === "string") return record.error
  }

  if (status === 419) return "Your session expired. Please try again."
  if (status === 401) return "Please log in to continue."
  if (status === 403) return "You do not have permission to perform this action."
  return `Request failed with status ${status}.`
}

function getValidationErrors(data: unknown): ApiValidationErrors | undefined {
  if (!data || typeof data !== "object" || !("errors" in data)) return undefined

  const errors = (data as { errors?: unknown }).errors
  if (!errors || typeof errors !== "object") return undefined

  const validationErrors: ApiValidationErrors = {}

  for (const [key, value] of Object.entries(errors)) {
    if (Array.isArray(value)) {
      const messages = value.filter((item): item is string => typeof item === "string")
      if (messages.length > 0) validationErrors[key] = messages
      continue
    }
    if (typeof value === "string") validationErrors[key] = [value]
  }

  return Object.keys(validationErrors).length > 0 ? validationErrors : undefined
}

// ─── Public fetch ──────────────────────────────────────────────────────

export async function apiFetch<TSchema extends ZodType | undefined = undefined>(
  path: string,
  {
    base = "api",
    body,
    headers,
    params,
    query,
    schema,
    csrf = true,
    method = body === undefined ? "GET" : "POST",
    cache = "no-store",
    ...init
  }: ApiFetchOptions<TSchema> = {}
): Promise<TSchema extends ZodType ? z.infer<TSchema> : unknown> {
  const requestMethod = method.toUpperCase()

  if (csrf && isMutatingMethod(requestMethod) && typeof window !== "undefined")
    await ensureCsrfCookie()

  const requestHeaders = new Headers(headers)
  requestHeaders.set("Accept", "application/json")
  if (isJsonLike(body) && !requestHeaders.has("Content-Type"))
    requestHeaders.set("Content-Type", "application/json")

  const xsrfToken = readXsrfToken()
  if (xsrfToken && isMutatingMethod(requestMethod)) requestHeaders.set("X-XSRF-TOKEN", xsrfToken)

  const serverHeaders = await getServerRequestHeaders()
  for (const [key, value] of Object.entries(serverHeaders)) {
    if (value && !requestHeaders.has(key)) requestHeaders.set(key, value)
  }

  const response = await fetch(buildApiUrl(path, base, params, query), {
    ...init,
    cache,
    method: requestMethod,
    credentials: "include",
    headers: requestHeaders,
    body:
      body === undefined ? undefined : isJsonLike(body) ? JSON.stringify(body) : (body as BodyInit),
  })

  const contentType = response.headers.get("content-type")
  const hasJson = contentType?.includes("application/json")
  const data =
    response.status === 204 ? undefined : hasJson ? await response.json() : await response.text()

  if (!response.ok) {
    throw new ApiError({
      status: response.status,
      data,
      message: getErrorMessage(data, response.status),
      validationErrors: getValidationErrors(data),
    })
  }

  if (!schema) return data as TSchema extends ZodType ? z.infer<TSchema> : unknown
  return schema.parse(data) as TSchema extends ZodType ? z.infer<TSchema> : unknown
}
