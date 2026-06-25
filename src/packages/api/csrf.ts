import { env } from "@/env"

function decodeCookieValue(value: string) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export function readXsrfToken() {
  if (typeof document === "undefined") {
    return null
  }

  const token = document.cookie
    .split(";")
    .map(part => part.trim())
    .find(part => part.startsWith("XSRF-TOKEN="))

  if (!token) {
    return null
  }

  return decodeCookieValue(token.slice("XSRF-TOKEN=".length))
}

export async function ensureCsrfCookie() {
  if (typeof window === "undefined") {
    return
  }

  await fetch(env.NEXT_PUBLIC_SANCTUM_CSRF_URL, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  })
}
